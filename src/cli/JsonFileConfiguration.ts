import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export class JsonFileConfiguration implements Configuration {
    readonly directory!: string;
    readonly fileConfig!: string;

    constructor(directory: string) {
        this.directory = directory;
        mkdirSync(this.directory, { recursive: true });
        this.fileConfig = path.resolve(this.directory, '.cnav.json');
        if (existsSync(this.fileConfig)) {
            return this;
        }
        const defaultConfiguration = {
            'sources.root': path.resolve(homedir(), 'sources'),
        };
        writeFileSync(this.fileConfig, JSON.stringify(defaultConfiguration));
    }

    get(key: string): string {
        const config = JSON.parse(readFileSync(this.fileConfig).toString());
        return config[key];
    }

    set(key: string, value: string): void {
        const config = JSON.parse(readFileSync(this.fileConfig).toString());
        config[key] = value;
        writeFileSync(this.fileConfig, JSON.stringify(config).toString());
    }

    config(): object {
        return JSON.parse(readFileSync(this.fileConfig).toString());
    }
}
