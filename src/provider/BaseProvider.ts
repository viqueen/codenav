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

    _handle(options: ProviderOptions, query: any) {
        if (!query) {
            throw new Error();
        }
        const { workspace, namespace } = options;
        this._sendRequest(options, query)
            .then((page) => {
                const { data, next } = page;
                this._extractConnectionUrls(data, workspace, namespace)
                    .map((input) => itemTransformer(input))
                    .forEach((item) => {
                        if (item && options.itemFilter(item)) {
                            // noinspection JSIgnoredPromiseFromCall
                            this.store.add(item);
                            console.log(
                                `registered on workspace: ${item.workspace} / ${item.connection}`
                            );
                        }
                    });
                return next;
            })
            .then((nextQuery) => {
                return this._handle(options, nextQuery);
            })
            .catch(() => {});
    }

    register(options: ProviderOptions): void {
        this._handle(options, this.initialQuery);
    }
}
