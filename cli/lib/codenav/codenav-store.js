const path = require('path');
const LevelStore = require('../util/level-store');
const SshUrl = require('../util/ssh-url');

class CodeNavStore {
    constructor(config) {
        this.store = new LevelStore({
            path: path.resolve(config.directory(), 'db'),
            indexes: ['name', 'namespace', 'host'],
        });
    }

    register(sshUrlConnection) {
        const parsed = SshUrl.parse(sshUrlConnection);
        if (!parsed) {
            // TODO : handle error / warning
            return;
        }

        const ID = [parsed.namespace, parsed.name].join('/');
        return this.store.put(ID, {
            ID: ID,
            connection: sshUrlConnection,
            namespace: parsed.namespace,
            name: parsed.name,
            host: parsed.host,
        });
    }

    list() {
        this.store.list();
    }
}

module.exports = CodeNavStore;
