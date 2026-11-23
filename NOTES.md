# Claude Code setup notes

## 1. MCP server: `docs`

A project-scoped filesystem MCP server named `docs` is defined in `.mcp.json`. It is limited to `./docs` and needs no credentials. It is useful because `docs/api.md` is the API reference, which Claude reads when writing routes. `permissions.allow` in `.claude/settings.json` only permits `mcp__docs__read_text_file` and `mcp__docs__list_directory`, so the write-capable tools still prompt for approval. I used it to list the documented endpoints.

## 2. Skill: `express-route`

The skill in `.claude/skills/express-route/SKILL.md` covers the project's route conventions: input validation, 400/404/201 responses, the `{ "error": "message" }` error shape, mounting in `server.js`, tests, and updating `docs/api.md`. Its description names the task and trigger words (new endpoint, route, resource, GET/POST/PUT/DELETE, validation, errors), so it loads on matching requests. I tested it with "Adaugă o rută DELETE /users/:id" without naming the skill, and it loaded.

## 3. Custom command: `/check-route`

`/check-route <file>` is defined in `.claude/commands/check-route.md` and uses `$ARGUMENTS` as the file path. It checks a route file against the project conventions and reports problems with line numbers, without editing anything. It is a shortcut for the review I run before each PR. I ran it on `routes/users.js` and `routes/health.js`.

## 4. Hook: block force-push

A `PreToolUse` hook in `.claude/settings.json` matches `Bash|PowerShell`, since Claude uses PowerShell on Windows. It runs `.claude/hooks/block-force-push.js` through `node`, so it works on any OS. The script blocks `git push` with `--force`, `-f`, or `--force-with-lease` (exit code 2) and allows normal pushes. I checked it with `git push --force --dry-run`, which was blocked.

## 5. Headless run: list routes

`claude -p` with `--allowedTools "Read,Grep,Glob"` and `--max-turns 5` lists the routes. Only read tools are allowed because the task should not modify files or run commands. The turn limit stops a run that goes off track.
