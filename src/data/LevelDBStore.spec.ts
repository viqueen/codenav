import { LevelDBStore } from './LevelDBStore';

const configuration: Configuration = {
    directory: process.cwd(),
    set: () => {},
    get: () => {
        return '';
    },
};

const store = new LevelDBStore(configuration);
const item = {
    ID: 'viqueen/codenav',
    connection: 'ssh://git@github.com:viqueen/codenav.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'codenav',
    aliases: [],
    workspace: 'tools',
};
const itemFilter = (item: { ID: string }) => {
    return item.ID === 'viqueen/codenav';
};

test('can store repo item', async () => {
    await store.add(item);
    const items = await store.list(itemFilter);
    expect(items.length).toEqual(1);
    expect(items[0]).toEqual(item);
});

test('can delete repo item', async () => {
    await store.add(item);
    const itemsRemoved = await store.remove(itemFilter);
    expect(itemsRemoved.length).toEqual(1);
    expect(itemsRemoved[0]).toEqual(item);

    const items = await store.list(itemFilter);
    expect(items.length).toEqual(0);
});
