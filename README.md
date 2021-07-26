## Code Navigation

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=viqueen_codenav&metric=alert_status)](https://sonarcloud.io/dashboard?id=viqueen_codenav)
[![Known Vulnerabilities](https://snyk.io/test/github/viqueen/codenav/badge.svg?targetFile=package.json)](https://snyk.io/test/github/viqueen/codenav?targetFile=package.json)

### install it

#### from stable

```bash
npm install -g codenav
```

#### from source

```bash
git clone git@github.com:viqueen/codenav.git
cd codenav

npm install
npm run build:prod
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
```

### use it

- available commands

```
>> cnav --help

Options:
  -w, --workspace <name>                 filter by workspace (default: "default")
  -h, --host <name>                      filter by host
  -ns, --namespace <name>                filter by namespace
  -s, --slug <name>                      filter by name/slug
  -k, --keyword <keyword>                filter by keyword
  -V, --version                          output the version number
  --help                                 display help for command

Commands:
  config                                 displays cnav configuration
  set-config <key> <value>               updates cnav configuration entry
  get-config <key>                       gets cnav configuration entry
  register <urlConnection> [aliases...]  registers a new repo using its url connection
  list                                   lists registered repos
  remove                                 removes registered repos
  clone                                  clone registered repos
  exec <executableFile> [args...]        execute script on target repos
  stash <project>                        register repos from stash for a given project
  bitbucket <namespace>                  register repos from bitbucket with given namespace
  github --user <namespace>              register repos from github with given user namespace
  github --org <namespace>               register repos from github with given org namespace
  help [command]                         display help for command
```

- register repos from bitbucket

```
cnav bitbucket <username|org>
```

- register repos from bitbucket server

```
cnav stash <projectKey>
```

- register repos from github

```
cnav github <username|org>
```

- list repos

<details>
<summary>usage</summary>
<p>

```
Usage: cnav list [options]

lists registered repos

Options:
  -w, --workspace <name>                 filter by workspace (default: "default")
  -h, --host <name>                      filter by host
  -ns, --namespace <name>                filter by namespace
  -s, --slug <name>                      filter by name/slug
  -k, --keyword <keyword>                filter by keyword
```

</p>
</details>

```bash
cnav list
cnav list -ns <username|org>
cnav list -h <github.com|bitbucket.org>
cnav list -ns <username|org> -h <github.com|bitbucket.org>
cnav list -w <workspace>
```

- clone repos

<details>
<summary>usage</summary>
<p>

```
Usage: cnav clone [options]

clone registered repos

Options:
  -w, --workspace <name>                 filter by workspace (default: "default")
  -h, --host <name>                      filter by host
  -ns, --namespace <name>                filter by namespace
  -s, --slug <name>                      filter by name/slug
  -k, --keyword <keyword>                filter by keyword
```

</p>
</details>

```bash
cnav clone
cnav clone -ns <username|org>
cnav clone -h <github.com|bitbucket.org>
cnav clone -ns <username|org> -h <github.com|bitbucket.org>
cnav clone -w <workspace>
```
