//jason.mjs

import OpenAI from 'openai';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { logMessage } from '../notion/logMessage.mjs';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Jason, a silent killer of syntax errors and master of backend code.
Gabby sends you structured tasks. You respond with clean, testable code blocks.
You only speak in numbered output. You don't explain, comment, or ask questions.
Once your code passes 'node --check', it's returned to the user.
If there are errors, you must fix them automatically and try again.

Output format:
---
1. // function or module start
2. code...
3. more code...
---
Do not explain the code. Just output the code block.
`;

async function runSyntaxCheck(filename) {
  try {
    execSync(`node --check "${filename}"`, { stdio: 'pipe' });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.stderr.toString()
    };
  }
}

async function retryUntilValid(task, filename, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(task) }
      ],
      temperature: 0
    });

    const output = completion.choices[0].message.content;

    fs.writeFileSync(filename, extractCode(output).join('\n'));

    const check = await runSyntaxCheck(filename);
    if (check.success) {
      return { success: true, output };
    }

    task.fix = `Fix this error:\n${check.error}`;
  }

  return { success: false, error: `Max retries exceeded. Last error:\n${task.fix}` };
}

function extractCode(output) {
  return output
    .split('\n')
    .filter(line => /^\d+\.\s/.test(line))
    .map(line => line.replace(/^\d+\.\s/, ''));
}

export async function handleJasonTask({ userId, channelId, task }) {
  const filename = path.join('generated', task.filename || 'output.mjs');
  const result = await retryUntilValid(task, filename);

  const finalOutput = result.success ? result.output : `Error: ${result.error}`;
  await logMessage({
    userId,
    channelId,
    role: 'jason',
    content: finalOutput
  });

  return finalOutput;
}
