import {
    Input,
    ItemTransformer,
    LinkParser,
    UrlParser,
    UrlParts
} from '../main';
import QueryString from 'query-string';
import { URL } from 'url';

const itemTransformer: ItemTransformer = (input: Input) => {
    const SSH_URL_PATTERN =
        /^(?<protocol>ssh:\/\/)?([a-zA-Z\d]+)@(?<host>[a-zA-Z\d.]+(:\d+)?)([\/:])(?<namespace>[a-zA-Z\d-_]+)\/(?<name>[a-zA-Z\d-_]+)\.git$/;
    const HTTPS_URL_PATTERN =
        /^(?<protocol>https:\/\/)(?<host>[a-zA-Z\d.]+)\/(?<namespace>[a-zA-Z\d-_]+)\/(?<name>[a-zA-Z\d-_]+)\.git$/;

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
        workspace: input.workspace,
        forked: input.forked,
        archived: input.archived
    };
};

const urlParser: UrlParser = (url: string) => {
    const URL_PATTERN =
        /^(?<protocol>http|https):\/\/(?<host>[a-zA-Z\d.]+)(:(?<port>[\d]+))?(?<context>\/[a-zA-Z\d]*)?$/;

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

const linkParser: LinkParser = (link: string) => {
    const LINK_PATTERN = /^<(?<href>.*)>; rel="(?<rel>next|last)"$/;

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
