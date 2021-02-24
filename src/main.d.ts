// data

import { Task, TaskExecutor } from 'task-pool-executor';

interface Item {
    readonly ID: string;
    readonly connection: string;
    readonly host: string;
    readonly namespace: string;
    readonly slug: string;
    readonly aliases: Array<string>;
    readonly workspace: string;
}

interface ItemFilter {
    (item: Item): boolean;
}

interface Configuration {
    readonly directory: string;
    set(key: string, value: any): void;
    get(key: string): any;
}

interface Store {
    readonly configuration: Configuration;
    add(item: Item): Promise<void>;
    get(key: string): Promise<Item>;
    remove(filter: ItemFilter): Promise<Array<Item>>;
    list(filter: ItemFilter): Promise<Array<Item>>;
}

// CLI

interface Input {
    readonly connection: string;
    readonly workspace: string;
    readonly aliases: Array<string>;
}

interface ItemTransformer {
    (input: Input): Item | undefined;
}

interface ItemLocation {
    readonly configuration: Configuration;
    resolve(item: Item): string;
}

interface Options {
    readonly workspace?: string;
    readonly namespace?: string;
    readonly host?: string;
    readonly slug?: string;
    readonly keyword?: string;
}

interface ItemCommand {
    readonly location: ItemLocation;
    make(item: Item): Task;
}

interface Service {
    readonly executor: TaskExecutor;
    readonly store: Store;
    execute(command: ItemCommand, filter: ItemFilter): void;
}

// source providers

interface RestClientOptions {
    readonly host: string;
    readonly port?: string;
    readonly headers?: any;
}

interface RestClient extends RestClientOptions {
    _get(target: string, query: any): Promise<any>;
}

interface ProviderOptions {
    readonly workspace: string;
    readonly namespace: string;
}

interface Provider {
    readonly store: Store;
    readonly client: RestClient;

    _extractConnectionUrls(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input>;

    register(options: ProviderOptions): void;
}

// util

interface UrlParts {
    readonly protocol: string;
    readonly host: string;
    readonly port?: string;
    readonly context: string;
}

interface UrlParser {
    (url: string): Promise<UrlParts>;
}

interface Page {
    readonly data: any;
    readonly next?: any;
}
