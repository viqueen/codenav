import {
    Input,
    Page,
    Provider,
    ProviderOptions,
    RestClient,
    Store,
    UrlParts
} from '../main';
import { itemTransformer } from '../util/ItermUtil';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { BaseProvider } from './BaseProvider';

export class StashProvider extends BaseProvider {
    readonly client!: RestClient;
    readonly store!: Store;
    readonly instance!: UrlParts;

    constructor(instance: UrlParts, token: string, store: Store) {
        super(
            store,
            new DefaultRestClient({
                host: instance.host,
                port: instance.port,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            { start: 0, limit: 100 }
        );
    }

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input> {
        return json.values
            .filter((item: any) => item.project.key === namespace)
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
        if (!query) {
            throw new Error();
        }
        console.log(query);
        return this.client
            ._get(`/rest/api/1.0/projects/${options.namespace}/repos`, query)
            .then((response) => {
                const nextQuery =
                    response.isLastPage === true
                        ? undefined
                        : { start: response.nextPageStart, limit: 100 };
                return {
                    data: response,
                    next: nextQuery
                };
            });
    }
}
