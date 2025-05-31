#!/usr/bin/env node

/**
 * Daily Wisdom from The Way of Code
 * 
 * Usage:
 *   node daily-wisdom.js
 *   node daily-wisdom.js --date 2024-01-15
 *   node daily-wisdom.js --format slack
 *   node daily-wisdom.js --webhook https://hooks.slack.com/...
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple chapter data - in a real implementation, this would import from the MCP server data
const chapters = [
  {
    number: 1,
    text: "The code that can be named is not the eternal code. The function that can be defined is not the limitless function.",
    application: "Begin each coding session with openness to unexpected solutions."
  },
  // Add more chapters here or import from the MCP server data
];

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getDailyChapter(date = new Date()) {
  const dayOfYear = getDayOfYear(date);
  const chapterIndex = (dayOfYear - 1) % 81; // Cycle through all 81 chapters
  return chapterIndex + 1;
}

function formatWisdom(chapterNum, format = 'plain') {
  // In a real implementation, this would fetch from the complete chapter data
  const wisdom = {
    chapter: chapterNum,
    text: `Chapter ${chapterNum} wisdom would go here`,
    application: "Practical coding application would go here"
  };

  switch (format) {
    case 'slack':
      return {
        text: `🌊 Daily Wisdom from The Way of Code`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Chapter ${wisdom.chapter}*\n\n_${wisdom.text}_`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `💡 *Today's Coding Practice:*\n${wisdom.application}`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "From <https://github.com/mgd1984/the-way-of-code|The Way of Code> • Vibe coding for AI-driven development"
              }
            ]
          }
        ]
      };

    case 'discord':
      return {
        embeds: [
          {
            title: "🌊 Daily Wisdom from The Way of Code",
            description: `**Chapter ${wisdom.chapter}**\n\n*${wisdom.text}*`,
            fields: [
              {
                name: "💡 Today's Coding Practice",
                value: wisdom.application,
                inline: false
              }
            ],
            color: 0x4A90E2,
            footer: {
              text: "The Way of Code • Vibe coding for AI-driven development"
            }
          }
        ]
      };

    case 'markdown':
      return `# 🌊 Daily Wisdom from The Way of Code

## Chapter ${wisdom.chapter}

> *${wisdom.text}*

### 💡 Today's Coding Practice
${wisdom.application}

---
*From [The Way of Code](https://github.com/mgd1984/the-way-of-code) • Vibe coding for AI-driven development*`;

    default:
      return `🌊 Daily Wisdom from The Way of Code

Chapter ${wisdom.chapter}:
"${wisdom.text}"

Today's Coding Practice:
${wisdom.application}

From The Way of Code: https://github.com/mgd1984/the-way-of-code`;
  }
}

async function sendWebhook(url, payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Daily wisdom sent successfully!');
    } else {
      console.error('❌ Failed to send webhook:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending webhook:', error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  let date = new Date();
  let format = 'plain';
  let webhook = null;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--date':
        date = new Date(args[++i]);
        break;
      case '--format':
        format = args[++i];
        break;
      case '--webhook':
        webhook = args[++i];
        break;
      case '--help':
        console.log(`
Daily Wisdom from The Way of Code

Usage:
  node daily-wisdom.js [options]

Options:
  --date YYYY-MM-DD    Get wisdom for specific date
  --format FORMAT      Output format: plain, slack, discord, markdown
  --webhook URL        Send to webhook URL (Slack/Discord)
  --help              Show this help

Examples:
  node daily-wisdom.js
  node daily-wisdom.js --date 2024-01-15
  node daily-wisdom.js --format slack
  node daily-wisdom.js --format slack --webhook https://hooks.slack.com/...
        `);
        return;
    }
  }

  const chapterNum = getDailyChapter(date);
  const wisdom = formatWisdom(chapterNum, format);

  if (webhook) {
    sendWebhook(webhook, wisdom);
  } else {
    if (typeof wisdom === 'object') {
      console.log(JSON.stringify(wisdom, null, 2));
    } else {
      console.log(wisdom);
    }
  }
}

main(); 