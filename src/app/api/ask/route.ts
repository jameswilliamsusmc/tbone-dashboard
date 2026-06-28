import { NextResponse } from "next/server";

type AskRequest = {
  query?: string;
};

type MemorySearchResult = {
  id?: string;
  title?: string;
  content?: string;
  memory_type?: string;
  vault?: string;
  project_id?: string;
  tags?: string[];
  source?: string;
  sensitivity?: string;
  confidence?: number;
  importance?: number;
  effective_date?: string;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

const GENERIC_QUERY_TERMS = new Set([
  "current",
  "decision",
  "decisions",
  "latest",
  "status",
  "update",
  "updates",
  "information",
  "details",
  "tell",
  "show",
]);

const normalizeText = (value: unknown) =>
  typeof value === "string"
    ? value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
    : "";

const tokenize = (value: string) =>
  normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const countOccurrences = (text: string, term: string) => {
  if (!term) {
    return 0;
  }

  return text.split(term).length - 1;
};

const extractResults = (data: unknown): MemorySearchResult[] => {
  if (Array.isArray(data)) {
    return data as MemorySearchResult[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["results", "items", "memories", "data"]) {
    if (Array.isArray(record[key])) {
      return record[key] as MemorySearchResult[];
    }
  }

  return [];
};

const getWordSet = (value: string) =>
  new Set(
    tokenize(value).filter(
      (token) =>
        token.length > 2 &&
        !GENERIC_QUERY_TERMS.has(token),
    ),
  );

const calculateSimilarity = (first: string, second: string) => {
  const firstWords = getWordSet(first);
  const secondWords = getWordSet(second);

  if (firstWords.size === 0 || secondWords.size === 0) {
    return 0;
  }

  const sharedWords = [...firstWords].filter((word) =>
    secondWords.has(word),
  ).length;

  return sharedWords / Math.min(firstWords.size, secondWords.size);
};

const buildAnswer = (
  query: string,
  results: MemorySearchResult[],
) => {
  if (results.length === 0) {
    return "I could not find a sufficiently relevant memory for that question.";
  }

  const primary = results[0];
  const primaryText =
    typeof primary.content === "string" ? primary.content.trim() : "";

  if (!primaryText) {
    return `I found a relevant memory titled "${primary.title ?? "Untitled memory"}," but it does not contain a written summary yet.`;
  }

  const secondary = results[1];
  const secondaryText =
    typeof secondary?.content === "string" ? secondary.content.trim() : "";

  const isDistinctSupportingContext =
    secondaryText &&
    secondaryText !== primaryText &&
    secondaryText.length <= 280 &&
    calculateSimilarity(primaryText, secondaryText) < 0.45;

  if (isDistinctSupportingContext) {
    return `${primaryText}\n\nSupporting context: ${secondaryText}`;
  }

  return primaryText;
};

const scoreMemory = (memory: MemorySearchResult, query: string) => {
  const normalizedQuery = normalizeText(query);
  const queryTokens = [...new Set(tokenize(query))];

  const title = normalizeText(memory.title);
  const content = normalizeText(memory.content);
  const tags = normalizeText(
    Array.isArray(memory.tags) ? memory.tags.join(" ") : "",
  );
  const memoryType = normalizeText(memory.memory_type);
  const vault = normalizeText(memory.vault);
  const source = normalizeText(memory.source);

  const combined = [title, content, tags, memoryType, vault, source]
    .filter(Boolean)
    .join(" ");

  let score = 0;

  if (normalizedQuery && title.includes(normalizedQuery)) {
    score += 120;
  }

  if (normalizedQuery && content.includes(normalizedQuery)) {
    score += 80;
  }

  for (const token of queryTokens) {
    score += countOccurrences(title, token) * 18;
    score += countOccurrences(tags, token) * 12;
    score += countOccurrences(content, token) * 5;
    score += countOccurrences(memoryType, token) * 4;
    score += countOccurrences(vault, token) * 3;
    score += countOccurrences(source, token) * 2;
  }

  const matchedTokens = queryTokens.filter((token) =>
    combined.includes(token),
  ).length;

  if (queryTokens.length > 0) {
    const coverage = matchedTokens / queryTokens.length;
    score += coverage * 60;

    if (coverage === 1) {
      score += 40;
    }
  }

  const importantPhrases = [
    "hosting decision",
    "prototype host",
    "long term",
    "railway",
    "azure",
    "t bone",
  ];

  for (const phrase of importantPhrases) {
    if (normalizedQuery.includes(phrase) && combined.includes(phrase)) {
      score += 35;
    }
  }

  if (typeof memory.importance === "number") {
    score += Math.min(memory.importance, 10);
  }

  if (typeof memory.confidence === "number") {
    score += Math.min(memory.confidence, 1) * 5;
  }

  return score;
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
        limit: 50,
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as unknown;

    if (!response.ok) {
      const detail =
        data && typeof data === "object" && "detail" in data
          ? String((data as { detail?: unknown }).detail)
          : "The T-Bone API request failed.";

      return NextResponse.json(
        { error: detail },
        { status: response.status },
      );
    }

    const candidates = extractResults(data);

    const subjectTokens = [...new Set(tokenize(query))].filter(
      (token) => !GENERIC_QUERY_TERMS.has(token),
    );

    const scoredCandidates = candidates
      .map((memory) => {
        const searchableText = normalizeText(
          [
            memory.title,
            memory.content,
            Array.isArray(memory.tags) ? memory.tags.join(" ") : "",
            memory.source,
            memory.vault,
          ]
            .filter(Boolean)
            .join(" "),
        );

        const hasSubjectMatch =
          subjectTokens.length === 0 ||
          subjectTokens.some((token) => searchableText.includes(token));

        return {
          memory,
          score: scoreMemory(memory, query),
          hasSubjectMatch,
        };
      })
      .sort((a, b) => b.score - a.score);

    const topScore =
      scoredCandidates.find(({ hasSubjectMatch }) => hasSubjectMatch)?.score ??
      0;
    const minimumScore = Math.max(35, topScore * 0.25);

    const rankedResults = scoredCandidates
      .filter(
        ({ score, hasSubjectMatch }) =>
          hasSubjectMatch && score >= minimumScore,
      )
      .slice(0, 10)
      .map(({ memory }) => memory);

    const answer = buildAnswer(query, rankedResults);

    return NextResponse.json({
      query,
      answer,
      results: rankedResults,
      candidateCount: candidates.length,
      minimumScore,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process the request." },
      { status: 500 },
    );
  }
}
