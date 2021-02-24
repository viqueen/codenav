import { Configuration, Item, ItemLocation } from '../main';
import path from 'path';

export class DefaultItemLocation implements ItemLocation {
    readonly configuration!: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    resolve(item: Item): string {
        return path.resolve(
            this.configuration.get('sources.root'),
            item.workspace,
            item.slug
        );
    }
}
