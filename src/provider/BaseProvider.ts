import {
    Input,
    Page,
    Provider,
    ProviderOptions,
    RestClient,
    Store
} from '../main';
import { itemTransformer } from '../util/ItermUtil';

export class BaseProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;
    readonly initialQuery!: any;

    constructor(store: Store, client: RestClient, initialQuery: any = {}) {
        this.store = store;
        this.client = client;
        this.initialQuery = initialQuery;
    }

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input> {
        throw new Error();
    }

    _sendRequest(
        options: ProviderOptions,
        query: any | undefined
    ): Promise<Page> {
        throw new Error();
    }

    register(options: ProviderOptions): void {
        const { workspace, namespace } = options;
        this._sendRequest(options, this.initialQuery)
            .then((page) => {
                const { data, next } = page;
                this._extractConnectionUrls(data, workspace, namespace)
                    .map((input) => itemTransformer(input))
                    .forEach((item) => {
                        if (item) {
                            this.store.add(item);
                        }
                    });
                return next;
            })
            .then((query) => {
                return this._sendRequest(options, query);
            })
            .catch(() => {});
    }
}
