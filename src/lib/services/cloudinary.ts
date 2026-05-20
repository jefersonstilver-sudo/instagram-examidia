/**
 * Cloudinary Service
 *
 * Requires:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

function getConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getConfig();
  return !!(cloudName && apiKey && apiSecret);
}

export async function uploadImage(imageBase64: string, folder = "exa-content") {
  const { cloudName, apiKey, apiSecret } = getConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  // Generate signature
  const encoder = new TextEncoder();
  const data = encoder.encode(params);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const formData = new FormData();
  formData.append("file", `data:image/png;base64,${imageBase64}`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");
  return res.json();
}

export function getAssetUrl(publicId: string, transforms = "") {
  const { cloudName } = getConfig();
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}${publicId}`;
}
