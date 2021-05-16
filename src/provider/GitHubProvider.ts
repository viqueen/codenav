import { Input, Link, Page, ProviderOptions, RestClient, Store } from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { linkParser } from '../util/ItermUtil';
import { BaseProvider } from './BaseProvider';

export class GitHubProvider extends BaseProvider {
    readonly client!: RestClient;
    readonly store!: Store;

    constructor(store: Store) {
        super(
            store,
            new DefaultRestClient({
                host: 'api.github.com'
            })
        );
    }

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input> {
        return json.map((item: any) => ({
            connection: item['ssh_url'],
            workspace: workspace,
            aliases: []
        }));
    }

    _sendRequest(
        options: ProviderOptions,
        query: any | undefined
    ): Promise<Page> {
        console.log(query);
        return this.client
            ._get(`/users/${options.namespace}/repos`, query)
            .then((response) => {
                const links = response.headers.link
                    .split(/\s*,\s*/)
                    .map((link: string) => linkParser(link))
                    .filter((link: Link | undefined) => {
                        if (link && link.rel === 'next') {
                            return link;
                        }
                    });
                const next = links.length === 1 ? links[0].query : undefined;
                return {
                    data: response.body,
                    next: next
                };
            });
    }
}
