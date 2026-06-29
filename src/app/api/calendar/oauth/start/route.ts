import { randomBytes } from "crypto";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth configuration is missing." },
      { status: 500 },
    );
  }

  const redirectUri = new URL(
    "/api/calendar/oauth/callback",
    request.url,
  ).toString();

  const oauthClient = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  const state = randomBytes(32).toString("hex");

  const authorizationUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}