const URL_PATTERN = /^(?<protocol>http|https):\/\/(?<host>[a-zA-Z0-9.]+)(:(?<port>[0-9]+))?(?<context>\/[a-zA-Z0-9]*)?$/;

class UrlParser {
    static parse(url) {
        const matcher = url.match(URL_PATTERN);

        if (matcher) {
            return {
                protocol: matcher.groups['protocol'],
                // TODO : validate hosts
                host: matcher.groups['host'],
                port: matcher.groups['port'],
                context: matcher.groups['context'] || '/',
            };
        }
    }
}

module.exports = UrlParser;
