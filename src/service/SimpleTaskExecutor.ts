import { EventEmitter } from 'events';

export class SimpleTaskExecutor extends EventEmitter implements TaskExecutor {
    readonly maxConcurrent!: number;
    readonly queue!: Array<Task>;
    concurrent!: number;

    constructor(maxConcurrent: number) {
        super();
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.concurrent = 0;
        this.on('release', this._release);
    }

    _release() {
        this.concurrent = this.concurrent - 1;
        const task = this.queue.shift();
        if (task) {
            this._runTask(task);
        }
    }

    _runTask(task: Task) {
        task.run()
            .then(() => {
                this.emit('release');
            })
            .catch(() => {
                this.emit('release');
            });
    }

    submit(task: Task): void {
        if (this.concurrent < this.maxConcurrent) {
            this.concurrent = this.concurrent + 1;
            this._runTask(task);
        } else {
            this.queue.push(task);
        }
    }
}
