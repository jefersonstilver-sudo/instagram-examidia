/**
 * Notion Service
 *
 * Requires:
 * - NOTION_API_KEY: Internal integration token
 * - NOTION_DATABASE_ID: Content database ID
 *
 * Setup:
 * 1. Go to https://www.notion.so/my-integrations
 * 2. Create new integration
 * 3. Share your database with the integration
 */

const NOTION_API = "https://api.notion.com/v1";

function getConfig() {
  return {
    apiKey: process.env.NOTION_API_KEY,
    databaseId: process.env.NOTION_DATABASE_ID,
  };
}

export function isNotionConfigured(): boolean {
  const { apiKey, databaseId } = getConfig();
  return !!(apiKey && databaseId);
}

async function notionFetch(endpoint: string, options: RequestInit = {}) {
  const { apiKey } = getConfig();
  if (!apiKey) throw new Error("NOTION_API_KEY not configured");

  const res = await fetch(`${NOTION_API}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Notion API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

export async function queryDatabase(filter?: object) {
  const { databaseId } = getConfig();
  return notionFetch(`/databases/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify({ filter }),
  });
}

export async function createPage(properties: object) {
  const { databaseId } = getConfig();
  return notionFetch("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });
}

export async function pushApprovedContent(content: {
  title: string;
  format: string;
  audience: string;
  status: string;
  script?: string;
  scheduledAt?: string;
}) {
  return createPage({
    "Titulo": { title: [{ text: { content: content.title } }] },
    "Formato": { select: { name: content.format } },
    "Publico": { select: { name: content.audience } },
    "Status": { select: { name: content.status } },
    ...(content.scheduledAt && {
      "Data Agendada": { date: { start: content.scheduledAt } },
    }),
  });
}
