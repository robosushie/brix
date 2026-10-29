export type DownloadPoint = {
  day: string;
  downloads: number;
};

function dayStamp(date: Date) {
  return date.toISOString().slice(0, 10);
}

function lifetimePeriod() {
  const end = new Date();
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 18, end.getUTCDate()));
  return `${dayStamp(start)}:${dayStamp(end)}`;
}

async function readCount(url: string) {
  try {
    const response = await fetch(url);
    const body = (await response.json()) as { error?: string; downloads?: number };
    if (!response.ok || body.error || typeof body.downloads !== "number") return 0;
    return body.downloads;
  } catch {
    return 0;
  }
}

export async function downloadReport(): Promise<{ total: number; points: DownloadPoint[] } | null> {
  "use cache";
  const total = await readCount(
    `https://api.npmjs.org/downloads/point/${lifetimePeriod()}/usebrix`,
  );
  if (total <= 10) return null;

  try {
    const response = await fetch("https://api.npmjs.org/downloads/range/last-week/usebrix");
    const body = (await response.json()) as {
      error?: string;
      downloads?: { day?: string; downloads?: number }[];
    };
    if (!response.ok || body.error || !Array.isArray(body.downloads) || body.downloads.length === 0) {
      return { total, points: [] };
    }
    return {
      total,
      points: body.downloads.map((row) => ({
        day: typeof row.day === "string" ? row.day : "",
        downloads: Number(row.downloads) || 0,
      })),
    };
  } catch {
    return { total, points: [] };
  }
}
