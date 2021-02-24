import { itemTransformer } from './ItermUtil';

const sshItem = {
    ID: 'tools/viqueen/codenav',
    connection: 'ssh://git@github.com:viqueen/codenav.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'codenav',
    aliases: ['codenav'],
    workspace: 'tools'
};

const httpsItem = {
    ID: 'tools/viqueen/devbox',
    connection: 'https://github.com/viqueen/devbox.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'devbox',
    aliases: ['devbox'],
    workspace: 'tools'
};

test('can extract item details from ssh connection', async () => {
    const parsedItem = await itemTransformer({
        connection: sshItem.connection,
        workspace: sshItem.workspace,
        aliases: []
    });
    expect(parsedItem).toEqual(sshItem);
});

test('can extract item details from https connection', async () => {
    const parsedItem = await itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: []
    });
    expect(parsedItem).toEqual(httpsItem);
});

test('can aggregate aliases', async () => {
    const parsedItem = await itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devtools', 'development', 'automation']
    });
    expect(parsedItem.aliases).toEqual([
        'devtools',
        'development',
        'automation',
        'devbox'
    ]);
});

test('aliases are not duplicated', async () => {
    const parsedItem = await itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devbox']
    });
    expect(parsedItem.aliases).toEqual(['devbox']);
});

test('does not process invalid connection urls', async () => {
    const result = itemTransformer({
        connection: 'invalid.git',
        workspace: 'default',
        aliases: []
    });
    await expect(result).rejects.toBeUndefined();
});
