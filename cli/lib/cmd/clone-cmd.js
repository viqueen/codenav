const TaskExecutor = require('../util/task-executor');
const { spawn } = require('child_process');
const fs = require('fs');

class CloneCmd {
    constructor(codeNavRepo) {
        this.taskExecutor = new TaskExecutor({});
        this.codeNavRepo = codeNavRepo;
    }

    process(repo) {
        const runnable = () =>
            new Promise((resolve) => {
                const target = this.codeNavRepo.location(repo);
                if (fs.existsSync(target)) {
                    resolve();
                    return;
                }
                const _clone = spawn('git', ['clone', repo.connection, target]);
                _clone.stderr.on('data', (data) => {
                    console.log(data.toString());
                });
                _clone.on('exit', () => {
                    resolve();
                });
            });

        this.taskExecutor.submit(runnable);
    }
}

module.exports = CloneCmd;
