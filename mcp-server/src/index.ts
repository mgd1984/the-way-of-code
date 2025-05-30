#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
  CallToolRequest,
  Resource,
  ReadResourceRequest,
  Prompt,
  GetPromptRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { wayOfCodeData } from './data/way-of-code.js';

// Zod schemas for validation (keep these for runtime validation)
const GetChapterSchema = z.object({
  chapter: z.number().min(1).max(81),
});

const SearchPrinciplesSchema = z.object({
  query: z.string(),
  context: z.string().optional(),
});

const GetDailyWisdomSchema = z.object({
  date: z.string().optional(),
});

const GetPrinciplesByTopicSchema = z.object({
  topic: z.enum([
    'simplicity', 'complexity', 'flow', 'force', 'humility', 'ego', 
    'balance', 'extremes', 'presence', 'rushing', 'debugging', 
    'refactoring', 'architecture', 'collaboration', 'leadership'
  ]),
});

// Create server with enhanced capabilities
const server = new Server(
  {
    name: 'the-way-of-code',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// === RESOURCES IMPLEMENTATION ===
// Resources provide contextual data that can be read by clients

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'way://chapters/all',
        name: 'All Chapters',
        description: 'Complete collection of all 81 chapters from The Way of Code',
        mimeType: 'application/json'
      },
      {
        uri: 'way://principles/core',
        name: 'Core Principles',
        description: 'The five fundamental principles of The Way of Code',
        mimeType: 'application/json'
      },
      {
        uri: 'way://wisdom/daily',
        name: 'Daily Wisdom',
        description: 'Today\'s wisdom chapter based on current date',
        mimeType: 'text/plain'
      },
      {
        uri: 'way://philosophy/overview',
        name: 'Philosophy Overview',
        description: 'Complete philosophical framework and background',
        mimeType: 'text/markdown'
      },
      {
        uri: 'way://keywords/index',
        name: 'Keyword Index',
        description: 'Searchable index of all keywords and concepts',
        mimeType: 'application/json'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const uri = request.params.uri;

  switch (uri) {
    case 'way://chapters/all':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(wayOfCodeData.chapters, null, 2)
        }]
      };

    case 'way://principles/core':
      const corePrinciples = [
        {
          title: "Simplicity Over Complexity",
          description: "Choose the simplest solution that works. Complexity should emerge naturally from necessity, not from cleverness.",
          chapters: [1, 19, 31],
          keywords: ["simplicity", "elegant", "minimal"]
        },
        {
          title: "Flow Over Force", 
          description: "Don't force solutions; let them emerge naturally. Work with the grain of the problem, not against it.",
          chapters: [3, 8, 43],
          keywords: ["flow", "water", "wu-wei", "natural"]
        },
        {
          title: "Humility Over Ego",
          description: "Code without attachment to being 'right'. The best solutions often come from admitting what you don't know.",
          chapters: [17, 66, 71],
          keywords: ["humility", "ego", "learning", "openness"]
        },
        {
          title: "Balance Over Extremes",
          description: "Neither too rigid nor too loose. Find the middle way between over-engineering and under-engineering.",
          chapters: [9, 22, 76],
          keywords: ["balance", "moderation", "stability", "harmony"]
        },
        {
          title: "Presence Over Rushing",
          description: "Code with full attention to the current task. Quality emerges from mindful, present-moment awareness.",
          chapters: [10, 15, 63],
          keywords: ["presence", "mindfulness", "attention", "quality"]
        }
      ];
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(corePrinciples, null, 2)
        }]
      };

    case 'way://wisdom/daily':
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const chapterNumber = ((dayOfYear - 1) % 81) + 1;
      const dailyChapter = wayOfCodeData.chapters.find(c => c.number === chapterNumber);
      
      const dailyWisdom = `# Daily Wisdom - ${today.toDateString()}

## Chapter ${dailyChapter?.number}

${dailyChapter?.text}

## Today's Coding Reflection

${dailyChapter?.codingApplication}

*Keywords: ${dailyChapter?.keywords.join(', ')}*`;

      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: dailyWisdom
        }]
      };

    case 'way://philosophy/overview':
      const philosophyOverview = `# The Way of Code: Philosophical Framework

## Origins and Inspiration

The Way of Code draws from ancient Taoist wisdom, particularly the Tao Te Ching, adapting its timeless principles for modern software development. Like water that flows around obstacles, code should follow the path of least resistance while maintaining its essential purpose.

## Core Philosophy

### Wu Wei (無為) - Non-Action
In coding, this means not forcing solutions but allowing them to emerge naturally from understanding the problem deeply. The best code often writes itself when we truly comprehend what needs to be done.

### Yin and Yang - Balance
Every technical decision involves trade-offs. The Way of Code teaches us to find harmony between:
- Simplicity and functionality
- Performance and readability  
- Innovation and stability
- Individual brilliance and team collaboration

### Te (德) - Virtue in Code
True mastery comes not from showing off technical prowess, but from writing code that serves others - maintainable, readable, and purposeful.

## Practical Applications

This philosophy manifests in daily practice through:
- Mindful coding sessions
- Embracing uncertainty and learning
- Collaborative problem-solving
- Sustainable development practices
- Continuous reflection and improvement

## The 81 Chapters

Each chapter represents a facet of this philosophy, offering both ancient wisdom and practical coding applications. Together, they form a complete guide for the mindful developer.`;

      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: philosophyOverview
        }]
      };

    case 'way://keywords/index':
      const keywordIndex = wayOfCodeData.chapters.reduce((index: Record<string, number[]>, chapter) => {
        chapter.keywords.forEach(keyword => {
          if (!index[keyword]) {
            index[keyword] = [];
          }
          index[keyword].push(chapter.number);
        });
        return index;
      }, {});

      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(keywordIndex, null, 2)
        }]
      };

    default:
      throw new Error(`Resource not found: ${uri}`);
  }
});

// === PROMPTS IMPLEMENTATION ===
// Prompts provide templated workflows and interactions

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'code-review-wisdom',
        description: 'Apply Way of Code principles to review code for philosophical alignment',
        arguments: [
          {
            name: 'code',
            description: 'The code to review',
            required: true
          },
          {
            name: 'focus',
            description: 'Specific principle to focus on (simplicity, flow, humility, balance, presence)',
            required: false
          }
        ]
      },
      {
        name: 'debug-with-presence',
        description: 'Approach debugging with mindfulness and systematic thinking',
        arguments: [
          {
            name: 'problem_description',
            description: 'Description of the bug or issue',
            required: true
          },
          {
            name: 'context',
            description: 'Additional context about the system or environment',
            required: false
          }
        ]
      },
      {
        name: 'architecture-balance',
        description: 'Design system architecture following the principle of balance',
        arguments: [
          {
            name: 'requirements',
            description: 'System requirements and constraints',
            required: true
          },
          {
            name: 'scale',
            description: 'Expected scale (small, medium, large, enterprise)',
            required: false
          }
        ]
      },
      {
        name: 'refactor-with-flow',
        description: 'Refactor code following the principle of natural flow',
        arguments: [
          {
            name: 'current_code',
            description: 'The code that needs refactoring',
            required: true
          },
          {
            name: 'pain_points',
            description: 'Specific issues or pain points with current implementation',
            required: false
          }
        ]
      },
      {
        name: 'team-collaboration',
        description: 'Foster team collaboration using Way of Code principles',
        arguments: [
          {
            name: 'situation',
            description: 'The team situation or challenge',
            required: true
          },
          {
            name: 'team_size',
            description: 'Size of the team',
            required: false
          }
        ]
      },
      {
        name: 'daily-reflection',
        description: 'End-of-day reflection on coding practice and growth',
        arguments: [
          {
            name: 'accomplishments',
            description: 'What was accomplished today',
            required: false
          },
          {
            name: 'challenges',
            description: 'Challenges faced during the day',
            required: false
          }
        ]
      }
    ]
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request: GetPromptRequest) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'code-review-wisdom':
      const code = args?.code || '';
      const focus = args?.focus || 'all principles';
      
      return {
        description: `Apply Way of Code principles to review code with focus on ${focus}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please review the following code through the lens of The Way of Code philosophy, focusing on ${focus}:

\`\`\`
${code}
\`\`\`

Consider these aspects:
- **Simplicity**: Is this the simplest solution that works?
- **Flow**: Does the code follow natural patterns and logic?
- **Humility**: Is the code written for others to understand?
- **Balance**: Are trade-offs well-considered?
- **Presence**: Does the code show mindful attention to detail?

Provide specific suggestions for improvement that align with these principles.`
            }
          }
        ]
      };

    case 'debug-with-presence':
      const problemDescription = args?.problem_description || '';
      const context = args?.context || '';
      
      return {
        description: 'Approach debugging with mindfulness and systematic thinking',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `I'm experiencing this issue: ${problemDescription}

${context ? `Context: ${context}` : ''}

Help me debug this using The Way of Code approach:

1. **Presence**: Let's start by observing the problem without rushing to solutions
2. **Humility**: What assumptions might I be making that could be wrong?
3. **Flow**: What is the natural path to understanding this issue?
4. **Simplicity**: What's the simplest way to isolate and identify the root cause?
5. **Balance**: How can I fix this without creating new problems?

Guide me through a mindful debugging process.`
            }
          }
        ]
      };

    case 'architecture-balance':
      const requirements = args?.requirements || '';
      const scale = args?.scale || 'medium';
      
      return {
        description: 'Design system architecture following the principle of balance',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `I need to design a system architecture for a ${scale}-scale project with these requirements:

${requirements}

Please help me design this following The Way of Code principles:

- **Balance**: Find the middle way between over-engineering and under-engineering
- **Simplicity**: Start with the simplest architecture that could work
- **Flow**: Ensure data and control flow naturally through the system
- **Humility**: Design for change and acknowledge what we don't know yet
- **Presence**: Consider both current needs and future growth mindfully

What architecture would you recommend, and how does it embody these principles?`
            }
          }
        ]
      };

    case 'refactor-with-flow':
      const currentCode = args?.current_code || '';
      const painPoints = args?.pain_points || '';
      
      return {
        description: 'Refactor code following the principle of natural flow',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `I need to refactor this code to improve its flow and naturalness:

\`\`\`
${currentCode}
\`\`\`

${painPoints ? `Current pain points: ${painPoints}` : ''}

Please help me refactor this following the principle of Flow from The Way of Code:

- Like water, code should follow the path of least resistance
- Remove unnecessary friction and complexity
- Let the natural structure emerge from the problem domain
- Ensure smooth transitions between different parts
- Make the code feel effortless to read and understand

Show me how to transform this code to flow more naturally.`
            }
          }
        ]
      };

    case 'team-collaboration':
      const situation = args?.situation || '';
      const teamSize = args?.team_size || '';
      
      return {
        description: 'Foster team collaboration using Way of Code principles',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Our team ${teamSize ? `of ${teamSize} people` : ''} is facing this situation:

${situation}

How can we apply The Way of Code principles to improve our collaboration?

- **Humility**: How can we create space for everyone's ideas and admit when we don't know?
- **Balance**: How do we balance individual contributions with team harmony?
- **Flow**: How can we make our collaboration feel natural and effortless?
- **Presence**: How do we stay mindful and attentive to each other's needs?
- **Simplicity**: What's the simplest way to resolve this and move forward?

Please provide specific, actionable advice for our team.`
            }
          }
        ]
      };

    case 'daily-reflection':
      const accomplishments = args?.accomplishments || '';
      const challenges = args?.challenges || '';
      
      return {
        description: 'End-of-day reflection on coding practice and growth',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Let's reflect on today's coding journey:

${accomplishments ? `Accomplishments: ${accomplishments}` : ''}
${challenges ? `Challenges: ${challenges}` : ''}

Help me reflect on today through The Way of Code lens:

1. **Presence**: How mindful was I in my coding today? When did I rush, and when was I fully present?

2. **Humility**: What did I learn today? What assumptions were challenged? Where did I ask for help?

3. **Flow**: When did my coding feel effortless and natural? When did I fight against the problem?

4. **Balance**: How well did I balance different priorities? What trade-offs did I make?

5. **Simplicity**: Did I choose simple solutions, or did I overcomplicate things?

6. **Growth**: What principle should I focus on tomorrow to continue growing?

Guide me through this reflection to end the day with wisdom and intention.`
            }
          }
        ]
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// === TOOLS IMPLEMENTATION (Enhanced) ===
// Keep existing tools but enhance them

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_chapter',
        description: 'Get a specific chapter from The Way of Code',
        inputSchema: {
          type: 'object',
          properties: {
            chapter: {
              type: 'number',
              description: 'Chapter number (1-81)',
              minimum: 1,
              maximum: 81
            }
          },
          required: ['chapter']
        },
      },
      {
        name: 'search_principles',
        description: 'Search for principles relevant to a coding situation',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for finding relevant principles'
            },
            context: {
              type: 'string',
              description: 'Optional context about the coding situation'
            }
          },
          required: ['query']
        },
      },
      {
        name: 'get_daily_wisdom',
        description: 'Get daily wisdom based on the current date',
        inputSchema: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format (optional, defaults to today)'
            }
          }
        },
      },
      {
        name: 'get_principles_by_topic',
        description: 'Get principles related to a specific coding topic',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              enum: ['simplicity', 'complexity', 'flow', 'force', 'humility', 'ego', 'balance', 'extremes', 'presence', 'rushing', 'debugging', 'refactoring', 'architecture', 'collaboration', 'leadership'],
              description: 'Topic to find principles for'
            }
          },
          required: ['topic']
        },
      },
      {
        name: 'get_core_principles',
        description: 'Get the five core principles of The Way of Code',
        inputSchema: {
          type: 'object',
          properties: {}
        },
      },
      {
        name: 'find_wisdom_by_keyword',
        description: 'Find chapters containing specific keywords or concepts',
        inputSchema: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'Keyword to search for in chapters'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              minimum: 1,
              maximum: 20
            }
          },
          required: ['keyword']
        },
      },
      {
        name: 'get_philosophical_context',
        description: 'Get philosophical background and context for The Way of Code',
        inputSchema: {
          type: 'object',
          properties: {
            aspect: {
              type: 'string',
              enum: ['origins', 'taoism', 'wu-wei', 'yin-yang', 'practical-application', 'modern-relevance'],
              description: 'Specific philosophical aspect to explore'
            }
          }
        },
      }
    ],
  };
});

// Handle tool calls (keep existing + add new ones)
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_chapter': {
        const { chapter } = GetChapterSchema.parse(args);
        const chapterData = wayOfCodeData.chapters.find(c => c.number === chapter);
        
        if (!chapterData) {
          throw new Error(`Chapter ${chapter} not found. Please use a number between 1 and 81.`);
        }

        return {
          content: [
            {
              type: 'text',
              text: `**Chapter ${chapterData.number}**\n\n${chapterData.text}\n\n**Coding Application:**\n${chapterData.codingApplication}\n\n**Keywords:** ${chapterData.keywords.join(', ')}`,
            },
          ],
        };
      }

      case 'search_principles': {
        const { query, context } = SearchPrinciplesSchema.parse(args);
        const searchTerms = query.toLowerCase().split(' ');
        
        const relevantChapters = wayOfCodeData.chapters.filter(chapter => {
          const searchText = `${chapter.text} ${chapter.codingApplication} ${chapter.keywords.join(' ')}`.toLowerCase();
          return searchTerms.some(term => searchText.includes(term));
        }).slice(0, 5); // Limit to top 5 results

        if (relevantChapters.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No principles found for "${query}". Try searching for terms like: simplicity, flow, balance, humility, presence, water, emptiness, or wu-wei.`,
              },
            ],
          };
        }

        const results = relevantChapters.map(chapter => 
          `**Chapter ${chapter.number}**\n${chapter.text}\n\n*Application:* ${chapter.codingApplication}`
        ).join('\n\n---\n\n');

        const contextNote = context ? `\n\n**Context:** ${context}\n\nThese principles may help guide your approach to this situation.` : '';

        return {
          content: [
            {
              type: 'text',
              text: `Found ${relevantChapters.length} relevant principles for "${query}":${contextNote}\n\n${results}`,
            },
          ],
        };
      }

      case 'get_daily_wisdom': {
        const { date } = GetDailyWisdomSchema.parse(args);
        const targetDate = date ? new Date(date) : new Date();
        
        // Use day of year to select chapter (1-365 maps to 1-81 with cycling)
        const dayOfYear = Math.floor((targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        const chapterNumber = ((dayOfYear - 1) % 81) + 1;
        
        const chapterData = wayOfCodeData.chapters.find(c => c.number === chapterNumber);
        
        if (!chapterData) {
          throw new Error('Unable to find daily wisdom chapter.');
        }

        return {
          content: [
            {
              type: 'text',
              text: `**Daily Wisdom - ${targetDate.toDateString()}**\n\n**Chapter ${chapterData.number}**\n\n${chapterData.text}\n\n**Today's Coding Reflection:**\n${chapterData.codingApplication}`,
            },
          ],
        };
      }

      case 'get_principles_by_topic': {
        const { topic } = GetPrinciplesByTopicSchema.parse(args);
        
        const topicKeywords: Record<string, string[]> = {
          simplicity: ['simplicity', 'simple', 'complexity', 'elegant'],
          complexity: ['complexity', 'complex', 'simple', 'patterns'],
          flow: ['flow', 'water', 'natural', 'wu-wei', 'non-action'],
          force: ['force', 'counterforce', 'power', 'control'],
          humility: ['humility', 'humble', 'ego', 'pride'],
          ego: ['ego', 'pride', 'humility', 'boasting'],
          balance: ['balance', 'extremes', 'moderation', 'stability'],
          extremes: ['extremes', 'balance', 'moderation', 'excess'],
          presence: ['presence', 'mindfulness', 'stillness', 'moment'],
          rushing: ['rushing', 'restless', 'stillness', 'patience'],
          debugging: ['problems', 'thinking', 'clarity', 'observation'],
          refactoring: ['yielding', 'flexible', 'adaptation', 'change'],
          architecture: ['emptiness', 'space', 'structure', 'foundation'],
          collaboration: ['leadership', 'team', 'trust', 'service'],
          leadership: ['leadership', 'trust', 'humility', 'service']
        };

        const keywords = topicKeywords[topic] || [topic];
        const relevantChapters = wayOfCodeData.chapters.filter(chapter => {
          return keywords.some(keyword => 
            chapter.keywords.includes(keyword) || 
            chapter.text.toLowerCase().includes(keyword) ||
            chapter.codingApplication?.toLowerCase().includes(keyword)
          );
        }).slice(0, 3);

        if (relevantChapters.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No specific principles found for topic "${topic}". Try one of these topics: ${Object.keys(topicKeywords).join(', ')}.`,
              },
            ],
          };
        }

        const results = relevantChapters.map(chapter => 
          `**Chapter ${chapter.number}**\n${chapter.text}\n\n*Application:* ${chapter.codingApplication}`
        ).join('\n\n---\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `**Principles for ${topic.charAt(0).toUpperCase() + topic.slice(1)}:**\n\n${results}`,
            },
          ],
        };
      }

      case 'get_core_principles': {
        const corePrinciples = [
          {
            title: "Simplicity Over Complexity",
            description: "Choose the simplest solution that works. Complexity should emerge naturally from necessity, not from cleverness.",
            chapters: [1, 19, 31]
          },
          {
            title: "Flow Over Force", 
            description: "Don't force solutions; let them emerge naturally. Work with the grain of the problem, not against it.",
            chapters: [3, 8, 43]
          },
          {
            title: "Humility Over Ego",
            description: "Code without attachment to being 'right'. The best solutions often come from admitting what you don't know.",
            chapters: [17, 66, 71]
          },
          {
            title: "Balance Over Extremes",
            description: "Neither too rigid nor too loose. Find the middle way between over-engineering and under-engineering.",
            chapters: [9, 22, 76]
          },
          {
            title: "Presence Over Rushing",
            description: "Code with full attention to the current task. Quality emerges from mindful, present-moment awareness.",
            chapters: [10, 15, 63]
          }
        ];

        const principleText = corePrinciples.map(principle => 
          `**${principle.title}**\n${principle.description}\n*See chapters: ${principle.chapters.join(', ')}*`
        ).join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `**The Five Core Principles of The Way of Code:**\n\n${principleText}\n\n*These principles form the foundation of vibe coding - a approach that emphasizes harmony, naturalness, and sustainable development practices.*`,
            },
          ],
        };
      }

      case 'find_wisdom_by_keyword': {
        const keyword = (args?.keyword as string)?.toLowerCase() || '';
        const limit = Math.min((args?.limit as number) || 5, 20);
        
        if (!keyword) {
          throw new Error('Keyword is required');
        }

        const matchingChapters = wayOfCodeData.chapters.filter(chapter => {
          const searchText = `${chapter.text} ${chapter.codingApplication} ${chapter.keywords.join(' ')}`.toLowerCase();
          return searchText.includes(keyword);
        }).slice(0, limit);

        if (matchingChapters.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No chapters found containing "${keyword}". Try related terms or browse the keyword index.`,
              },
            ],
          };
        }

        const results = matchingChapters.map(chapter => 
          `**Chapter ${chapter.number}**\n${chapter.text}\n\n*Application:* ${chapter.codingApplication}\n*Keywords:* ${chapter.keywords.join(', ')}`
        ).join('\n\n---\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `Found ${matchingChapters.length} chapters containing "${keyword}":\n\n${results}`,
            },
          ],
        };
      }

      case 'get_philosophical_context': {
        const aspect = (args?.aspect as string) || 'origins';
        
        const contexts: Record<string, string> = {
          origins: `**Origins of The Way of Code**

The Way of Code draws inspiration from the ancient Chinese text "Tao Te Ching" (道德經), attributed to Lao Tzu. Written over 2,500 years ago, this foundational text of Taoism offers timeless wisdom about living in harmony with the natural order.

The adaptation to software development recognizes that coding, like life, benefits from following natural principles rather than forcing artificial constructs. Just as the Tao represents the underlying pattern of the universe, there exists an underlying pattern to elegant, maintainable code.`,

          taoism: `**Taoist Principles in Coding**

Taoism emphasizes:
- **Wu Wei (無為)**: Non-action or effortless action - writing code that feels natural and unforced
- **Yin-Yang (陰陽)**: Balance and complementarity - recognizing that every technical decision involves trade-offs
- **Ziran (自然)**: Naturalness and spontaneity - letting solutions emerge organically
- **Te (德)**: Virtue and power - the quiet strength that comes from doing things the right way

These principles translate directly to software craftsmanship.`,

          'wu-wei': `**Wu Wei in Software Development**

Wu Wei (無為) literally means "non-action" but is better understood as "effortless action" or "action in accordance with the natural flow."

In coding, Wu Wei manifests as:
- Not forcing a solution when the problem isn't fully understood
- Allowing the right architecture to emerge from requirements
- Writing code that feels natural to read and modify
- Debugging by observing rather than frantically changing things
- Letting team dynamics flow naturally rather than micromanaging`,

          'yin-yang': `**Yin-Yang Balance in Technology**

The concept of Yin-Yang teaches us that apparent opposites are actually complementary:

- **Performance vs. Readability**: Both are necessary; the art is finding the right balance
- **Innovation vs. Stability**: New features must be balanced with system reliability
- **Individual Brilliance vs. Team Harmony**: Personal excellence serves the greater good
- **Planning vs. Adaptability**: Structure provides freedom to respond to change
- **Complexity vs. Simplicity**: Sometimes complexity is necessary, but it should be intentional`,

          'practical-application': `**Practical Application of The Way**

The Way of Code isn't just philosophy—it's a practical approach:

1. **Daily Practice**: Begin each coding session with intention and presence
2. **Code Reviews**: Approach others' code with humility and curiosity
3. **Problem Solving**: Observe before acting, understand before implementing
4. **Team Dynamics**: Lead by example, serve others' growth
5. **Technical Decisions**: Consider long-term harmony, not just immediate solutions
6. **Learning**: Embrace beginner's mind, even as expertise grows`,

          'modern-relevance': `**Modern Relevance of Ancient Wisdom**

In our fast-paced, technology-driven world, ancient wisdom offers crucial balance:

- **Mindfulness vs. Multitasking**: Deep focus produces better code than scattered attention
- **Sustainability vs. Speed**: Building for the long term prevents technical debt
- **Collaboration vs. Competition**: Shared success creates stronger systems
- **Simplicity vs. Feature Creep**: Elegant solutions often require saying "no"
- **Human-Centered vs. Technology-Centered**: Technology should serve human flourishing

The Way of Code provides a framework for navigating these modern challenges with ancient wisdom.`
        };

        return {
          content: [
            {
              type: 'text',
              text: contexts[aspect] || contexts.origins,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('The Way of Code MCP Server running on stdio with enhanced capabilities');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 