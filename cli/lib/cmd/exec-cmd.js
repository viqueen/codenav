const TaskExecutor = require('../util/task-executor');
const { execFile } = require('child_process');

class ExecCmd {
    constructor(options) {
        this.codeNavStore = options.codeNavStore;
        this.codeNavRepo = options.codeNavRepo;
        this.scope = options.scope;
        this.aliases = options.aliases;
        this.executable = options.executable;
        this.args = options.args;
        this.taskExecutor = new TaskExecutor({});
    }

    execute() {
        this.codeNavStore.stream(
            {
                scope: this.scope,
                aliases: this.aliases,
            },
            (item) => {
                const directory = this.codeNavRepo.location(item);
                const runnable = () => {
                    return new Promise((resolve) => {
                        const _exec = execFile(this.executable, this.args, {
                            cwd: directory,
                            stdio: 'inherit',
                        });
                        _exec.stdout.on('data', (data) => {
                            process.stdout.write(data.toString());
                        });
                        _exec.stderr.on('data', (data) => {
                            process.stderr.write(data.toString());
                        });
                        _exec.on('exit', () => {
                            resolve();
                        });
                    });
                };
                this.taskExecutor.submit(runnable);
            }
        );
    }
}

module.exports = ExecCmd;
