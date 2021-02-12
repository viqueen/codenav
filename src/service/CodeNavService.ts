import { SimpleTaskExecutor } from './SimpleTaskExecutor';

export class CodeNavService implements Service {
    readonly store!: Store;
    readonly executor!: TaskExecutor;

    constructor(store: Store, maxConcurrent: number = 5) {
        this.store = store;
        this.executor = new SimpleTaskExecutor(maxConcurrent);
    }

    execute(command: Command, filter: ItemFilter): void {
        this.store.list(filter).then((items) => {
            items.map(command.process).forEach(this.executor.submit);
        });
    }
}
