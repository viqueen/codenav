import {
    Input,
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
            })
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

    _sendRequest(options: ProviderOptions): Promise<any> {
        return this.client._get(
            `/rest/api/1.0/projects/${options.namespace}/repos`
        );
    }
}
