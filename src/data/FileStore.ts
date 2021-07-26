import { Configuration, Input, Item, ItemFilter, Store } from '../main';
import { readdirSync } from 'fs';
import { itemTransformer } from '../util/ItermUtil';

export class FileStore implements Store {
    readonly configuration!: Configuration;
    readonly rootDirectory!: string;
    readonly items!: Map<string, Item>;

    constructor(configuration: Configuration, workspace: string) {
        this.configuration = configuration;
        this.rootDirectory = configuration.get(`cnav.${workspace}.store`);
        this.items = new Map<string, Item>();
        readdirSync(this.rootDirectory).forEach((file) => {
            const data: any = require(`${this.rootDirectory}/${file}`);
            const { connection, aliases } = data;
            const input: Input = {
                connection: connection,
                aliases: aliases || [],
                workspace: workspace
            };
            const item = itemTransformer(input);
            if (item) {
                this.items.set(item.ID, item);
            }
        });
    }

    add(item: Item): Promise<void> {
        throw new Error('not supported');
    }

    get(key: string): Promise<Item> {
        const item = this.items.get(key);
        return new Promise<Item>((resolve, reject) => {
            if (item) {
                resolve(item);
            } else {
                reject();
            }
        });
    }

    list(filter: ItemFilter): Promise<Array<Item>> {
        return new Promise<Array<Item>>((resolve) => {
            const result: Array<Item> = [];
            this.items.forEach((value) => {
                if (filter(value)) {
                    result.push(value);
                }
            });
            resolve(result);
        });
    }

    remove(filter: ItemFilter): Promise<Array<Item>> {
        throw new Error('not supported');
    }

    close(): Promise<void> {
        return Promise.resolve();
    }
}
