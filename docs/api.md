# The Way of Code - MCP Server API

*"Empty, yet inexhaustible, fathomless and eternal"* - Chapter 4

## Server Information

- **Name**: `the-way-of-code`
- **Version**: `1.1.2`
- **NPM Package**: `the-way-of-code`
- **Install**: `npx the-way-of-code`

## Capabilities

The server implements all three MCP primitives following natural patterns:

### 🛠️ Tools (Model-Controlled)
Tools act when called upon, like water flowing around obstacles.

#### `get_chapter`
Retrieve a specific chapter from The Way of Code.

**Parameters:**
- `chapter` (number, required): Chapter number (1-81)

**Example:**
```typescript
await mcp.call('get_chapter', { chapter: 15 });
```

#### `search_principles`
Search for principles relevant to a coding situation.

**Parameters:**
- `query` (string, required): Search query
- `context` (string, optional): Additional context

**Example:**
```typescript
await mcp.call('search_principles', {
  query: 'debugging complex problems',
  context: 'Production issue'
});
```

#### `get_daily_wisdom`
Get daily wisdom based on the current date.

**Parameters:**
- `date` (string, optional): Date in YYYY-MM-DD format

#### `get_principles_by_topic`
Get principles related to a specific topic.

**Parameters:**
- `topic` (enum, required): One of: `simplicity`, `complexity`, `flow`, `force`, `humility`, `ego`, `balance`, `extremes`, `presence`, `rushing`, `debugging`, `refactoring`, `architecture`, `collaboration`, `leadership`

#### `get_core_principles`
Get the five core principles of The Way of Code.

**Parameters:** None

#### `find_wisdom_by_keyword`
Find chapters containing specific keywords.

**Parameters:**
- `keyword` (string, required): Keyword to search for
- `limit` (number, optional): Max results (1-20, default: 5)

#### `get_philosophical_context`
Get philosophical background and context.

**Parameters:**
- `aspect` (enum, optional): One of: `origins`, `taoism`, `wu-wei`, `yin-yang`, `practical-application`, `modern-relevance`

### 📚 Resources (Application-Controlled)
Resources provide context like still water reflecting wisdom.

#### `way://chapters/all`
Complete collection of all 81 chapters (JSON format).

#### `way://principles/core`
The five core principles (JSON format).

#### `way://wisdom/daily`
Today's wisdom chapter based on current date (Markdown format).

#### `way://philosophy/overview`
Complete philosophical framework (Markdown format).

#### `way://keywords/index`
Searchable keyword index (JSON format).

### 💡 Prompts (User-Controlled)
Prompts guide users naturally toward mindful solutions.

#### `code-review-wisdom`
Apply Way of Code principles to code review.

**Arguments:**
- `code` (string, required): Code to review
- `focus` (string, optional): Specific principle to focus on

#### `debug-with-presence`
Approach debugging with mindfulness.

**Arguments:**
- `problem_description` (string, required): Description of the issue
- `context` (string, optional): Additional context

#### `architecture-balance`
Design system architecture following balance principles.

**Arguments:**
- `requirements` (string, required): System requirements
- `scale` (string, optional): Expected scale

#### `refactor-with-flow`
Refactor code following natural flow principles.

**Arguments:**
- `current_code` (string, required): Code to refactor
- `pain_points` (string, optional): Specific issues

#### `team-collaboration`
Foster team collaboration using Way of Code principles.

**Arguments:**
- `situation` (string, required): Team situation
- `team_size` (string, optional): Size of team

#### `daily-reflection`
End-of-day reflection on coding practice.

**Arguments:**
- `accomplishments` (string, optional): What was accomplished
- `challenges` (string, optional): Challenges faced

## Error Handling

All tools return graceful error responses with helpful messages following the principle of **Humility Over Ego**.

## Philosophy Integration

The API design itself embodies The Way of Code:
- **Simplicity Over Complexity**: Clear, focused endpoints
- **Flow Over Force**: Natural usage patterns
- **Balance Over Extremes**: Complete but not overwhelming
- **Presence Over Rushing**: Thoughtful parameter design
- **Humility Over Ego**: Helpful error messages

*"The highest good is like water. Water nourishes the ten thousand things without effort."* - Chapter 8 