const SSH_URL_PATTERN = /^(?<protocol>ssh:\/\/)?(?<user>[a-zA-Z0-9]+)@(?<host>[a-zA-Z0-9.]+)([\/:])(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;
const HTTPS_URL_PATTERN = /^(?<protocol>https:\/\/)(?<host>[a-zA-Z0-9.]+)\/(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;

class ConnectionUrl {
    static parse(url) {
        const sshMatcher = url.match(SSH_URL_PATTERN);
        const matcher = sshMatcher ? sshMatcher : url.match(HTTPS_URL_PATTERN);

        if (matcher) {
            return {
                protocol: matcher.groups['protocol'],
                // TODO : validate hosts
                host: matcher.groups['host'],
                namespace: matcher.groups['namespace'],
                name: matcher.groups['name'],
            };
        }
    }
}

module.exports = ConnectionUrl;
