# Chez Mona menu API

A tiny Express and SQLite API for the Chez Mona menu. It powers **Dip**, the PR review lab at the Chez Mona booth at Microsoft Ignite 2026.

> [!WARNING]
> The open "Add menu search" pull request contains deliberate bugs, including a SQL injection, so booth guests can read how code scanning, Copilot Autofix and Copilot code review respond. Do not merge it.

## Run it

```bash
npm install
npm start
```

| Route | Returns |
|---|---|
| `GET /dishes` | The whole menu |
| `GET /dishes/:id` | One dish, or `404` |

## Test it

```bash
npm test
```
