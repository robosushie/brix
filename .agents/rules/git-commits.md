# Git commit messages

Activation: whenever creating a git commit or a pull request title

Only commit when the user explicitly asks.

## Format

Line 1 is exactly:

```text
<type>(optional-scope): <subject>

Optional body explaining why, not a file list.
```

The subject is only the text after the colon. Never put the body on line 1.

## Types

`feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `style`

## Rules

- Subject starts with a lowercase letter. Write "add", not "Add".
- Subject is 72 characters or fewer.
- Subject does not end with a period.
- Imperative verb.
- One logical change per commit.
- Pull request titles use the same first line.
- No `--no-verify` unless the user asks.
- No amend of a pushed commit unless the user asks.
- Pass the message via HEREDOC.

## Examples

Good:

```text
feat(ci): add semantic commit check

The commit-msg hook rejects subjects that do not match this format.
```

```text
fix(web): require the publishable key at startup
```

```text
chore: add shared agent commit rules
```

Bad:

```text
feat: Add a husky hook so generated commit messages follow the repo format.
```
