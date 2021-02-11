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
    _execute(command: Command, filter: ItemFilter): void;
}
