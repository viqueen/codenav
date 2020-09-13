const levelUp = require('levelup');
const levelDown = require('leveldown');

class LevelStore {
    constructor(options) {
        this.mainDB = levelUp(levelDown(`${options.path}-main`));
        this.indexDB = {};
        this.indexes = options.indexes || [];
        this.indexes.forEach((index) => {
            this.indexDB[index] = levelUp(
                levelDown(`${options.path}-${index}`)
            );
        });
    }

    get(key) {
        return this.mainDB
            .get(key)
            .then((value) => JSON.parse(value.toString()));
    }

    getBy(fieldName, fieldValue) {
        return this.indexDB[fieldName]
            .get(fieldValue)
            .then((ID) => this.get(ID));
    }

    put(key, value) {
        const updates = this.indexes.map((index) => {
            this.indexDB[index].put(value[index], value['ID']);
        });
        updates.push(this.mainDB.put(key, JSON.stringify(value)));
        return Promise.all(updates);
    }

    list() {
        return this.mainDB.createReadStream().on('data', (data) => {
            console.log(JSON.parse(data.value.toString()));
        });
    }
}

module.exports = LevelStore;
