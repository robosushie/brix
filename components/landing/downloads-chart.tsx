"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DownloadPoint } from "@/lib/npm-downloads";

function emptyWeeks(): DownloadPoint[] {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  end.setUTCDate(end.getUTCDate() - 1);
  const sinceFriday = (end.getUTCDay() - 5 + 7) % 7;
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - sinceFriday);
  const points: DownloadPoint[] = [];
  for (let offset = 11; offset >= 0; offset -= 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() - offset * 7);
    points.push({ day: date.toISOString().slice(0, 10), downloads: 0 });
  }
  return points;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function weekBounds(day: string) {
  const start = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start, end };
}

function weekRange(day: string) {
  const bounds = weekBounds(day);
  if (!bounds) return day;
  const { start, end } = bounds;
  const startLabel = `${months[start.getUTCMonth()]} ${start.getUTCDate()}`;
  const endLabel =
    start.getUTCMonth() === end.getUTCMonth()
      ? String(end.getUTCDate())
      : `${months[end.getUTCMonth()]} ${end.getUTCDate()}`;
  return `${startLabel}–${endLabel}`;
}

function WeekTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  const downloads = Number(payload[0]?.value) || 0;
  return (
    <div className="rounded-[4px] border border-stone bg-eggshell px-3 py-2">
      <p className="text-xs text-smoke">{weekRange(String(label))}</p>
      <p className="mt-1 text-sm font-medium text-ink">{downloads.toLocaleString("en-US")}</p>
    </div>
  );
}

export function DownloadsChart({ points }: { points: DownloadPoint[] }) {
  const shown = points.length > 0 ? points : emptyWeeks();
  const peak = Math.max(0, ...shown.map((point) => point.downloads));

  return (
    <div className="mt-8 rounded-[20px] bg-taupe px-4 pt-6 pb-4 sm:px-8">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shown} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ebe8e4" vertical={false} />
          <XAxis dataKey="day" hide />
          <YAxis
            allowDecimals={false}
            domain={[0, peak === 0 ? 1 : "auto"]}
            padding={{ top: 8, bottom: 12 }}
            width={36}
            tick={{ fill: "#777169", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
            <Tooltip
              content={<WeekTooltip />}
              cursor={{ stroke: "#ebe8e4", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke="#000000"
              fill="#000000"
              fillOpacity={0.08}
              strokeWidth={2}
              activeDot={{ r: 4, fill: "#000000", stroke: "#fdfcfc", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="pt-4 text-center text-xs text-smoke">Last {shown.length} weeks</p>
    </div>
  );
}
