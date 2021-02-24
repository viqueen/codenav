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

test('can extract item details from ssh connection', () => {
    const parsedItem = itemTransformer({
        connection: sshItem.connection,
        workspace: sshItem.workspace,
        aliases: []
    });
    expect(parsedItem).toEqual(sshItem);
});

test('can extract item details from https connection', () => {
    const parsedItem = itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: []
    });
    expect(parsedItem).toEqual(httpsItem);
});

test('can aggregate aliases', () => {
    const parsedItem = itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devtools', 'development', 'automation']
    });
    expect(parsedItem).toMatchObject({
        aliases: ['devtools', 'development', 'automation', 'devbox']
    });
});

test('aliases are not duplicated', () => {
    const parsedItem = itemTransformer({
        connection: httpsItem.connection,
        workspace: httpsItem.workspace,
        aliases: ['devbox']
    });
    expect(parsedItem).toMatchObject({
        aliases: ['devbox']
    });
});

test('does not process invalid connection urls', () => {
    const result = itemTransformer({
        connection: 'invalid.git',
        workspace: 'default',
        aliases: []
    });
    expect(result).toBeUndefined();
});
