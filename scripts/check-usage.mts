// Twelve Friday–Thursday weeks, same buckets as the landing plot: lib/npm-downloads.ts loadWeeklyPoints().
// Per version, last 7 available days, then summed by minor series: https://api.npmjs.org/versions/usebrix/last-week
// Published versions: https://registry.npmjs.org/usebrix versions field. 0.1.0 and 0.1.7 both count as 0.1.x.
// Package total, last 18 months: https://api.npmjs.org/downloads/point/{start}:{end}/usebrix via lifetimePeriod().

import { lifetimePeriod, loadWeeklyPoints, type DownloadPoint } from "../lib/npm-downloads.ts";

function weekEnd(start: string) {
  const date = new Date(`${start}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 6);
  return date.toISOString().slice(0, 10);
}

function currentWeekStart() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const sinceFriday = (today.getUTCDay() - 5 + 7) % 7;
  today.setUTCDate(today.getUTCDate() - sinceFriday);
  return today.toISOString().slice(0, 10);
}

function withCurrentWeek(points: DownloadPoint[]) {
  const start = currentWeekStart();
  if (points.some((point) => point.day === start)) return points;
  return [...points, { day: start, downloads: 0 }].slice(-12);
}

function seriesOf(version: string) {
  const match = /^(\d+)\.(\d+)\./.exec(version);
  return match ? `${match[1]}.${match[2]}.x` : null;
}

function printRows(rows: { label: string; value: string }[]) {
  const width = Math.max(...rows.map((row) => row.label.length + row.value.length + 2), 0);
  for (const row of rows) {
    const gap = width - row.label.length - row.value.length;
    console.log(`${row.label}${" ".repeat(gap)}${row.value}`);
  }
}

function versionRows(versions: string[], downloads: Record<string, number>) {
  const totals = new Map<string, number>();
  for (const version of versions) {
    const series = seriesOf(version);
    if (!series) continue;
    totals.set(series, (totals.get(series) ?? 0) + (Number(downloads[version]) || 0));
  }
  return [...totals.entries()]
    .sort(([left], [right]) => {
      const [leftMajor, leftMinor] = left.split(".").map(Number);
      const [rightMajor, rightMinor] = right.split(".").map(Number);
      return leftMajor - rightMajor || leftMinor - rightMinor;
    })
    .map(([label, count]) => ({ label, value: String(count) }));
}

async function usageCheck() {
  const [points, versionResponse, registryResponse, lifetimeResponse] = await Promise.all([
    loadWeeklyPoints(),
    fetch("https://api.npmjs.org/versions/usebrix/last-week"),// gives last week downloads
    fetch("https://registry.npmjs.org/usebrix"),
    fetch(`https://api.npmjs.org/downloads/point/${lifetimePeriod()}/usebrix`),
  ]);

  const versionsBody = (await versionResponse.json()) as { downloads?: Record<string, number> };
  const registry = (await registryResponse.json()) as { name?: string; versions?: Record<string, unknown> };
  const lifetime = (await lifetimeResponse.json()) as { start?: string; end?: string; downloads?: number };
  const downloads = versionsBody.downloads ?? {};
  console.log(downloads);//
  const published = Object.keys(registry.versions ?? {});

  const weeks = withCurrentWeek(points).map((point) => ({
    label: `${point.day} - ${weekEnd(point.day)}`,
    value: String(point.downloads),
  }));

  console.log(registry.name ?? "usebrix");
  console.log();
  console.log("Weekly downloads (last 12 weeks)");
  console.log();
  printRows(weeks);
  console.log();
  console.log("Version downloads (Last Week)");
  console.log();
  printRows(versionRows(published, downloads));
  console.log();
  console.log(`Total downloads (All versions)\t${lifetime.downloads}`);
}

usageCheck().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
