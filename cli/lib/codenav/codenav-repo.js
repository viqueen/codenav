const path = require('path');

class CodeNavRepo {
    constructor(config) {
        this.sourcesRoot = config.get('sources.root');
    }

    location(repo) {
        if (repo.scope === '<all>') {
            return path.join(
                this.sourcesRoot,
                repo.host,
                repo.namespace,
                repo.alias
            );
        } else {
            return path.join(this.sourcesRoot, repo.scope, repo.alias);
        }
    }
}

module.exports = CodeNavRepo;
