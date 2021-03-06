import { Input, Page, ProviderOptions, RestClient, Store } from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { BaseProvider } from './BaseProvider';

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
        console.log(json);
        return json.values
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
        // TODO : handle paging
        return this.client
            ._get(`/2.0/repositories/${options.namespace}`, query)
            .then((response) => response.body)
            .then((response) => ({
                data: response,
                next: undefined
            }));
    }
}
