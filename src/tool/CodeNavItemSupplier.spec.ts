import { CodeNavItemSupplier } from './CodeNavItemSupplier';

const itemSupplier: ItemSupplier = new CodeNavItemSupplier();

const sshItem = {
    ID: 'tools/viqueen/codenav',
    connection: 'ssh://git@github.com:viqueen/codenav.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'codenav',
    aliases: ['codenav'],
    workspace: 'tools',
};

const httpsItem = {
    ID: 'tools/viqueen/devbox',
    connection: 'https://github.com/viqueen/devbox.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'devbox',
    aliases: ['devbox'],
    workspace: 'tools',
};

test('can extract item details from ssh connection', () => {
    const parsedItem = itemSupplier.parse({
        connection: sshItem.connection,
        workspace: sshItem.workspace,
        aliases: [],
    });
    expect(parsedItem).toEqual(sshItem);
});

test('can extract item details from https connection', () => {
    const parsedItem = itemSupplier.parse({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: [],
    });
    expect(parsedItem).toEqual(httpsItem);
});

test('can aggregate aliases', () => {
    const parsedItem = itemSupplier.parse({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devtools', 'development', 'automation'],
    });
    expect(parsedItem?.aliases).toEqual([
        'devtools',
        'development',
        'automation',
        'devbox',
    ]);
});

test('aliases are not duplicated', () => {
    const parsedItem = itemSupplier.parse({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devbox'],
    });
    expect(parsedItem?.aliases).toEqual(['devbox']);
});
