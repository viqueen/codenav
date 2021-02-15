export class SimpleTask implements Task {
    readonly runnable!: () => Promise<any>;

    constructor(runnable: () => Promise<any>) {
        this.runnable = runnable;
    }

    run(): Promise<any> {
        return this.runnable();
    }
}
