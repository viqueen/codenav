import { itemTransformer, linkParser, urlParser } from '../src/util/ItemUtil';

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

const sshIemWithDots = {
    ID: 'tools/viqueen/codenav.org',
    connection: 'ssh://git@github.com:viqueen/codenav.org.git',
    host: 'github.com',
    namespace: 'viqueen',
    slug: 'codenav.org',
    aliases: ['codenav.org'],
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

test('can extract item details from ssh connection with dots in the repo slug', () => {
    const parsedItem = itemTransformer({
        connection: sshIemWithDots.connection,
        workspace: sshIemWithDots.workspace,
        aliases: []
    });
    expect(parsedItem).toEqual(sshIemWithDots);
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

test('can parse links', () => {
    const link = '<https://api.github.com/user/12345/repos?page=2>; rel="next"';
    const result = linkParser(link);
    expect(result).toEqual({
        href: 'https://api.github.com/user/12345/repos?page=2',
        rel: 'next',
        query: {
            page: '2'
        }
    });
});

test('does not parse broken links', () => {
    const link = '<https://api.github.com/user/12345/repos?page=2>;';
    const result = linkParser(link);
    expect(result).toBeUndefined();
});

test('can parse urls', async () => {
    const url = 'https://localhost:7990/bitbucket';
    const result = await urlParser(url);
    expect(result).toEqual({
        protocol: 'https',
        host: 'localhost',
        port: '7990',
        context: '/bitbucket'
    });
});

test('does not parse broken urls', async () => {
    const url = 'not-valid';
    expect.assertions(1);
    await expect(urlParser(url)).rejects.toBeUndefined();
});
