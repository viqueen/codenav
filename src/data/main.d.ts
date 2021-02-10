interface Item {
    ID: string;
    connection: string;
    host: string;
    namespace: string;
    slug: string;
    aliases: Array<string>;
    workspace: string;
}

interface ItemFilter {
    (item: Item): boolean;
}

interface Store {
    add(item: Item): Promise<Item>;
    remove(filter: ItemFilter): Promise<Array<Item>>;
    list(filter: ItemFilter): Promise<Array<Item>>;
}
