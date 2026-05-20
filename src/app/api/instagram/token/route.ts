import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Helper endpoint to exchange a short-lived token for a long-lived token.
 *
 * Usage:
 * POST /api/instagram/token
 * Body: { "shortLivedToken": "..." }
 *
 * This returns a long-lived token (valid ~60 days) that you should
 * save as INSTAGRAM_ACCESS_TOKEN in your .env
 */
export async function POST(req: NextRequest) {
  try {
    const { shortLivedToken } = await req.json();

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      return NextResponse.json(
        { error: "META_APP_ID and META_APP_SECRET must be configured" },
        { status: 500 }
      );
    }

    // Exchange for long-lived token
    const url = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    url.searchParams.set("grant_type", "fb_exchange_token");
    url.searchParams.set("client_id", appId);
    url.searchParams.set("client_secret", appSecret);
    url.searchParams.set("fb_exchange_token", shortLivedToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    // Now get the Instagram Business Account ID
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${data.access_token}`
    );
    const pagesData = await pagesRes.json();

    let igAccountId = null;
    if (pagesData.data?.[0]) {
      const pageId = pagesData.data[0].id;
      const igRes = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${data.access_token}`
      );
      const igData = await igRes.json();
      igAccountId = igData.instagram_business_account?.id;
    }

    return NextResponse.json({
      longLivedToken: data.access_token,
      expiresIn: data.expires_in,
      instagramBusinessAccountId: igAccountId,
      instructions: [
        "Add these to your .env file:",
        `INSTAGRAM_ACCESS_TOKEN="${data.access_token}"`,
        `INSTAGRAM_BUSINESS_ACCOUNT_ID="${igAccountId || "NOT_FOUND"}"`,
        "",
        "The token expires in ~60 days. You'll need to refresh it.",
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Token exchange failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
