const os = require('os');
const path = require('path');
const fs = require('fs');

class CodeNavConfig {
    constructor() {
        this.configDirectory = path.resolve(os.homedir(), '.cnav');
        fs.mkdirSync(this.configDirectory, { recursive: true });
        this.configFile = path.resolve(this.configDirectory, 'config.json');
        if (!fs.existsSync(this.configFile)) {
            const defaultConfiguration = {
                'sources.root': path.resolve(os.homedir(), 'sources'),
            };
            fs.writeFileSync(
                this.configFile,
                JSON.stringify(defaultConfiguration)
            );
        }
    }

    directory() {
        return this.configDirectory;
    }
}

module.exports = CodeNavConfig;
