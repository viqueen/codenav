import { ItemCommand, ItemFilter, Service, Store } from '../main';
import { DefaultTaskExecutor, TaskExecutor } from 'task-pool-executor';

export class DefaultService implements Service {
    readonly executor!: TaskExecutor;
    readonly store!: Store;

    constructor(store: Store) {
        this.store = store;
        this.executor = new DefaultTaskExecutor();
    }

    execute(command: ItemCommand, filter: ItemFilter): void {
        this.store.list(filter).then((items) => {
            items.forEach((item) => {
                this.executor.submit(command.process(item));
            });
        });
    }
}
