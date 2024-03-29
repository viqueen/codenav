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
    readonly forked?: boolean;
    readonly archived?: boolean;
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
    close(): Promise<void>;
}

// CLI

interface Input {
    readonly connection: string;
    readonly workspace: string;
    readonly aliases: Array<string>;
    readonly archived?: boolean;
    readonly forked?: boolean;
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
    process(item: Item): Task;
}

interface Service {
    readonly executor: TaskExecutor;
    readonly store: Store;
    execute(command: ItemCommand, filter: ItemFilter): void;
}

// source providers

interface Link {
    readonly rel: string;
    readonly href: string;
    readonly query: any;
}

interface LinkParser {
    (link: string): Link | undefined;
}

interface RestClientOptions {
    readonly host: string;
    readonly port?: string;
    readonly headers?: any;
}

interface RestResponse {
    readonly body: any;
    readonly headers: any;
}

interface RestClient extends RestClientOptions {
    _get(target: string, query: any): Promise<RestResponse>;
}

interface ProviderOptions {
    readonly workspace: string;
    readonly namespace: string;
    readonly itemFilter: ItemFilter;
}

interface Provider {
    readonly store: Store;
    readonly client: RestClient;

    _extractMetadata(
        json: any,
        workspace: string,
        namespace: string
    ): Array<Input>;

    register(options: ProviderOptions): Promise<any>;
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
