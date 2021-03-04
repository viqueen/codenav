import { Item, ItemCommand, ItemLocation } from '../main';
import { Task } from 'task-pool-executor';
import simpleGit from 'simple-git';
import path from 'path';
import { existsSync } from 'fs';

export class CloneCommand implements ItemCommand {
    readonly location!: ItemLocation;

    constructor(location: ItemLocation) {
        this.location = location;
    }

    make(item: Item): Task {
        const target = this.location.resolve(item);
        if (existsSync(path.resolve(target, '.git'))) {
            return () => {
                console.log(`already checked out : ${target}`);
                return Promise.resolve();
            };
        }
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
