// DATA

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
    set(key: string, value: string): void;
    get(key: string): string | undefined;
    config(): object;
}

interface Store {
    readonly configuration: Configuration;
    add(item: Item): Promise<Item>;
    remove(filter: ItemFilter): Promise<Array<Item>>;
    list(filter: ItemFilter): Promise<Array<Item>>;
}

// SERVICE

interface Task {
    run(): Promise<any>;
}

interface TaskExecutor {
    readonly queue: Array<Task>;
    readonly maxConcurrent: number;
    submit(task: Task): void;
}

interface Command {
    process(item: Item): Task;
}

interface Service {
    readonly store: Store;
    readonly executor: TaskExecutor;
    execute(command: Command, filter: ItemFilter): void;
}

// TOOL

interface Input {
    readonly connection: string;
    readonly workspace: string;
    readonly aliases: Array<string>;
}

interface ItemSupplier {
    parse(input: Input): Item | undefined;
}

interface CodeNav {
    readonly configuration: Configuration;
    readonly store: Store;
    readonly service: Service;
    readonly itemSupplier: ItemSupplier;

    // data operations
    register(input: Input): Promise<Item>;
    list(itemFilter: ItemFilter): Promise<Array<Item>>;
    remove(itemFilter: ItemFilter): Promise<Array<Item>>;
}
