import LevelUp from 'levelup';
import path from 'path';
import LevelDOWN from 'leveldown';
import __ from 'lodash';
import { Configuration, Item, ItemFilter, Store } from '../main';

export class LevelDBStore implements Store {
    readonly configuration!: Configuration;
    // @ts-ignore
    private db!: LevelUp;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
        const storeDirectory =
            configuration.get('cnav.store') || configuration.directory;
        const target = path.resolve(storeDirectory, `.cnav-db`);
        // @ts-ignore
        this.db = LevelUp(LevelDOWN(target));
    }

    add(item: Item): Promise<void> {
        return this.get(item.ID)
            .then((value: Item) => {
                const updated = __.merge({}, value, item);
                return this.db.put(item.ID, JSON.stringify(updated));
            })
            .catch(() => {
                return this.db.put(item.ID, JSON.stringify(item));
            });
    }

    get(key: string): Promise<Item> {
        return this.db.get(key).then((value: any) => JSON.parse(value));
    }

    list(filter: ItemFilter): Promise<Array<Item>> {
        return new Promise<Array<Item>>((resolve, reject) => {
            const items: Array<Item> = [];
            this.db
                .createValueStream()
                .on('data', (data: string) => {
                    const item: Item = JSON.parse(data.toString());
                    if (filter(item)) {
                        items.push(item);
                    }
                })
                .on('close', () => {
                    resolve(items);
                })
                .on('end', () => {
                    resolve(items);
                })
                .on('error', () => {
                    reject();
                });
        });
    }

    remove(filter: ItemFilter): Promise<Array<Item>> {
        return this.list(filter).then((items) => {
            items.forEach((item) => this.db.del(item.ID));
            return items;
        });
    }

    close(): Promise<void> {
        return this.db.close();
    }
}
