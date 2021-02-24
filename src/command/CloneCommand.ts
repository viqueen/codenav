import { Item, ItemCommand, ItemLocation } from '../main';
import { Task } from 'task-pool-executor';
import simpleGit from 'simple-git';

export class CloneCommand implements ItemCommand {
    readonly location!: ItemLocation;

    constructor(location: ItemLocation) {
        this.location = location;
    }

    make(item: Item): Task {
        const target = this.location.resolve(item);
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
