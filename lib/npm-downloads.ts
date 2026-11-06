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

const CHART_WEEKS = 12;
const FRIDAY = 5;

// Enough days to cover twelve Friday–Thursday weeks, the buckets on the npm package page.
function chartPeriod() {
  const end = new Date();
  const endUtc = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  const start = new Date(endUtc);
  start.setUTCDate(endUtc.getUTCDate() - (CHART_WEEKS + 1) * 7);
  return `${dayStamp(start)}:${dayStamp(endUtc)}`;
}

function weekStart(day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  const sinceFriday = (date.getUTCDay() - FRIDAY + 7) % 7;
  date.setUTCDate(date.getUTCDate() - sinceFriday);
  return date.toISOString().slice(0, 10);
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

// npm's package page sums each Friday–Thursday week. The latest of those weeks is the Weekly Downloads number.
export function weeklyPoints(days: DownloadPoint[]): DownloadPoint[] {
  const totals = new Map<string, number>();
  for (const point of days) {
    const start = weekStart(point.day);
    if (!start) continue;
    totals.set(start, (totals.get(start) ?? 0) + point.downloads);
  }
  const weeks = [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([day, downloads]) => ({ day, downloads }));
  let last = weeks.length - 1;
  while (last > 0 && weeks[last].downloads === 0) last -= 1;
  return weeks.slice(0, last + 1).slice(-CHART_WEEKS);
}

export async function loadWeeklyPoints(): Promise<DownloadPoint[]> {
  return weeklyPoints(await readRange(chartPeriod()));
}

async function readRange(period: string): Promise<DownloadPoint[]> {
  const response = await fetch(`https://api.npmjs.org/downloads/range/${period}/usebrix`);
  const body = (await response.json()) as {
    error?: string;
    downloads?: { day?: string; downloads?: number }[];
  };
  if (!response.ok || body.error || !Array.isArray(body.downloads)) return [];
  return body.downloads.map((row) => ({
    day: typeof row.day === "string" ? row.day : "",
    downloads: Number(row.downloads) || 0,
  }));
}

export async function downloadReport(): Promise<{
  total: number;
  week: number;
  points: DownloadPoint[];
} | null> {
  "use cache";
  const total = await readCount(
    `https://api.npmjs.org/downloads/point/${lifetimePeriod()}/usebrix`,
  );
  if (total <= 10) return null;

  try {
    const points = weeklyPoints(await readRange(chartPeriod()));
    return { total, week: points.at(-1)?.downloads ?? 0, points };
  } catch {
    return { total, week: 0, points: [] };
  }
}


export {lifetimePeriod};