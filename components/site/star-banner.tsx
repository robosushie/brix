import { Star } from "lucide-react";

export function StarBanner() {
  return (
    <p className="flex items-center justify-center gap-2 bg-ink px-8 py-2.5 text-center text-sm text-eggshell">
      <Star className="size-3.5 fill-eggshell" aria-hidden />
      <StarAsk />
    </p>
  );
}

export function StarToast() {
  return (
    <p
      role="status"
      className="fixed z-50 flex max-w-sm items-center justify-center gap-2 bg-ink text-center text-sm text-eggshell shadow-whisper"
      style={{ right: 16, bottom: 16, borderRadius: 12, padding: "16px 24px" }}
    >
      <Star className="size-3.5 shrink-0 fill-eggshell" aria-hidden />
      <StarAsk />
    </p>
  );
}

function StarAsk() {
  return (
    <span className="text-center">
      If you like the project, please{" "}
      <a href="https://github.com/robosushie/brix" className="underline underline-offset-2">
        give it a star
      </a>
      .
    </span>
  );
}
