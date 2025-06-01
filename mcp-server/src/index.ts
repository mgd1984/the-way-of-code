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

// Input validation schemas - simple and focused
const GetChapterSchema = z.object({
  chapter: z.number().min(1).max(81),
  profane: z.boolean().optional().default(false),
});

const SearchWisdomSchema = z.object({
  query: z.string().min(1),
  context: z.string().optional(),
  limit: z.number().min(1).max(20).optional(),
});

const GetPrinciplesByTopicSchema = z.object({
  topic: z.enum([
    'simplicity', 'complexity', 'flow', 'force', 'humility', 'ego', 
    'balance', 'extremes', 'presence', 'rushing', 'debugging', 
    'refactoring', 'architecture', 'collaboration', 'leadership'
  ]),
});

const GetPhilosophicalContextSchema = z.object({
  aspect: z.enum(['origins', 'taoism', 'wu-wei', 'yin-yang', 'practical-application', 'modern-relevance']).optional(),
});

// Core principles - the foundation of The Way of Code
const CORE_PRINCIPLES = [
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
] as const;

// Create server with enhanced capabilities
const server = new Server(
  {
    name: 'the-way-of-code',
    version: '1.1.2',
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
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(CORE_PRINCIPLES, null, 2)
        }]
      };

    case 'way://philosophy/overview':
      const philosophyOverview = `# The Way of Code: Philosophical Framework

## Origins and Inspiration

The Way of Code draws from ancient Taoist wisdom, particularly the Tao Te Ching, adapting its timeless principles for modern software development. Like water that flows around obstacles, code should follow the path of least resistance while maintaining its essential purpose.

## Core Philosophy

### Wu Wei (無為) - Non-Action
In coding, this means not forcing solutions but allowing them to emerge naturally from understanding the problem deeply. The best code often writes itself when we truly comprehend what needs to be done.

### Yin-Yang (陰陽) - Balance and Complementarity  
Every technical decision involves trade-offs. The art is finding harmony between opposing forces: performance vs. readability, innovation vs. stability, individual excellence vs. team harmony.

### Ziran (自然) - Naturalness and Spontaneity
Code should feel natural to read and modify. The best architectures emerge organically from understanding the problem domain, not from forcing predetermined patterns.

### Te (德) - Virtue and Quiet Power
True technical leadership comes from serving others' growth and the greater good, not from domination or showing off.

## Practical Application

1. **Mindful Development**: Approach each coding session with presence and intention
2. **Sustainable Practices**: Build for the long term, not just immediate needs  
3. **Collaborative Excellence**: Share knowledge freely and learn from others
4. **Adaptive Architecture**: Create systems that can evolve gracefully
5. **Quality Focus**: Emphasize depth over breadth, substance over style

## Modern Relevance

In our fast-paced world, these ancient principles offer crucial balance:
- Mindfulness vs. Multitasking
- Sustainability vs. Speed  
- Collaboration vs. Competition
- Simplicity vs. Feature Creep
- Human-Centered vs. Technology-Centered approaches

The Way of Code provides a framework for navigating modern development challenges with timeless wisdom.`;

      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: philosophyOverview
        }]
      };

    case 'way://keywords/index':
      // Create a searchable index of all keywords
      const keywordIndex = wayOfCodeData.chapters.reduce((acc, chapter) => {
        chapter.keywords.forEach(keyword => {
          if (!acc[keyword]) {
            acc[keyword] = [];
          }
          acc[keyword].push({
            chapter: chapter.number,
            excerpt: chapter.text.substring(0, 150) + '...'
          });
        });
        return acc;
      }, {} as Record<string, Array<{ chapter: number; excerpt: string }>>);

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
// Prompts provide templates for common workflows

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'code_review_with_tao',
        description: 'Review code following The Way of Code principles',
        arguments: [
          {
            name: 'code',
            description: 'Code to review',
            required: true
          },
          {
            name: 'focus',
            description: 'Specific aspect to focus on (simplicity, flow, etc.)',
            required: false
          }
        ]
      },
      {
        name: 'architecture_guidance',
        description: 'Get architectural guidance based on Taoist principles',
        arguments: [
          {
            name: 'requirements',
            description: 'System requirements or constraints',
            required: true
          },
          {
            name: 'current_challenges',
            description: 'Current architectural challenges',
            required: false
          }
        ]
      },
      {
        name: 'debugging_meditation',
        description: 'Mindful approach to debugging complex issues',
        arguments: [
          {
            name: 'problem_description',
            description: 'Description of the issue',
            required: true
          },
          {
            name: 'attempted_solutions',
            description: 'What has been tried so far',
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
    case 'code_review_with_tao': {
      const code = args?.code || '';
      const focus = args?.focus || 'general principles';
      
      return {
        description: `Code review following The Way of Code principles, focusing on ${focus}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Review this code following The Way of Code principles, specifically focusing on ${focus}:

\`\`\`
${code}
\`\`\`

Apply these core principles:
1. **Simplicity Over Complexity**: Is this the simplest solution that works?
2. **Flow Over Force**: Does the code flow naturally or feel forced?
3. **Humility Over Ego**: Is the code written to serve its purpose or to impress?
4. **Balance Over Extremes**: Are there appropriate trade-offs and balance?
5. **Presence Over Rushing**: Does the code show mindful attention to quality?

Provide specific, actionable feedback in the spirit of gentle guidance rather than harsh criticism.`
            }
          }
        ]
      };
    }

    case 'architecture_guidance': {
      const requirements = args?.requirements || '';
      const challenges = args?.current_challenges || '';
      
      return {
        description: 'Architectural guidance based on Taoist principles',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Design architectural guidance for this system following The Way of Code:

**Requirements:**
${requirements}

**Current Challenges:**
${challenges}

Apply these principles:
- **Empty Spaces**: What doesn't need to be built? (Chapter 11)
- **Natural Flow**: How should data and control flow naturally through the system?
- **Yielding and Flexibility**: How can the architecture adapt to changing requirements?
- **Simplicity**: What is the simplest architecture that could work?
- **Balance**: How to balance different concerns (performance, maintainability, scalability)?

Provide architectural guidance that emphasizes sustainability, clarity, and natural evolution over complex abstractions.`
            }
          }
        ]
      };
    }

    case 'debugging_meditation': {
      const problem = args?.problem_description || '';
      const attempted = args?.attempted_solutions || '';
      
      return {
        description: 'Mindful approach to debugging',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Help me approach this debugging challenge with mindfulness and clarity:

**Problem:**
${problem}

**What I've Tried:**
${attempted}

Following The Way of Code for debugging:
1. **Stillness**: Step back and observe without immediately acting
2. **Emptiness**: What assumptions can I release?
3. **Natural Flow**: Where is the system fighting against its natural behavior?
4. **Wu Wei**: How can I solve this through minimal, precise intervention?
5. **Beginner's Mind**: What would I notice if seeing this for the first time?

Guide me toward a mindful debugging approach that focuses on understanding before action.`
            }
          }
        ]
      };
    }

    default:
      throw new Error(`Prompt not found: ${name}`);
  }
});

// === TOOLS IMPLEMENTATION ===
// Tools provide callable functions for specific tasks

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
            },
            profane: {
              type: 'boolean',
              description: 'Return the profane version if available (default: false)',
              default: false
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
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              minimum: 1,
              maximum: 20
            }
          },
          required: ['query']
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
          properties: {
            random_string: {
              type: 'string',
              description: 'Dummy parameter for no-parameter tools'
            }
          },
          required: ['random_string']
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

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_chapter': {
        const { chapter, profane } = GetChapterSchema.parse(args);
        const chapterData = wayOfCodeData.chapters.find(c => c.number === chapter);
        
        if (!chapterData) {
          throw new Error(`Chapter ${chapter} not found. Please use a number between 1 and 81.`);
        }

        // Use profane version if requested and available, otherwise use original
        const chapterText = profane && chapterData.profaneVersion ? 
          chapterData.profaneVersion : 
          chapterData.text;

        const versionNote = profane && chapterData.profaneVersion ? 
          " (Profane Version)" : 
          profane && !chapterData.profaneVersion ? 
          " (Profane version not available for this chapter)" : 
          "";

        return {
          content: [
            {
              type: 'text',
              text: `**Chapter ${chapterData.number}${versionNote}**\n\n${chapterText}\n\n**Coding Application:**\n${chapterData.codingApplication}\n\n**Keywords:** ${chapterData.keywords.join(', ')}`,
            },
          ],
        };
      }

      case 'search_principles': {
        const { query, context, limit = 5 } = SearchWisdomSchema.parse(args);
        const searchTerms = query.toLowerCase().split(/\s+/);
        
        // Score chapters by relevance - both exact matches and keyword matches
        const scoredChapters = wayOfCodeData.chapters.map(chapter => {
          const searchText = `${chapter.text} ${chapter.codingApplication} ${chapter.keywords.join(' ')}`.toLowerCase();
          
          // Calculate score based on term frequency and keyword matches
          let score = 0;
          searchTerms.forEach(term => {
            // Higher weight for keyword matches
            if (chapter.keywords.some(keyword => keyword.toLowerCase().includes(term))) {
              score += 5;
            }
            // Standard weight for text matches
            const termCount = (searchText.match(new RegExp(term, 'g')) || []).length;
            score += termCount;
          });
          
          return { chapter, score };
        }).filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        if (scoredChapters.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No principles found for "${query}". Try searching for terms like: simplicity, flow, balance, humility, presence, water, emptiness, or wu-wei.`,
              },
            ],
          };
        }

        const results = scoredChapters.map(({ chapter }) => 
          `**Chapter ${chapter.number}**\n${chapter.text}\n\n*Application:* ${chapter.codingApplication}\n*Keywords:* ${chapter.keywords.join(', ')}`
        ).join('\n\n---\n\n');

        const contextNote = context ? `\n\n**Context:** ${context}\n\nThese principles may help guide your approach to this situation.` : '';

        return {
          content: [
            {
              type: 'text',
              text: `Found ${scoredChapters.length} relevant principles for "${query}":${contextNote}\n\n${results}`,
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
          collaboration: ['team', 'leadership', 'trust', 'harmony'],
          leadership: ['leadership', 'trust', 'team', 'service']
        };

        const keywords = topicKeywords[topic] || [];
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
        const principleText = CORE_PRINCIPLES.map(principle => 
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

      case 'get_philosophical_context': {
        const { aspect = 'origins' } = GetPhilosophicalContextSchema.parse(args);
        
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
  try {
    const transport = new StdioServerTransport();
    
    // Handle process termination gracefully
    process.on('SIGINT', () => {
      console.error('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
    
    await server.connect(transport);
    console.error('The Way of Code MCP Server running on stdio with enhanced capabilities');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 