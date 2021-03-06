import { URL } from 'url';
import { Input, Page, ProviderOptions, RestClient, Store } from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { BaseProvider } from './BaseProvider';
import QueryString from 'query-string';

export class BitbucketProvider extends BaseProvider {
    readonly client!: RestClient;
    readonly store!: Store;

    constructor(store: Store) {
        super(
            store,
            new DefaultRestClient({
                host: 'api.bitbucket.org'
            })
        );
    }

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input> {
        return json
            .flatMap((item: any) => item.links.clone)
            .filter((item: any) => item.name === 'ssh')
            .map((item: any) => item.href)
            .map((connection: string) => ({
                connection: connection,
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
            ._get(`/2.0/repositories/${options.namespace}`, query)
            .then((response) => response.body)
            .then((body) => {
                const next =
                    body.next && body.next !== ''
                        ? new URL(body.next)
                        : undefined;
                const nextQuery = next
                    ? QueryString.parse(next.search)
                    : undefined;
                return {
                    data: body.values,
                    next: nextQuery
                };
            });
    }
}
