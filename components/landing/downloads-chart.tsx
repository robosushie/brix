"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DownloadPoint } from "@/lib/npm-downloads";

function emptyWeek(): DownloadPoint[] {
  const today = new Date();
  const points: DownloadPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset));
    points.push({ day: date.toISOString().slice(0, 10), downloads: 0 });
  }
  return points;
}

function dayLabel(day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function DownloadsChart({ points }: { points: DownloadPoint[] }) {
  const shown = points.length > 0 ? points : emptyWeek();
  const peak = Math.max(0, ...shown.map((point) => point.downloads));

  return (
    <div className="mt-8 h-72 rounded-[20px] bg-taupe px-4 py-6 sm:px-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={shown} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ebe8e4" vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={dayLabel}
            tick={{ fill: "#777169", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, peak === 0 ? 1 : "auto"]}
            width={36}
            tick={{ fill: "#777169", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value) || 0, "Downloads"]}
            labelFormatter={(label) => dayLabel(String(label))}
            contentStyle={{
              background: "#fdfcfc",
              border: "1px solid #ebe8e4",
              borderRadius: 4,
              color: "#000",
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="downloads" stroke="#000000" fill="#000000" fillOpacity={0.08} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
