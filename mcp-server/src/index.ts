#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { wayOfCodeData } from './data/way-of-code.js';

// Tool schemas - Updated to match MCP SDK format
const GetChapterSchema = z.object({
  type: z.literal('object'),
  properties: z.object({
    chapter: z.object({
      type: z.literal('number'),
      description: z.literal('Chapter number (1-81)'),
      minimum: z.literal(1),
      maximum: z.literal(81)
    })
  }),
  required: z.array(z.literal('chapter'))
});

const SearchPrinciplesSchema = z.object({
  type: z.literal('object'),
  properties: z.object({
    query: z.object({
      type: z.literal('string'),
      description: z.literal('Search query for finding relevant principles')
    }),
    context: z.object({
      type: z.literal('string'),
      description: z.literal('Optional context about the coding situation')
    }).optional()
  }),
  required: z.array(z.literal('query'))
});

const GetDailyWisdomSchema = z.object({
  type: z.literal('object'),
  properties: z.object({
    date: z.object({
      type: z.literal('string'),
      description: z.literal('Date in YYYY-MM-DD format (optional, defaults to today)')
    }).optional()
  })
});

const GetPrinciplesByTopicSchema = z.object({
  type: z.literal('object'),
  properties: z.object({
    topic: z.object({
      type: z.literal('string'),
      enum: z.array(z.enum(['simplicity', 'complexity', 'flow', 'force', 'humility', 'ego', 'balance', 'extremes', 'presence', 'rushing', 'debugging', 'refactoring', 'architecture', 'collaboration', 'leadership'])),
      description: z.literal('Topic to find principles for')
    })
  }),
  required: z.array(z.literal('topic'))
});

const GetCorePrinciplesSchema = z.object({
  type: z.literal('object'),
  properties: z.object({})
});

// Create server
const server = new Server(
  {
    name: 'the-way-of-code',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_chapter',
        description: 'Get a specific chapter from The Way of Code',
        inputSchema: GetChapterSchema,
      },
      {
        name: 'search_principles',
        description: 'Search for principles relevant to a coding situation',
        inputSchema: SearchPrinciplesSchema,
      },
      {
        name: 'get_daily_wisdom',
        description: 'Get daily wisdom based on the current date',
        inputSchema: GetDailyWisdomSchema,
      },
      {
        name: 'get_principles_by_topic',
        description: 'Get principles related to a specific coding topic',
        inputSchema: GetPrinciplesByTopicSchema,
      },
      {
        name: 'get_core_principles',
        description: 'Get the five core principles of The Way of Code',
        inputSchema: GetCorePrinciplesSchema,
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_chapter': {
        const { chapter } = args as { chapter: number };
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
        const { query, context } = args as { query: string; context?: string };
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
        const { date } = args as { date?: string };
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
        const { topic } = args as { topic: string };
        
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
  console.error('The Way of Code MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 