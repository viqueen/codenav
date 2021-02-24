import { Input, Provider, ProviderOptions, RestClient, Store } from '../main';
import { itemTransformer } from '../util/ItermUtil';

export class BaseProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;

    constructor(store: Store, client: RestClient) {
        this.store = store;
        this.client = client;
    }

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input> {
        throw new Error();
    }

    _sendRequest(options: ProviderOptions): Promise<any> {
        throw new Error();
    }

    register(options: ProviderOptions): void {
        const { workspace, namespace } = options;
        this._sendRequest(options)
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
