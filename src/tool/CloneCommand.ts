import simpleGit from 'simple-git';
import { SimpleTask } from '../service/SimpleTask';

export class CloneCommand implements Command {
    readonly itemLocation!: ItemLocation;

    constructor(itemLocation: ItemLocation) {
        this.itemLocation = itemLocation;
    }

    process(item: Item): Task {
        const target = this.itemLocation.resolve(item);
        return new SimpleTask(() => {
            console.log(`cloning ${item.connection} into ${target}`);
            return simpleGit()
                .clone(item.connection, target)
                .then(() =>
                    console.log(`cloned ${item.connection} into ${target}`)
                );
        });
    }
}
