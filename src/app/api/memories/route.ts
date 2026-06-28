import { NextResponse } from "next/server";

type MemoryRecord = {
  id?: string;
  title?: string;
  content?: string;
  memory_type?: string;
  vault?: string;
  project_id?: string;
  tags?: string[];
  source?: string;
  created_at?: string;
  updated_at?: string;
  effective_date?: string;
  [key: string]: unknown;
};

const extractMemories = (data: unknown): MemoryRecord[] => {
  if (Array.isArray(data)) {
    return data as MemoryRecord[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["results", "items", "memories", "data"]) {
    if (Array.isArray(record[key])) {
      return record[key] as MemoryRecord[];
    }
  }

  return [];
};

const getMemoryTime = (memory: MemoryRecord) => {
  const value =
    memory.updated_at ??
    memory.created_at ??
    memory.effective_date ??
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

    const response = await fetch(`${apiUrl}/v1/memories?limit=50`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = (await response.json()) as unknown;

    if (!response.ok) {
      const detail =
        data && typeof data === "object" && "detail" in data
          ? String((data as { detail?: unknown }).detail)
          : "Unable to retrieve memories.";

      return NextResponse.json(
        { error: detail },
        { status: response.status },
      );
    }

    const memories = extractMemories(data)
      .sort((first, second) => getMemoryTime(second) - getMemoryTime(first))
      .slice(0, 8);

    return NextResponse.json({
      memories,
      count: memories.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve recent memories." },
      { status: 500 },
    );
  }
}