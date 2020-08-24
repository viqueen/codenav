const LevelStore = require('./level-store');
const SshUrl = require('./ssh-url');

class CodeNavStore {
    constructor() {
        this.store = new LevelStore({
            // TODO : use user home instead
            path: './.cnav-db',
            indexes: ['name'],
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
