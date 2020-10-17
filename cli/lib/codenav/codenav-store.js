const path = require('path');
const LevelStore = require('../util/level-store');
const SshUrl = require('../util/ssh-url');
const CloneCmd = require('../cmd/clone-cmd');
const { spawn } = require('child_process');
const fs = require('fs');

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

    _location(item) {
        const target = path.join(
            this.sourcesRoot,
            item.host,
            item.namespace,
            item.name
        );
        return target;
    }

    _predicates(filters) {
        return Object.entries(filters).map((e) => {
            if (e[1] === '*') {
                return () => true;
            }
            return (item) => item[e[0]] === e[1];
        });
    }

    list(filters, dispaly) {
        this.store.list(this._predicates(filters), (item) => {
            if (dispaly.location) {
                const target = this._location(item);
                if (fs.existsSync(target)) {
                    console.log(this._location(item));
                }
            } else {
                console.log(item);
            }
        });
    }

    clone(filters) {
        this.store.list(this._predicates(filters), (item) => {
            this.cloneCmd.process(item);
        });
    }

    goto(filters) {
        this.store.list(this._predicates(filters), (item) => {
            const target = this._location(item);
            if (!fs.existsSync(item)) {
                console.log(
                    `${item.namespace}/${item.name} is not checked out`
                );
                return;
            }
            spawn(this.shellCmd, ['-i'], {
                cwd: target,
                stdio: 'inherit',
            });
        });
    }
}

module.exports = CodeNavStore;
