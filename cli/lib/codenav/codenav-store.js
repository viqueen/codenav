const path = require('path');
const LevelStore = require('../util/level-store');
const ConnectionUrl = require('../util/connection-url');
const CloneCmd = require('../cmd/clone-cmd');
const CodeNavRepo = require('./codenav-repo');
const { spawn } = require('child_process');
const fs = require('fs');

class CodeNavStore {
    constructor(config) {
        this.store = new LevelStore({
            path: path.resolve(config.directory(), 'db'),
            indexes: ['name', 'namespace', 'host'],
        });
        this.shellCmd = config.get('shell.cmd');
        this.scope = config.get('cnav.scope');
        this.codeNavRepo = new CodeNavRepo(config);
        this.cloneCmd = new CloneCmd(this.codeNavRepo);
    }

    register(urlConnection) {
        const parsed = ConnectionUrl.parse(urlConnection);
        if (!parsed) {
            // TODO : handle error / warning
            return;
        }
        console.log(`registering : ${urlConnection}`);
        const ID = [parsed.namespace, parsed.name].join('/');
        return this.store.put(ID, {
            ID: ID,
            connection: urlConnection,
            namespace: parsed.namespace,
            alias: parsed.name,
            host: parsed.host,
            scope: this.scope,
        });
    }

    _predicates(filters) {
        return Object.entries(filters).map((e) => {
            if (e[1] === '<all>') {
                return () => true;
            }
            return (item) => item[e[0]] === e[1];
        });
    }

    list(filters, display) {
        this.store.list(this._predicates(filters), (item) => {
            if (display.location) {
                const target = this.codeNavRepo.location(item);
                if (fs.existsSync(target)) {
                    console.log(target);
                }
            } else {
                console.log(item);
            }
        });
    }

    remove(filters) {
        this.store.list(this._predicates(filters), (item) => {
            this.store.del(item.ID);
        });
    }

    clone(filters) {
        this.store.list(this._predicates(filters), (item) => {
            this.cloneCmd.process(item);
        });
    }
}

module.exports = CodeNavStore;
