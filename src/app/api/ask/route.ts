import { NextResponse } from "next/server";

type AskRequest = {
  query?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AskRequest;
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "A question is required." },
        { status: 400 },
      );
    }

    const apiUrl = process.env.TBONE_API_URL;
    const apiKey = process.env.TBONE_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "T-Bone API configuration is missing." },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiUrl}/v1/memories/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        include_sensitive: false,
        limit: 10,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.detail ?? "The T-Bone API request failed.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      query,
      results: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process the request." },
      { status: 500 },
    );
  }
}