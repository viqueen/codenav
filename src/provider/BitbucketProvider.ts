import {
    Input,
    Provider,
    ProviderOptions,
    RestClient,
    Store,
    UrlParts
} from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { itemTransformer } from '../util/ItermUtil';

export class BitbucketProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;

    constructor(store: Store) {
        this.store = store;
        this.client = new DefaultRestClient({
            host: 'api.bitbucket.org'
        });
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

    register(options: ProviderOptions): void {
        console.log(options);
        const { workspace, namespace } = options;
        if (!namespace) {
            return;
        }
        this.client
            ._get(`/2.0/repositories/${namespace}`)
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
