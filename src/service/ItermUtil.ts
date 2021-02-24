import { Input, Item, ItemTransformer, UrlParser, UrlParts } from '../main';

const SSH_URL_PATTERN = /^(?<protocol>ssh:\/\/)?(?<user>[a-zA-Z0-9]+)@(?<host>[a-zA-Z0-9.]+(:[0-9]+)?)([\/:])(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;
const HTTPS_URL_PATTERN = /^(?<protocol>https:\/\/)(?<host>[a-zA-Z0-9.]+)\/(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;

const itemTransformer: ItemTransformer = (input: Input) => {
    return new Promise<Item>((resolve, reject) => {
        const url = input.connection;
        const sshMatcher = url.match(SSH_URL_PATTERN);
        const matcher = sshMatcher ? sshMatcher : url.match(HTTPS_URL_PATTERN);

        if (!matcher) {
            reject();
            return;
        }

        const groups = matcher.groups || {};
        const host = groups['host'];
        const namespace = groups['namespace'];
        const name = groups['name'];
        const ID = [input.workspace, namespace, name].join('/');
        const aliases = new Set(input.aliases);

        aliases.add(name);

        resolve({
            ID: ID,
            connection: url,
            namespace: namespace,
            host: host,
            slug: name,
            aliases: Array.from(aliases),
            workspace: input.workspace
        });
    });
};

const URL_PATTERN = /^(?<protocol>http|https):\/\/(?<host>[a-zA-Z0-9.]+)(:(?<port>[0-9]+))?(?<context>\/[a-zA-Z0-9]*)?$/;

const urlParser: UrlParser = (url: string) => {
    return new Promise<UrlParts>((resolve, reject) => {
        const matcher = url.match(URL_PATTERN);

        if (!matcher) {
            reject();
            return;
        }

        const groups = matcher.groups || {};

        resolve({
            protocol: groups['protocol'],
            host: groups['host'],
            port: groups['port'],
            context: groups['context'] || '/'
        });
    });
};

export { itemTransformer, urlParser };
