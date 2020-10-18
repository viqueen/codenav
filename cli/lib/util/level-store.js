const levelUp = require('levelup');
const levelDown = require('leveldown');

class LevelStore {
    constructor(options) {
        this.mainDB = levelUp(levelDown(`${options.path}-main`));
    }

    get(key) {
        return this.mainDB
            .get(key)
            .then((value) => JSON.parse(value.toString()));
    }

    put(key, value) {
        return this.mainDB.put(key, JSON.stringify(value));
    }

    list(predicates, callback) {
        return this.mainDB.createReadStream().on('data', (data) => {
            const item = JSON.parse(data.value.toString());
            if (predicates.every((p) => p(item))) {
                callback(item);
            }
        });
    }
}

module.exports = LevelStore;
