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
    set(key: string, value: string): void;
    get(ket: string): string;
}

interface Store {
    readonly configuration: Configuration;
    add(item: Item): Promise<Item>;
    remove(filter: ItemFilter): Promise<Array<Item>>;
    list(filter: ItemFilter): Promise<Array<Item>>;
}
