import { Input, Page, ProviderOptions, RestClient, Store } from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
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
        // TODO : handle paging
        return this.client
            ._get(`/users/${options.namespace}/repos`, query)
            .then((response) => ({
                data: response,
                next: undefined
            }));
    }
}