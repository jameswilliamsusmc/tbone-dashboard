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

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const returnedState = requestUrl.searchParams.get("state");
  const storedState = requestUrl.searchParams.get("state")
    ? request.headers
        .get("cookie")
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("google_oauth_state="))
        ?.split("=")[1]
    : undefined;

  if (!code) {
    return NextResponse.json(
      { error: "Google did not return an authorization code." },
      { status: 400 },
    );
  }

  if (!returnedState || !storedState || returnedState !== storedState) {
    return NextResponse.json(
      { error: "Google OAuth state validation failed." },
      { status: 400 },
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

  const { tokens } = await oauthClient.getToken(code);

  const response = NextResponse.redirect(
    new URL("/?calendar=connected", request.url),
  );

  response.cookies.set("google_oauth_state", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  if (tokens.refresh_token) {
    response.cookies.set("google_calendar_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}