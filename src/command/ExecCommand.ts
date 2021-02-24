import { Item, ItemCommand, ItemLocation } from '../main';
import { Task } from 'task-pool-executor';
import { execFile } from 'child_process';

export class ExecCommand implements ItemCommand {
    readonly executable!: string;
    readonly args!: ReadonlyArray<string>;
    readonly location!: ItemLocation;

    constructor(
        executable: string,
        args: ReadonlyArray<string>,
        location: ItemLocation
    ) {
        this.executable = executable;
        this.args = args;
        this.location = location;
    }

    make(item: Item): Task {
        const directory = this.location.resolve(item);
        return () =>
            new Promise<any>((resolve) => {
                const _exec = execFile(this.executable, this.args, {
                    cwd: directory
                });
                _exec.on('exit', () => {
                    resolve({});
                });
            });
    }
}
