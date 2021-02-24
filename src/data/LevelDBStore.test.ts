import { LevelDBStore } from './LevelDBStore';

const configuration: Configuration = {
    directory: process.cwd(),
    set: () => {},
    get: () => {
        return '';
    }
};

const store = new LevelDBStore(configuration);

const dataSupplier = (key: string) => {
    return {
        item: {
            ID: key,
            connection: 'ssh://git@github.com:viqueen/codenav.git',
            host: 'github.com',
            namespace: 'viqueen',
            slug: 'codenav',
            aliases: [],
            workspace: 'tools'
        },
        filter: (item: Item) => {
            return item.ID === key;
        }
    };
};

beforeEach(async () => {
    const deleted = await store.remove(() => true);
    expect(deleted.length).toBeGreaterThanOrEqual(0);
    const items = await store.list(() => true);
    expect(items.length).toEqual(0);
});

test('can store repo item', async () => {
    const data = dataSupplier('A');
    await store.add(data.item);
    const items = await store.list(data.filter);
    expect(items.length).toEqual(1);
    expect(items[0]).toEqual(data.item);
    const item = await store.get(data.item.ID);
    expect(item).toEqual(data.item);
});

test('can delete repo item', async () => {
    const data = dataSupplier('B');
    await store.add(data.item);
    const itemsRemoved = await store.remove(data.filter);
    expect(itemsRemoved.length).toEqual(1);
    expect(itemsRemoved[0]).toEqual(data.item);

    const items = await store.list(data.filter);
    expect(items.length).toEqual(0);
});

test('can update repo item', async () => {
    const data = dataSupplier('C');
    await store.add(data.item);
    const item = await store.get(data.item.ID);
    expect(item).toEqual(data.item);

    const itemWithAliases: Item = Object.assign({}, data.item);
    itemWithAliases.aliases.push('D');

    await store.add(itemWithAliases);
    const updatedItem = await store.get(itemWithAliases.ID);
    expect(updatedItem).toEqual(itemWithAliases);
});
