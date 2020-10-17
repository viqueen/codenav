const path = require('path');
const LevelStore = require('../util/level-store');
const SshUrl = require('../util/ssh-url');
const CloneCmd = require('../cmd/clone-cmd');
const { spawn } = require('child_process');

class CodeNavStore {
    constructor(config) {
        this.store = new LevelStore({
            path: path.resolve(config.directory(), 'db'),
            indexes: ['name', 'namespace', 'host'],
        });
        this.sourcesRoot = config.get('sources.root');
        this.shellCmd = config.get('shell.cmd');
        this.cloneCmd = new CloneCmd(this.sourcesRoot);
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

    _predicates(filters) {
        return Object.entries(filters).map((e) => {
            if (e[1] === '*') {
                return () => true;
            }
            return (item) => item[e[0]] === e[1];
        });
    }

    list(filters) {
        this.store.list(this._predicates(filters), console.log);
    }

    clone(filters) {
        this.store.list(this._predicates(filters), (item) => {
            this.cloneCmd.process(item);
        });
    }

    goto(filters) {
        this.store.list(this._predicates(filters), (item) => {
            const target = path.join(
                this.sourcesRoot,
                item.host,
                item.namespace,
                item.name
            );
            spawn(this.shellCmd, ['-i'], {
                cwd: target,
                stdio: 'inherit',
            });
        });
    }
}

module.exports = CodeNavStore;
