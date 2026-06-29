import { NextResponse } from "next/server";

type ActionRecord = {
  id?: string;
  title?: string;
  content?: string;
  memory_type?: string;
  vault?: string;
  project_id?: string;
  tags?: string[];
  source?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  effective_date?: string;
  [key: string]: unknown;
};

const extractActions = (data: unknown): ActionRecord[] => {
  if (Array.isArray(data)) {
    return data as ActionRecord[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["results", "items", "memories", "data"]) {
    if (Array.isArray(record[key])) {
      return record[key] as ActionRecord[];
    }
  }

  return [];
};

const getActionTime = (action: ActionRecord) => {
  const value =
    action.updated_at ??
    action.created_at ??
    action.effective_date ??
    "";

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export async function GET() {
  try {
    const apiUrl = process.env.TBONE_API_URL;
    const apiKey = process.env.TBONE_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "T-Bone API configuration is missing." },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${apiUrl}/v1/memories?memory_type=task&limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = (await response.json()) as unknown;

    if (!response.ok) {
      const detail =
        data && typeof data === "object" && "detail" in data
          ? String((data as { detail?: unknown }).detail)
          : "Unable to retrieve actions.";

      return NextResponse.json(
        { error: detail },
        { status: response.status },
      );
    }

    const actions = extractActions(data)
    
      .filter((action) => action.status === "active")
      .sort((first, second) => getActionTime(second) - getActionTime(first))
      .slice(0, 10);

    return NextResponse.json({
      actions,
      count: actions.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve open actions." },
      { status: 500 },
    );
  }
}