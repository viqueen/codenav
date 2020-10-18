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
                'shell.cmd': 'bash',
                'cnav.scope': '<all>',
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

    set(key, value) {
        const config = JSON.parse(fs.readFileSync(this.configFile).toString());
        config[key] = value;
        fs.writeFileSync(this.configFile, JSON.stringify(config));
    }

    get(key) {
        const config = JSON.parse(fs.readFileSync(this.configFile).toString());
        return config[key];
    }

    config() {
        return JSON.parse(fs.readFileSync(this.configFile).toString());
    }
}

module.exports = CodeNavConfig;
