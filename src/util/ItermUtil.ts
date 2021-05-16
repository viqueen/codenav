import {
    Input,
    ItemTransformer,
    LinkParser,
    UrlParser,
    UrlParts
} from '../main';
import QueryString from 'query-string';
import { URL } from 'url';

const SSH_URL_PATTERN = /^(?<protocol>ssh:\/\/)?(?<user>[a-zA-Z0-9]+)@(?<host>[a-zA-Z0-9.]+(:[0-9]+)?)([\/:])(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;
const HTTPS_URL_PATTERN = /^(?<protocol>https:\/\/)(?<host>[a-zA-Z0-9.]+)\/(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;

const itemTransformer: ItemTransformer = (input: Input) => {
    const url = input.connection;
    const sshMatcher = url.match(SSH_URL_PATTERN);
    const matcher = sshMatcher ? sshMatcher : url.match(HTTPS_URL_PATTERN);

    if (!matcher) {
        console.log(`invalid url connection : ${url}`);
        return;
    }

    const groups = matcher.groups || {};
    const host = groups['host'];
    const namespace = groups['namespace'];
    const name = groups['name'];
    const ID = [input.workspace, namespace, name].join('/');
    const aliases = new Set(input.aliases);

    aliases.add(name);

    return {
        ID: ID,
        connection: url,
        namespace: namespace,
        host: host,
        slug: name,
        aliases: Array.from(aliases),
        workspace: input.workspace
    };
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

const LINK_PATTERN = /^<(?<href>.*)>; rel="(?<rel>next|last)"$/;

const linkParser: LinkParser = (link: string) => {
    const matcher = link.match(LINK_PATTERN);

    if (!matcher) {
        return;
    }

    const groups = matcher.groups || {};
    const href = groups['href'];
    return {
        href: href,
        rel: groups['rel'],
        query: QueryString.parse(new URL(href).search)
    };
};

export { itemTransformer, urlParser, linkParser };
