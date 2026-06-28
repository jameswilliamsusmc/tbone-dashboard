import { NextResponse } from "next/server";

type ProjectRecord = {
  id?: string;
  name?: string;
  description?: string;
  vault?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

const extractProjects = (data: unknown): ProjectRecord[] => {
  if (Array.isArray(data)) {
    return data as ProjectRecord[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["results", "items", "projects", "data"]) {
    if (Array.isArray(record[key])) {
      return record[key] as ProjectRecord[];
    }
  }

  return [];
};

const getProjectTime = (project: ProjectRecord) => {
  const value = project.updated_at ?? project.created_at ?? "";
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

    const response = await fetch(`${apiUrl}/v1/projects?status=active`, {
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
          : "Unable to retrieve projects.";

      return NextResponse.json(
        { error: detail },
        { status: response.status },
      );
    }

    const projects = extractProjects(data).sort(
      (first, second) => getProjectTime(second) - getProjectTime(first),
    );

    return NextResponse.json({
      projects,
      count: projects.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve active projects." },
      { status: 500 },
    );
  }
}