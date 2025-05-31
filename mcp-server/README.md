# The Way of Code — MCP Server

*Ancient wisdom, protocol native*

---

## Install

```bash
npx the-way-of-code
```

## Configure

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

---

## Implementation

### Tools
```typescript
get_chapter(n: 1..81)                    // Direct access
search_principles(query, context?, limit?) // Semantic search  
get_principles_by_topic(topic)           // Structured wisdom
get_core_principles()                    // Essential five
get_philosophical_context(aspect?)       // Deep background
```

### Resources
```
way://chapters/all       // Complete collection (JSON)
way://principles/core    // The five pillars (JSON)  
way://philosophy/overview // Framework (Markdown)
way://keywords/index     // Search index (JSON)
```

### Prompts
```
code_review_with_tao     // Philosophical review
architecture_guidance    // Design wisdom
debugging_meditation     // Mindful troubleshooting
```

Each primitive serves its nature. The composition emerges.

---

## Usage

### Search
```javascript
await mcp.call('search_principles', {
  query: 'debugging complex systems',
  context: 'Production performance issue'
});
```

### Access
```javascript
await mcp.readResource('way://chapters/all');
```

### Guide
```javascript
await mcp.getPrompt('code_review_with_tao', {
  code: source,
  focus: 'simplicity'
});
```

The tools do not explain themselves. They simply work.

---

## Principles

**Simplicity** over complexity  
**Flow** over force  
**Humility** over ego  
**Balance** over extremes  
**Presence** over rushing

Code emerges from understanding. Understanding emerges from practice.

---

## Integration

Works with any MCP client. No configuration beyond the essential.

The protocol serves the wisdom. The wisdom serves the code.

---

*"The sage does not attempt anything very big, and thus achieves greatness."* - Tao Te Ching, Chapter 63 