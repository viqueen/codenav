const path = require('path');

class CodeNavRepo {
    constructor(config) {
        this.sourcesRoot = config.get('sources.root');
        this.scope = config.get('cnav.scope');
    }

    location(repo) {
        if (this.scope === '<all>') {
            return path.join(
                this.sourcesRoot,
                repo.host,
                repo.namespace,
                repo.name
            );
        } else {
            return path.join(this.sourcesRoot, this.scope, repo.name);
        }
    }
}

module.exports = CodeNavRepo;
