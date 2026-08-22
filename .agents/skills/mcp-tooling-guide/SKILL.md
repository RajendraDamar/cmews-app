---
name: mcp-tooling-guide
description: Guidelines and recipes for leveraging active MCP servers (Context7, Playwright, Memory, Zen Browser, GitHub, Firebase, Visualization) reliably within cmews-app.
---

# MCP Tooling Guide & Integration Matrix

This skill defines standard triggers and execution patterns for MCP servers configured in the workspace.

## 1. Tool Selection Decision Matrix

| Domain / Task | Recommended MCP Server | Primary Tool Calls |
| :--- | :--- | :--- |
| **Library / Framework Docs** | `context7` | `resolve-library-id` ➔ `query-docs` |
| **Background Web / UI Testing**| `playwright` | `browser_navigate`, `browser_snapshot`, `browser_evaluate` |
| **Interactive Zen Browser** | `zen-browser` | `zen_navigate`, `zen_click`, `zen_get_page_text` (port 9222) |
| **Persistent Knowledge Graph** | `memory` | `create_entities`, `create_relations`, `search_nodes` |
| **Chart & Timeline Previews** | `visualization` | `render_chart` (Apache ECharts V5 spec) |
| **GitHub PR & Repo Inspect** | `github` | `search_repositories`, `list_commits`, `get_file_contents` |
| **Firebase & Firestore Ops** | `firebase-mcp-server` | `firebase_get_environment`, `firestore_query_collection` |
| **Jupyter Notebooks** | `notebooks` | `create_notebook`, `insert_code_cell`, `list_cells` |
| **Deep Reasoning & Branching** | `sequential-thinking`| `sequentialthinking` |

## 2. Invariant Rules for MCP Invocations

1. **Pragmatic Escalation (Do Not Force)**: Always use native tools (`view_file`, `grep_search`, `run_command`) for standard codebase work. Only escalate to MCP servers when specialized capabilities (browser DOM, live external docs, persistent memory graph, SVG charts) are genuinely required.
2. **Context7 for Complex / Version-Sensitive APIs**: Query `context7` when working with complex third-party library setups or version migrations. Do NOT invoke for standard language syntax or well-known core APIs.
3. **Safe Browser Teardown**: Always call `browser_close` on `playwright` after completing web checks to prevent orphaned headless browser processes.
4. **Zen Browser Remote Port**: If invoking `zen-browser` tools, ensure Zen Browser is running with `--remote-debugging-port 9222`. If connection fails, fall back to `playwright`.
5. **Memory Graph Cleanliness**: Store only persistent project architecture invariants, user preferences, and cross-session constraints in `memory`. Do not store ephemeral transient data.

## 3. Anti-Patterns (When NOT to use MCP)
- ❌ Do NOT call `sequential-thinking` for simple, direct questions or single-step edits.
- ❌ Do NOT launch `playwright` or `zen-browser` when a simple HTTP request or static code inspection suffices.
- ❌ Do NOT query `context7` for basic JavaScript/TypeScript idioms or built-in functions.
- ❌ Do NOT store temporary scratch variables or logs in `memory`.

## 4. Sub-references
- Detailed invocation payloads & examples: [references/recipes.md](references/recipes.md)
