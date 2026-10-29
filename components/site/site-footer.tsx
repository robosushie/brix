export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-stone">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-8 py-8 text-sm text-smoke">
        <p>Brix</p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            by{" "}
            <a href="mailto:iam@robosushie.com" className="text-ink no-underline">
              robosushie
            </a>
          </span>
          <a href="mailto:iam@robosushie.com" className="text-ink no-underline">
            iam@robosushie.com
          </a>
          <a
            href="https://github.com/robosushie/brix"
            className="text-ink no-underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
