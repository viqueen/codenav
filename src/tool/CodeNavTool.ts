import { CodeNavService } from '../service/CodeNavService';
import { CodeNavItemSupplier } from './CodeNavItemSupplier';

export class CodeNavTool implements CodeNav {
    readonly configuration!: Configuration;
    readonly store!: Store;
    readonly service!: Service;
    readonly itemSupplier!: ItemSupplier;

    constructor(configuration: Configuration, store: Store) {
        this.configuration = configuration;
        this.store = store;
        this.service = new CodeNavService(store);
        this.itemSupplier = new CodeNavItemSupplier();
    }

    register(input: Input): Promise<Item> {
        const item = this.itemSupplier.parse(input);
        if (!item) {
            throw new Error(`invalid connection url : ${input.connection}`);
        }
        console.log(`registering: ${input}`);
        return this.store.add(item);
    }

    list(itemFilter: ItemFilter): Promise<Array<Item>> {
        return this.store.list(itemFilter);
    }

    remove(itemFilter: ItemFilter): Promise<Array<Item>> {
        return this.store.remove(itemFilter);
    }
}
