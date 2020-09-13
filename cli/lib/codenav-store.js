const path = require('path');
const LevelStore = require('./level-store');
const SshUrl = require('./ssh-url');

class CodeNavStore {
    constructor(config) {
        this.store = new LevelStore({
            path: path.resolve(config.directory(), 'db'),
            indexes: ['name', 'namespace'],
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
        });
    }

    list() {
        this.store.list();
    }
}

module.exports = CodeNavStore;
