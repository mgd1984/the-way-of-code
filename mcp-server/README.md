# The Way of Code - MCP Server

A Model Context Protocol (MCP) server that provides access to The Way of Code - ancient wisdom adapted for modern software development. This server offers **complete MCP capabilities**: Tools, Resources, and Prompts.

## 🌊 Philosophy

The Way of Code draws from Taoist principles, particularly the Tao Te Ching, adapting timeless wisdom for software craftsmanship. Like water that flows naturally around obstacles, code should follow the path of least resistance while maintaining its essential purpose.

## 🚀 Installation

### NPM (Recommended)
```bash
npx the-way-of-code
```

### Local Development
```bash
git clone https://github.com/mgd1984/the-way-of-code.git
cd the-way-of-code/mcp-server
npm install
npm run build
node dist/index.js
```

## 📋 MCP Capabilities

This server implements all three MCP primitives for maximum flexibility:

### 🛠️ Tools (Model-Controlled)
Functions that AI models can call to retrieve specific wisdom:

- **`get_chapter`** - Get a specific chapter (1-81) from The Way of Code
- **`search_principles`** - Search for principles relevant to a coding situation  

- **`get_principles_by_topic`** - Get principles for specific topics (simplicity, flow, humility, etc.)
- **`get_core_principles`** - Get the five fundamental principles

- **`get_philosophical_context`** - Get philosophical background and context

### 📚 Resources (Application-Controlled)
Contextual data that can be read and referenced:

- **`way://chapters/all`** - Complete collection of all 81 chapters (JSON)
- **`way://principles/core`** - The five fundamental principles (JSON)

- **`way://philosophy/overview`** - Complete philosophical framework (Markdown)
- **`way://keywords/index`** - Searchable keyword index (JSON)

### 💡 Prompts (User-Controlled)
Essential templated workflows for mindful development:

- **`code_review_with_tao`** - Review code following The Way of Code principles
- **`architecture_guidance`** - Get architectural guidance based on Taoist principles
- **`debugging_meditation`** - Mindful approach to debugging complex issues

## 🔧 Configuration

### Claude Desktop
Add to your `claude_desktop_config.json`:

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

### Cursor
Add to your `.cursor/mcp.json`:

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
Use the standard MCP client configuration with:
- **Command**: `npx`
- **Args**: `["the-way-of-code"]`
- **Transport**: stdio

## 📖 Usage Examples

### Using Tools
```javascript
// Get today's wisdom
await client.callTool("search_principles", { query: "debugging" });

// Search for principles about debugging
await client.callTool("search_principles", {
  query: "debugging problems",
  context: "Having trouble with a complex bug"
});

// Search for principles about flow
await client.callTool("search_principles", {
  query: "water flow",
  limit: 3
});
```

### Using Resources
```javascript
// Read all chapters for context
const chapters = await client.readResource("way://chapters/all");

// Get all chapters as JSON
const allChapters = await client.readResource("way://chapters/all");

// Access the keyword index
const keywords = await client.readResource("way://keywords/index");
```

### Using Prompts
```javascript
// Get a code review prompt
const prompt = await client.getPrompt("code_review_with_tao", {
  code: "function calculate(x, y) { return x * y + 10; }",
  focus: "simplicity"
});

// Get debugging guidance
const debugPrompt = await client.getPrompt("debugging_meditation", {
  problem_description: "Function returns undefined randomly",
  attempted_solutions: "Tried adding console.logs and debugging with Node inspector"
});
```

## 🌟 The Five Core Principles

1. **Simplicity Over Complexity** - Choose the simplest solution that works
2. **Flow Over Force** - Let solutions emerge naturally, don't force them
3. **Humility Over Ego** - Code without attachment to being "right"
4. **Balance Over Extremes** - Find the middle way in all technical decisions
5. **Presence Over Rushing** - Code with full attention and mindfulness

## 🎯 Use Cases

- **Code Reviews** - Apply philosophical principles to evaluate code quality
- **Architecture Design** - Balance competing concerns using ancient wisdom
- **Debugging** - Approach problems with presence and systematic thinking
- **Team Collaboration** - Foster harmony and effective communication
- **Daily Practice** - Integrate mindful development into your routine
- **Learning** - Understand deeper principles behind good software craftsmanship

## 🔗 Integration Examples

### With GitMCP.io
Access The Way of Code through GitMCP.io for instant integration:
```
https://gitmcp.io/mgd1984/the-way-of-code
```

### With AI Assistants
The server works seamlessly with:
- Claude Desktop
- Cursor IDE
- Windsurf
- Continue
- Zed
- Any MCP-compatible client

## 🤝 Contributing

We welcome contributions that align with The Way of Code principles:

1. **Simplicity** - Keep changes minimal and focused
2. **Flow** - Let improvements emerge naturally from real needs
3. **Humility** - Approach with beginner's mind and openness to feedback
4. **Balance** - Consider all stakeholders and use cases
5. **Presence** - Give full attention to quality and detail

## 📜 License

MIT License - See [LICENSE](../LICENSE) for details.

## 🙏 Acknowledgments

Inspired by the Tao Te Ching and adapted for the modern developer's journey. Special thanks to the MCP community for creating such an elegant protocol for AI integration.

---

*"The sage does not attempt anything very big, and thus achieves greatness."* - Tao Te Ching, Chapter 63 