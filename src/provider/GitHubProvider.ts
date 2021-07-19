import {
    Configuration,
    Input,
    Link,
    Page,
    ProviderOptions,
    RestClient,
    Store
} from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { linkParser } from '../util/ItermUtil';
import { BaseProvider } from './BaseProvider';

export class GitHubProvider extends BaseProvider {
    readonly client!: RestClient;
    readonly store!: Store;
    readonly org!: boolean;

    constructor(store: Store, configuration: Configuration, org?: boolean) {
        super(
            store,
            new DefaultRestClient({
                host: 'api.github.com',
                headers:
                    configuration.get('github.personal.token') &&
                    configuration.get('github.username')
                        ? {
                              Authorization: `Basic ${Buffer.from(
                                  configuration.get('github.username') +
                                      ':' +
                                      configuration.get('github.personal.token')
                              ).toString('base64')}`
                          }
                        : {}
            })
        );
        this.org = org || false;
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
        return this.client
            ._get(
                `/${this.org ? 'orgs' : 'users'}/${options.namespace}/repos`,
                query
            )
            .then((response) => {
                const links = response.headers.links
                    ? response.headers.link
                          .split(/\s*,\s*/)
                          .map((link: string) => linkParser(link))
                          .filter((link: Link | undefined) => {
                              if (link && link.rel === 'next') {
                                  return link;
                              }
                          })
                    : [];
                const next = links.length === 1 ? links[0].query : undefined;
                return {
                    data: response.body,
                    next: next
                };
            });
    }
}
