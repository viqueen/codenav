const TaskExecutor = require('../util/task-executor');
const { execFile } = require('child_process');

class ExecCmd {
    constructor(options) {
        this.codeNavStore = options.codeNavStore;
        this.codeNavRepo = options.codeNavRepo;
        this.scope = options.scope;
        this.alias = options.alias;
        this.executable = options.executable;
        this.taskExecutor = new TaskExecutor({});
    }

    execute() {
        this.codeNavStore.stream(
            {
                scope: this.scope,
                alias: this.alias,
            },
            (item) => {
                const directory = this.codeNavRepo.location(item);
                const runnable = () => {
                    return new Promise((resolve) => {
                        execFile(
                            this.executable,
                            [],
                            { cwd: directory },
                            (error, stdout, stderr) => {
                                if (error) {
                                    throw error;
                                }
                                console.log(stdout);
                                console.error(stderr);
                            }
                        );
                    });
                };
                this.taskExecutor.submit(runnable);
            }
        );
    }
}

module.exports = ExecCmd;
