// data

interface Item {
    readonly ID: string;
    readonly connection: string;
    readonly host: string;
    readonly namespace: string;
    readonly slug: string;
    readonly aliases: Array<string>;
    readonly workspace: string;
}

interface ItemFilter {
    (item: Item): boolean;
}

interface Configuration {
    readonly directory: string;
    set(key: string, value: any): void;
    get(key: string): any;
}

interface Store {
    readonly configuration: Configuration;
    add(item: Item): Promise<void>;
    get(key: string): Promise<Item>;
    remove(filter: ItemFilter): Promise<Array<Item>>;
    list(filter: ItemFilter): Promise<Array<Item>>;
}

// CLI

interface Input {
    readonly connection: string;
    readonly workspace: string;
    readonly aliases: Array<string>;
}

interface ItemTransformer {
    (input: Input): Promise<Item>;
}
