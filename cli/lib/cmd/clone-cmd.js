const TaskExecutor = require('../util/task-executor');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class CloneCmd {
    constructor(sourcesRoot) {
        this.taskExecutor = new TaskExecutor({});
        this.sourcesRoot = sourcesRoot;
    }

    process(repo) {
        const runnable = () =>
            new Promise((resolve) => {
                const target = path.join(
                    this.sourcesRoot,
                    repo.host,
                    repo.namespace,
                    repo.name
                );
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
