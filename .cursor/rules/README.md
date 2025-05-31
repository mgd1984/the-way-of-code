# Cursor Rules - The Way of Code

This directory contains project rules following Cursor's modern MDC format, embodying the principle of **Balance Over Extremes** - neither too rigid nor too loose.

## Rule Structure

### Always Applied Rules
- `core-philosophy.mdc` - The five pillars and essential wisdom (always active)

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
- `gitmcp-integration.mdc` - GitMCP.io integration guidelines
- `releases.mdc` - Release and versioning process
- `meta-rules.mdc` - Guidelines for evolving the rules themselves

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
| Assets | `docs/assets/**/*` | `documentation.mdc` |

## Usage Philosophy

- Core philosophy flows through all interactions
- File-specific rules auto-attach naturally
- Use `@rule-name` to invoke specific guidance manually
- Nested rules provide context-aware wisdom

## Evolution and Refinement

These rules embody the principle of eternal refinement:
- "The master carves his block, slowly but surely"
- Each update moves toward greater clarity and usefulness
- Rules evolve with the project while maintaining philosophical foundation
- Balance between guidance and freedom

## Recent Enhancements

- Enhanced core philosophy with MCP integration wisdom
- Added releases rule for versioning process
- Updated documentation rule for asset organization
- Refined GitMCP integration guidance

*"True perfection seems imperfect, yet it is perfectly itself"* - Chapter 45 