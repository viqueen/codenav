import { EventEmitter } from 'events';

interface Task {
    run(): Promise<any>;
}

interface TaskExecutor extends EventEmitter {
    queue: Array<Task>;
    concurrent: number;
    maxConcurrent: number;
    submit(task: Task): void;
}

interface Command {
    process(item: Item): Task;
}

interface Service {
    store: Store;
    executor: TaskExecutor;
    execute(command: Command, filter: ItemFilter): void;
}
