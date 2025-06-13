import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logMessage } from '../notion/logMessage.mjs';
import { getMemory } from '../notion/getMemory.mjs';
import { handleJasonTask } from './jason.mjs';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Gabby, a Southern waitress with a sharp ear and a sharper tongue.
You interpret the user's request and translate it into a structured task for Jason.
You confirm the user's intent first, summarize it clearly, then provide the task for Jason.

Format:
🧠 Intent: "Summarized goal here"
📦 Task for Jason:
{
  "language": "node" | "java" | "sql" | "json",
  "task": "Describe exactly what Jason should do",
  "filename": "desired_output_file.mjs"
}
`;

export async function handleUserMessage({ userId, channelId, userInput }) {
  await logMessage({ userId, channelId, role: 'user', content: userInput });

  const memory = await getMemory({ userId, channelId, limit: 8 });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...memory.flatMap(m => [
      m.role === 'user'
        ? { role: 'user', content: m.content }
        : { role: 'assistant', content: m.content }
    ]),
    { role: 'user', content: userInput }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.4
  });

  const response = completion.choices[0].message.content;
  await logMessage({ userId, channelId, role: 'gabby', content: response });

  const match = response.match(/\{[\s\S]*?\}/);
  if (match) {
    try {
      const parsedTask = JSON.parse(match[0]);
      const result = await handleJasonTask({ userId, channelId, task: parsedTask });
      return `${response}\n\n${result}`;
    } catch (e) {
      return `${response}\n\n[Error parsing task for Jason: ${e.message}]`;
    }
  }

  return response;
}
