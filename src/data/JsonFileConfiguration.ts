import path from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { Configuration } from '../main';

export class JsonFileConfiguration implements Configuration {
    readonly directory!: string;
    readonly fileConfig!: string;

    constructor(directory: string, fileConfigName: string = '.cnavrc') {
        this.directory = directory;
        mkdirSync(this.directory, { recursive: true });
        this.fileConfig = path.resolve(this.directory, fileConfigName);
        if (!existsSync(this.fileConfig)) {
            const defaultConfiguration = {
                'sources.root': path.resolve(homedir(), 'sources'),
                'cnav.workspace': 'default'
            };
            writeFileSync(
                this.fileConfig,
                JSON.stringify(defaultConfiguration)
            );
        }
    }

    get(key: string): any {
        return this.config()[key];
    }

    set(key: string, value: any): void {
        const data = this.config();
        data[key] = value;
        writeFileSync(this.fileConfig, JSON.stringify(data));
    }

    getStoreDirectory(): string {
        return this.get('cnav.store') || this.directory;
    }

    config(): any {
        return JSON.parse(readFileSync(this.fileConfig).toString());
    }
}
