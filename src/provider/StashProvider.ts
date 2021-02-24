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

export class StashProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;
    readonly instance!: UrlParts;

    constructor(instance: UrlParts, token: string, store: Store) {
        this.store = store;
        this.client = new DefaultRestClient({
            host: instance.host,
            port: instance.port,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
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

    register(options: ProviderOptions): void {
        console.log(options);
        const { workspace, namespace } = options;
        if (!namespace) {
            return;
        }
        this.client
            ._get(`/rest/api/1.0/projects/${namespace}/repos`)
            .then((json) =>
                this._extractConnectionUrls(json, workspace, namespace)
            )
            .then((items) => {
                items
                    .map((input) => itemTransformer(input))
                    .forEach((item) => {
                        if (item) {
                            this.store.add(item);
                        }
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
