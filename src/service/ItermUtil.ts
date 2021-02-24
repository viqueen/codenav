import { Input, Item, ItemTransformer } from '../main';

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

export { itemTransformer };
