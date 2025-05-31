#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
  CallToolRequest,
  Resource,
  ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { wayOfCodeData } from './data/way-of-code.js';

// Core principles
const CORE_PRINCIPLES = [
  "Simplicity over complexity",
  "Flow over force", 
  "Humility over ego",
  "Balance over extremes",
  "Presence over rushing"
];

// Validation schemas
const GetChapterSchema = z.object({
  chapter: z.number().min(1).max(81),
});

const SearchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(10).optional().default(5),
});

// Server
const server = new Server(
  { name: 'the-way-of-code', version: '1.2.0' },
  { capabilities: { tools: {}, resources: {} } }
);

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_chapter',
      description: 'Get a specific chapter (1-81)',
      inputSchema: {
        type: 'object',
        properties: {
          chapter: {
            type: 'number',
            minimum: 1,
            maximum: 81,
            description: 'Chapter number (1-81)'
          }
        },
        required: ['chapter']
      }
    },
    {
      name: 'search_principles',
      description: 'Search for relevant principles',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for relevant principles'
          },
          limit: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            default: 5,
            description: 'Maximum number of results to return'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_core_principles',
      description: 'Get the five core principles',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

    switch (name) {
      case 'get_chapter': {
        const { chapter } = GetChapterSchema.parse(args);
        const chapterData = wayOfCodeData.chapters.find(c => c.number === chapter);
        
        if (!chapterData) {
        throw new Error(`Chapter ${chapter} not found`);
        }

        return {
          content: [{
              type: 'text',
            text: `# Chapter ${chapterData.number}\n\n${chapterData.text}`
          }]
        };
      }

      case 'search_principles': {
      const { query, limit } = SearchSchema.parse(args);
      
      const results = wayOfCodeData.chapters
        .filter(chapter => 
          chapter.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit)
        .map(chapter => `**Chapter ${chapter.number}**\n${chapter.text.slice(0, 200)}...`);

        return {
        content: [{
              type: 'text',
          text: results.length > 0 
            ? `Found ${results.length} relevant principles:\n\n${results.join('\n\n')}`
            : 'No relevant principles found. Try a different search term.'
        }]
        };
      }

      case 'get_core_principles': {
        return {
        content: [{
              type: 'text',
          text: `# The Five Core Principles\n\n${CORE_PRINCIPLES.map((p, i) => `${i + 1}. **${p}**`).join('\n')}\n\nThese principles guide all coding decisions and practices.`
        }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
});

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'way://chapters/all',
      name: 'All Chapters',
      description: 'Complete collection of all 81 chapters',
      mimeType: 'application/json'
    }
  ]
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const { uri } = request.params;

  if (uri === 'way://chapters/all') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(wayOfCodeData.chapters, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error); 