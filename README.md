## Code Navigation

![codenav Package](https://github.com/viqueen/codenav/workflows/codenav%20Package/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=viqueen_codenav&metric=alert_status)](https://sonarcloud.io/dashboard?id=viqueen_codenav)

### install it

#### from stable

```bash
npm install -g codenav
```

#### from source

```bash
git clone git@github.com:viqueen/codenav.git
cd codenav

npm link
```

### configure it

- view default config

```bash
cnav config
```

- set your custom values

```bash
cnav set-config sources.root <path/to/sources/root>
cnav set-config shell.cmd <bash|zsh>
```

### use it

- cnav

```
>> cnav -h

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  register <sshUrlConnection>  registers a new repo using its ssh url connection
  list [options]               lists registered repos
  clone [options]              clone registered repos
  config                       displays cnav configuration
  set-config <key> <value>     updates cnav configuration entry
  get-config <key>             gets cnav configuration entry
  go <alias>                   go to repo directory
  help [command]               display help for command
```

- cnav-bitbucket

```
cnav-bitbucket register <username|org>
```

- cnav-github

```
cnav-github register <username|org>
```

- list repos

<details>
<summary>usage</summary>
<p>

```
Usage: cnav list [options]

lists registered repos

Options:
-h, --host <name> filter by host (default: "_")
-ns, --namespace <namespace> filter by namespace (default: "_")
-l, --location display checkout location only (default: false)
```

</p>
</details>

```bash
cnav list
cnav list -ns <username|org>
cnav list -h <github.com|bitbucket.org>
cnav list -ns <username|org> -h <github.com|bitbucket.org>
```

- clone repos

<details>
<summary>usage</summary>
<p>

```
Usage: cnav clone [options]

clone registered repos

Options:
-h, --host <name> filter by host (default: "_")
-ns, --namespace <namespace> filter by namespace (default: "_")
```

</p>
</details>

```bash
cnav clone
cnav clone -ns <username|org>
cnav clone -h <github.com|bitbucket.org>
cnav clone -ns <username|org> -h <github.com|bitbucket.org>
```

- navigate to repo

```bash
cnav go <name>
```

> :warning: make sure your `shell.cmd` config is set to the shell you are using (either bash or zsh or ...)
