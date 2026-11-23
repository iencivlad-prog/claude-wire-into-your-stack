#!/usr/bin/env node
// PreToolUse hook: blocks `git push` with --force, -f or --force-with-lease.
// Claude Code passes the tool call as JSON on stdin; the command is in tool_input.command.
// Exit 2 blocks the tool call and shows stderr to Claude. Exit 0 allows it.

const FORCE_PUSH = /\bgit\s+push\b(?:[^\n;&|]*?)\s(?:--force(?:-with-lease)?|-f)(?=\s|=|$)/;

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let command = '';
  try {
    const input = JSON.parse(raw);
    command = (input && input.tool_input && input.tool_input.command) || '';
  } catch {
    // Not JSON: fall back to treating the whole stdin as the command text.
    command = raw;
  }

  if (FORCE_PUSH.test(command)) {
    process.stderr.write('Blocked: force-push is not allowed in this project.\n');
    process.exit(2);
  }
  process.exit(0);
});
