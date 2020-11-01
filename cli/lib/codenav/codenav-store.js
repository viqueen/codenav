const path = require('path');
const LevelStore = require('../util/level-store');
const ConnectionUrl = require('../util/connection-url');
const CloneCmd = require('../cmd/clone-cmd');
const CodeNavRepo = require('./codenav-repo');
const fs = require('fs');

class CodeNavStore {
    constructor(config) {
        this.store = new LevelStore({
            path: path.resolve(config.directory(), 'db'),
            indexes: ['name', 'namespace', 'host'],
        });
        this.codeNavRepo = new CodeNavRepo(config);
        this.cloneCmd = new CloneCmd(this.codeNavRepo);
    }

    register(options) {
        const { scope, urlConnection } = options;
        const parsed = ConnectionUrl.parse(urlConnection);
        if (!parsed) {
            // TODO : handle error / warning
            return;
        }
        console.log(`scope: ${scope} / registering : ${urlConnection}`);
        const ID = [parsed.namespace, parsed.name].join('/');
        return this.store.put(ID, {
            ID: ID,
            connection: urlConnection,
            namespace: parsed.namespace,
            alias: parsed.name,
            host: parsed.host,
            scope: scope,
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

    stream(filters, callback) {
        this.store.list(this._predicates(filters), (item) => callback(item));
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
