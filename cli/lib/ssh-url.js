const SSH_URL_PATTERN = /^(?<protocol>ssh:\/\/)?(?<user>[a-zA-Z0-9]+)@(?<host>[a-zA-Z0-9.]+)([\/:])(?<path>[a-zA-Z0-9\/]+)\.git$/;

class SshUrl {
  static parse(url) {
    const matcher = url.match(SSH_URL_PATTERN);
    if (matcher) {
      return {
        protocol: matcher.groups["protocol"],
        user: matcher.groups["user"],
        // TODO : validate hosts
        host: matcher.groups["host"],
        path: matcher.groups["path"],
      };
    }
  }
}

module.exports = SshUrl;
