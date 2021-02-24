import { Input, Provider, ProviderOptions, RestClient, Store } from '../main';
import { DefaultRestClient } from '../service/DefaultRestClient';
import { itemTransformer } from '../util/ItermUtil';

export class GitHubProvider implements Provider {
    readonly client!: RestClient;
    readonly store!: Store;

    constructor(store: Store) {
        this.store = store;
        this.client = new DefaultRestClient({
            host: 'api.github.com'
        });
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

    register(options: ProviderOptions): void {
        console.log(options);
        const { workspace, namespace } = options;
        if (!namespace) {
            return;
        }
        this.client
            ._get(`/users/${namespace}/repos`)
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
