import path from 'path';

export class CodeNavItemLocation implements ItemLocation {
    readonly configuration!: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    resolve(item: Item): string {
        const sourcesRoot = this.configuration.get('sources.root');
        if (!sourcesRoot) {
            throw Error('sources.root configuration entry is not defined');
        }
        return path.join(sourcesRoot, item.workspace, item.slug);
    }
}
