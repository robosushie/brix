"use client";

import dynamic from "next/dynamic";
import type { DownloadPoint } from "@/lib/npm-downloads";

const DownloadsChart = dynamic(
  () => import("@/components/landing/downloads-chart").then((mod) => mod.DownloadsChart),
  { ssr: false },
);

export function DownloadsChartLoader({ points }: { points: DownloadPoint[] }) {
  return <DownloadsChart points={points} />;
}
