import { DownloadsChartLoader } from "@/components/landing/downloads-chart-loader";
import { downloadReport } from "@/lib/npm-downloads";

export async function DownloadsSection() {
  const report = await downloadReport();
  if (!report) return null;
  const { points, week } = report;

  return (
    <section className="mx-auto mt-24 max-w-[1280px] px-8">
      <h2 className="display text-[36px] text-ink">Weekly downloads</h2>
      <p className="mt-4 max-w-xl text-base leading-normal text-smoke">
        {week.toLocaleString("en-US")} downloads of usebrix on npm in the latest week. Each point is one week of the last 12 weeks.
      </p>
      <DownloadsChartLoader points={points} />
    </section>
  );
}
