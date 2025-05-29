# The Way of Code - MCP Server

*"The code that can be named is not the eternal code. The way that can be spoken is not the eternal way."*

A Model Context Protocol (MCP) server that provides AI assistants with access to The Way of Code - 81 principles of vibe coding based on Rick Rubin's adaptation of the Tao Te Ching for software development.

## 🌊 Overview

This MCP server enables AI coding assistants to access philosophical guidance and practical wisdom for software development. Whether you're debugging complex problems, making architectural decisions, or seeking daily coding inspiration, The Way of Code provides timeless principles adapted for modern development.

## 🚀 Installation

### NPX (Recommended)
```bash
npx the-way-of-code
```

### Global Installation
```bash
npm install -g the-way-of-code
the-way-of-code
```

### Local Installation
```bash
npm install the-way-of-code
npx the-way-of-code
```

## 🛠 Configuration

### Cursor
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "the-way-of-code": {
      "command": "npx",
      "args": ["the-way-of-code"]
    }
  }
}
```

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "the-way-of-code": {
      "command": "npx",
      "args": ["the-way-of-code"]
    }
  }
}
```

### Other MCP Clients
Use the command: `npx the-way-of-code`

## 🎯 Available Tools

### `get_chapter`
Retrieve a specific chapter from The Way of Code (1-81).

**Parameters:**
- `chapter` (number): Chapter number between 1 and 81

**Example:**
```typescript
// Get Chapter 8 about water and flow
await mcp.call('get_chapter', { chapter: 8 });
```

### `search_principles`
Search for principles relevant to your coding situation.

**Parameters:**
- `query` (string): Search terms for finding relevant principles
- `context` (string, optional): Additional context about your situation

**Example:**
```typescript
// Search for debugging guidance
await mcp.call('search_principles', {
  query: 'debugging complex problems',
  context: 'Working on a production bug that\'s hard to reproduce'
});
```

### `get_daily_wisdom`
Get daily wisdom based on the current date or a specific date.

**Parameters:**
- `date` (string, optional): Date in YYYY-MM-DD format (defaults to today)

**Example:**
```typescript
// Get today's wisdom
await mcp.call('get_daily_wisdom');

// Get wisdom for a specific date
await mcp.call('get_daily_wisdom', { date: '2025-01-01' });
```

### `get_principles_by_topic`
Get principles related to specific coding topics.

**Parameters:**
- `topic` (string): One of: simplicity, complexity, flow, force, humility, ego, balance, extremes, presence, rushing, debugging, refactoring, architecture, collaboration, leadership

**Example:**
```typescript
// Get principles about simplicity
await mcp.call('get_principles_by_topic', { topic: 'simplicity' });
```

### `get_core_principles`
Get the five core principles of The Way of Code.

**Example:**
```typescript
// Get the foundational principles
await mcp.call('get_core_principles');
```

## 🌟 The Five Pillars

1. **Simplicity Over Complexity** - Choose the simplest solution that works
2. **Flow Over Force** - Let solutions emerge naturally, don't force them
3. **Humility Over Ego** - Code without attachment to being "right"
4. **Balance Over Extremes** - Find the middle way in all development decisions
5. **Presence Over Rushing** - Code with full attention to the current task

## 🎨 Usage Examples

### Daily Coding Wisdom
```
Prompt: "Give me today's coding wisdom from The Way of Code"
```

### Problem-Solving Guidance
```
Prompt: "I'm struggling with a complex architecture decision. What does The Way of Code suggest?"
```

### Code Review Philosophy
```
Prompt: "Review this code following The Way of Code principles"
```

### Debugging Approach
```
Prompt: "I have a difficult bug. How should I approach debugging according to The Way of Code?"
```

## 🔧 Development

### Local Development
```bash
git clone https://github.com/mgd1984/the-way-of-code.git
cd the-way-of-code/mcp-server
npm install
npm run dev
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
npm run test:watch
```

## 📚 Philosophy

The Way of Code adapts the timeless wisdom of the Tao Te Ching for modern software development. Each principle provides both philosophical insight and practical coding applications, helping developers write more elegant, maintainable, and harmonious code.

*"The highest good is like water. Water nourishes the ten thousand things without effort."* - Chapter 8

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](../README.md#contributing) and follow The Way of Code principles:

- Approach with beginner's mind
- Suggest improvements through questions, not commands
- Focus on the code's service to users
- Embrace "I don't know" as the starting point for learning

## 📄 License

MIT License - Wisdom flows freely like water, nourishing all who encounter it.

## 🔗 Links

- [Main Repository](https://github.com/mgd1984/the-way-of-code)
- [The Way of Code Documentation](https://github.com/mgd1984/the-way-of-code#readme)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Issues](https://github.com/mgd1984/the-way-of-code/issues)

---

*"The Vibe Coder does not accumulate possessions. The more they do for others, the more they gain. The more they give away, the more they have."* - Chapter 81 