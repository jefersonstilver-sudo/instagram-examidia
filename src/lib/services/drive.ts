/**
 * Google Drive Service
 *
 * Requires:
 * - GOOGLE_DRIVE_CLIENT_ID
 * - GOOGLE_DRIVE_CLIENT_SECRET
 * - GOOGLE_DRIVE_REFRESH_TOKEN
 *
 * Setup:
 * 1. Enable Google Drive API in Google Cloud Console
 * 2. Create OAuth 2.0 credentials
 * 3. Get refresh token via OAuth flow
 */

function getConfig() {
  return {
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  };
}

export function isDriveConfigured(): boolean {
  const { clientId, clientSecret, refreshToken } = getConfig();
  return !!(clientId && clientSecret && refreshToken);
}

async function getAccessToken() {
  const { clientId, clientSecret, refreshToken } = getConfig();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Drive not configured");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function uploadFile(
  fileName: string,
  content: Buffer | string,
  mimeType: string,
  folderId?: string
) {
  const accessToken = await getAccessToken();

  const metadata: Record<string, unknown> = { name: fileName, mimeType };
  if (folderId) metadata.parents = [folderId];

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(metadata),
    }
  );

  return res.json();
}

export async function createFolder(name: string, parentId?: string) {
  const accessToken = await getAccessToken();

  const metadata: Record<string, unknown> = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };
  if (parentId) metadata.parents = [parentId];

  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  return res.json();
}
