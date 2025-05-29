# Cursor Rules - The Way of Code

This directory contains project rules following Cursor's modern MDC format.

## Rule Structure

### Always Applied Rules
- `core-philosophy.mdc` - The five pillars and daily wisdom (always active)

### Auto-Attached Rules (by file pattern)
- `typescript.mdc` - TypeScript guidelines
  - **Patterns**: `**/*.ts`, `**/*.tsx`
- `javascript.mdc` - JavaScript guidelines  
  - **Patterns**: `**/*.js`, `**/*.mjs`, `scripts/**/*`
- `mcp-server.mdc` - MCP server development
  - **Patterns**: `mcp-server/**/*`
- `documentation.mdc` - Documentation guidelines
  - **Patterns**: `**/*.md`, `**/*.txt`, `text/**/*`, `examples/**/*`, `principles/**/*`
- `shell-scripts.mdc` - Shell script guidelines
  - **Patterns**: `**/*.sh`, `**/*.bash`, `install.sh`, `git-hooks/**/*`
- `package-json.mdc` - Project configuration
  - **Patterns**: `**/package.json`, `**/tsconfig.json`, `**/*.config.js`, `**/*.config.ts`

### Manual Rules (invoke with @rule-name)
- `coding-practices.mdc` - Detailed coding guidelines
- `collaboration.mdc` - Code review and team practices  
- `mcp-tool-template.mdc` - Template for new MCP tools

### Nested Rules
- `mcp-server/.cursor/rules/server-specific.mdc` - Server-specific guidelines (auto-applies in mcp-server directory)

## File Pattern Coverage

| File Type | Pattern | Rule Applied |
|-----------|---------|--------------|
| TypeScript | `**/*.ts`, `**/*.tsx` | `typescript.mdc` |
| JavaScript | `**/*.js`, `**/*.mjs` | `javascript.mdc` |
| Scripts | `scripts/**/*`, `**/*.sh` | `javascript.mdc`, `shell-scripts.mdc` |
| Documentation | `**/*.md`, `text/**/*`, `examples/**/*` | `documentation.mdc` |
| Configuration | `**/package.json`, `**/tsconfig.json` | `package-json.mdc` |
| MCP Server | `mcp-server/**/*` | `mcp-server.mdc` + nested rule |
| Git Hooks | `git-hooks/**/*` | `shell-scripts.mdc` |

## Usage

- Core philosophy is always available
- File-specific rules auto-attach when working with relevant files
- Use `@rule-name` to manually include specific rules
- Nested rules provide context-specific guidance

## Migration Notes

This replaces the legacy `.cursorrules` file with a more organized, composable structure following Cursor's best practices. 