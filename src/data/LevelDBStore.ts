import * as path from 'path';
import LevelUp from 'levelup';
import LevelDOWN from 'leveldown';

export class LevelDBStore implements Store {
    readonly configuration!: Configuration;
    // @ts-ignore
    readonly db!: LevelUp;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
        const target = path.resolve(
            this.configuration.directory,
            `.codenav-db`
        );
        // @ts-ignore
        this.db = LevelUp(LevelDOWN(target));
    }

    add(item: Item): Promise<Item> {
        return this.db.put(item.ID, JSON.stringify(item));
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
}
