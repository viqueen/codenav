const SSH_URL_PATTERN = /^(?<protocol>ssh:\/\/)?(?<user>[a-zA-Z0-9]+)@(?<host>[a-zA-Z0-9.]+)([\/:])(?<namespace>[a-zA-Z0-9-_]+)\/(?<name>[a-zA-Z0-9-_]+)\.git$/;

class SshUrl {
    static parse(url) {
        const matcher = url.match(SSH_URL_PATTERN);
        if (matcher) {
            return {
                protocol: matcher.groups['protocol'],
                user: matcher.groups['user'],
                // TODO : validate hosts
                host: matcher.groups['host'],
                namespace: matcher.groups['namespace'],
                name: matcher.groups['name'],
            };
        }
    }
}

module.exports = SshUrl;
