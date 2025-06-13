//notionClient.mjs

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_SECRET });
export const databaseId = process.env.NOTION_DB_ID;
