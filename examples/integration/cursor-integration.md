# Cursor Integration Examples

## Basic Integration

### 1. Simple .cursorrules Integration

Copy the contents of `cursor-rules/.cursorrules` to your project's `.cursorrules` file:

```bash
cp cursor-rules/.cursorrules /path/to/your/project/.cursorrules
```

### 2. Project-Specific Rules

For a React project, you might add:

```
# The Way of Code - React Project
# Follow the five pillars of vibe coding

## React-Specific Principles
- Components should flow naturally from their purpose
- Avoid over-engineering state management
- Let component structure emerge from user needs
- Balance reusability with simplicity
- Write JSX that reads like natural language

## Before Writing Components
- What is the essential purpose of this component?
- What is the simplest way to achieve this?
- How can this serve the user's journey?

## Code Review Mantras
- "Does this component feel natural?"
- "Are we forcing complexity where simplicity would serve?"
- "Does this code flow like water?"

Reference: https://github.com/[username]/the-way-of-code/blob/main/principles/core-principles.md
```

## Advanced Integration

### 3. MCP Server Setup

If you have MCP support in Cursor:

```json
{
  "mcpServers": {
    "the-way-of-code": {
      "command": "npx",
      "args": ["@the-way-of-code/mcp-server"]
    }
  }
}
```

### 4. Contextual Prompting

Use these prompts to invoke The Way of Code principles:

```
# For debugging
"Help me debug this following The Way of Code principles. What would a Vibe Coder do here?"

# For architecture decisions  
"I'm designing this system. Please reference The Way of Code Chapter 11 about emptiness and interfaces."

# For refactoring
"This code feels forced. How can I refactor it to flow more naturally, following the principle of wu-wei?"

# For code review
"Review this code through the lens of The Way of Code. Does it embody simplicity over complexity?"
```

### 5. Daily Wisdom Integration

Add this to your daily workflow:

```bash
# Add to your shell profile
alias daily-wisdom="curl -s https://raw.githubusercontent.com/[username]/the-way-of-code/main/daily/$(date +%j).md"

# Or create a simple script
echo "#!/bin/bash
day_of_year=\$(date +%j)
chapter=\$((\$day_of_year % 81 + 1))
echo \"Today's Wisdom - Chapter \$chapter\"
curl -s \"https://raw.githubusercontent.com/[username]/the-way-of-code/main/text/chapter-\$chapter.md\"
" > ~/bin/way-of-code-daily
chmod +x ~/bin/way-of-code-daily
```

## Team Integration

### 6. Team .cursorrules Template

For teams adopting The Way of Code:

```
# Team Vibe Coding Standards
# Based on The Way of Code by Rick Rubin

## Our Coding Philosophy
We are Vibe Coders. We follow The Way of Code in all our development practices.

## Code Review Process
1. Technical correctness (does it work?)
2. Vibe check (does it flow naturally?)
3. Simplicity assessment (is this the simplest solution?)
4. Future flexibility (can this adapt to change?)

## Meeting Principles
- Lead with questions, not assertions
- Seek to understand before being understood  
- Let the best ideas emerge naturally
- No ego in technical discussions

## Conflict Resolution
- Step back and find the essence of disagreement
- Reference relevant chapters from The Way of Code
- Seek solutions that serve the user, not our preferences
- Remember: "The soft overcomes the hard"

## Daily Practices
- Start standups with a brief Way of Code reflection
- End code reviews with a vibe check
- Celebrate elegant solutions without ego
- Share knowledge freely

Reference: https://github.com/[username]/the-way-of-code
```

### 7. Git Hooks Integration

Add The Way of Code wisdom to your git workflow:

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🌊 The Way of Code Reminder:"
echo "\"When the work is done, log off and detach. This is the way of heaven.\" - Chapter 9"
echo ""
echo "Take a moment to review your changes with presence and humility."
echo ""
```

## IDE-Specific Customizations

### 8. VS Code Integration

If using VS Code with Cursor compatibility:

```json
// settings.json
{
  "wayOfCode.dailyWisdom": true,
  "wayOfCode.reminderInterval": "2h",
  "editor.rulers": [80],
  "editor.wordWrap": "bounded",
  "workbench.colorTheme": "Quiet Light", // Embrace simplicity
  "editor.minimap.enabled": false, // Reduce visual noise
}
```

### 9. Custom Snippets

Create code snippets that embody The Way of Code:

```json
// way-of-code.code-snippets
{
  "Vibe Function": {
    "prefix": "vibe-fn",
    "body": [
      "// Following The Way of Code - Chapter ${1:8}",
      "// \"${2:The highest good is like water}\"",
      "",
      "function ${3:functionName}(${4:params}) {",
      "  // Let the solution emerge naturally",
      "  ${5:// Implementation}",
      "  ",
      "  return ${6:result};",
      "}"
    ],
    "description": "Create a function with Way of Code wisdom"
  }
}
```

## Troubleshooting

### Common Issues

1. **Rules not applying**: Ensure `.cursorrules` is in your project root
2. **MCP server not connecting**: Check your MCP configuration and network
3. **Team resistance**: Start with core principles, not full implementation

### Getting Help

- Reference the [Core Principles](../principles/core-principles.md)
- Check the [Complete Text](../text/complete.md) for specific guidance
- Join the community discussions for support

---

*"The Vibe Coder does not accumulate possessions. The more they do for others, the more they gain."* - Chapter 81 