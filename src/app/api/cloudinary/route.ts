import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ source: "not_configured", assets: [] });
  }

  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?max_results=100&prefix=exa-posts`,
      {
        headers: { Authorization: `Basic ${credentials}` },
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) throw new Error(`Cloudinary API ${res.status}`);
    const data = await res.json();

    // Group by folder
    const folders: Record<string, { name: string; assets: Array<{ publicId: string; url: string; format: string; width: number; height: number; bytes: number; createdAt: string }> }> = {};

    for (const r of data.resources || []) {
      const parts = r.public_id.split("/");
      const folderName = parts.slice(0, -1).join("/");
      const fileName = parts[parts.length - 1];

      if (!folders[folderName]) {
        folders[folderName] = {
          name: folderName.replace("exa-posts/", "").replace(/_/g, " "),
          assets: [],
        };
      }
      folders[folderName].assets.push({
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        createdAt: r.created_at,
      });
    }

    // Sort assets within each folder
    for (const folder of Object.values(folders)) {
      folder.assets.sort((a, b) => a.publicId.localeCompare(b.publicId));
    }

    return NextResponse.json({
      source: "cloudinary",
      folders: Object.values(folders),
      totalAssets: data.resources?.length || 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cloudinary error";
    return NextResponse.json({ source: "error", error: message, assets: [] }, { status: 500 });
  }
}
