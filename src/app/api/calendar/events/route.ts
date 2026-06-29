import { cookies } from "next/headers";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Google OAuth configuration is missing." },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(
      "google_calendar_refresh_token",
    )?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "Google Calendar is not connected.",
          connectUrl: "/api/calendar/oauth/start",
        },
        { status: 401 },
      );
    }

    const redirectUri =
      "http://localhost:3000/api/calendar/oauth/callback";

    const oauthClient = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    oauthClient.setCredentials({
      refresh_token: refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauthClient,
    });

    const timeMin = new Date();
    const timeMax = new Date(
      timeMin.getTime() +7 * 24 * 60 * 60 * 1000,
    );

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
      timeZone: "America/New_York",
    });

    const events = (response.data.items ?? []).map((event) => ({
      id: event.id,
      title: event.summary ?? "Untitled event",
      description: event.description ?? "",
      location: event.location ?? "",
      start: event.start?.dateTime ?? event.start?.date ?? "",
      end: event.end?.dateTime ?? event.end?.date ?? "",
      allDay: Boolean(event.start?.date),
      status: event.status ?? "",
      htmlLink: event.htmlLink ?? "",
    }));

    return NextResponse.json({
      events,
      count: events.length,
      window: {
        start: timeMin.toISOString(),
        end: timeMax.toISOString(),
      },
    });
  } catch (error) {
    console.error("Google Calendar retrieval failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve Google Calendar events." },
      { status: 500 },
    );
  }
}