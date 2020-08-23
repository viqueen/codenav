const levelUp = require("levelup");
const levelDown = require("leveldown");
const SshUrl = require("./ssh-url");

class Store {
  constructor(options) {
    this.db = levelUp(levelDown(options.path));
  }

  register(sshUrlConnection) {
    const parsed = SshUrl.parse(sshUrlConnection);
    if (parsed) {
      const ID = parsed.path;
      return this.db.put(
        ID,
        JSON.stringify({
          ID: ID,
          connection: sshUrlConnection,
        })
      );
    }
  }

  list() {
    this.db.createReadStream().on("data", (data) => {
      console.log(JSON.parse(data.value.toString()));
    });
  }
}

module.exports = Store;
