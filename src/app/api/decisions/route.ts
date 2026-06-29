import { NextResponse } from "next/server";

type DecisionRecord = {
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
  importance?: number;
  [key: string]: unknown;
};

const extractDecisions = (data: unknown): DecisionRecord[] => {
  if (Array.isArray(data)) {
    return data as DecisionRecord[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["results", "items", "memories", "data"]) {
    if (Array.isArray(record[key])) {
      return record[key] as DecisionRecord[];
    }
  }

  return [];
};

const getDecisionTime = (decision: DecisionRecord) => {
  const value =
    decision.updated_at ??
    decision.created_at ??
    decision.effective_date ??
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
      `${apiUrl}/v1/memories?memory_type=decision&limit=50`,
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
          : "Unable to retrieve decisions.";

      return NextResponse.json(
        { error: detail },
        { status: response.status },
      );
    }

    const decisions = extractDecisions(data)
      .filter((decision) => decision.status === "active")
      .sort((first, second) => {
        const importanceDifference =
          (second.importance ?? 0) - (first.importance ?? 0);

        if (importanceDifference !== 0) {
          return importanceDifference;
        }

        return getDecisionTime(second) - getDecisionTime(first);
      })
      .slice(0, 10);

    return NextResponse.json({
      decisions,
      count: decisions.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve active decisions." },
      { status: 500 },
    );
  }
}