import {
    Input,
    Page,
    Provider,
    ProviderOptions,
    RestClient,
    Store
} from '../main';
import { itemTransformer } from '../util/ItemUtil';

export class BaseProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;
    readonly initialQuery!: any;

    constructor(store: Store, client: RestClient, initialQuery: any = {}) {
        this.store = store;
        this.client = client;
        this.initialQuery = initialQuery;
    }

    _extractMetadata(
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

    _handle(options: ProviderOptions, query: any): Promise<any> {
        if (!query) {
            return Promise.resolve();
        }
        const { workspace, namespace } = options;
        return this._sendRequest(options, query)
            .then(async (page) => {
                const { data, next } = page;
                await Promise.all(
                    this._extractMetadata(data, workspace, namespace)
                        .map((input) => itemTransformer(input))
                        .map((item) => {
                            if (item && options.itemFilter(item)) {
                                return this.store.add(item).then(() => {
                                    console.log(
                                        `registered on workspace: ${item.workspace} / ${item.connection}`
                                    );
                                });
                            } else {
                                return Promise.resolve('filtered-out');
                            }
                        })
                );

                return next;
            })
            .then((nextQuery) => {
                return this._handle(options, nextQuery);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    register(options: ProviderOptions): Promise<any> {
        return this._handle(options, this.initialQuery);
    }
}
