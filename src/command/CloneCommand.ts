import { Item, ItemCommand } from '../main';
import { Task } from 'task-pool-executor';
import simpleGit from 'simple-git';
import path from 'path';

export class CloneCommand implements ItemCommand {
    readonly sourcesRoot!: string;

    constructor(sourcesRoot: string) {
        this.sourcesRoot = sourcesRoot;
    }

    make(item: Item): Task {
        const target = path.resolve(
            this.sourcesRoot,
            item.workspace,
            item.slug
        );
        return () =>
            simpleGit()
                .clone(item.connection, target)
                .then(() =>
                    console.log(`cloned ${item.connection} into ${target}`)
                )
                .catch((error) => {
                    console.log(error);
                });
    }
}
