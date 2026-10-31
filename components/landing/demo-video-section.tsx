const VIDEO_ID = "ARW5s2vQQP4";

// YouTube no longer honors showinfo=0, so the title and channel stay in the player.
// The frame is shifted up and clipped so that bar (name, avatar, title) falls outside the card.
// Playback controls stay on the bottom edge. rel=0 limits the end screen to this channel.
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&playsinline=1`;

export function DemoVideoSection() {
  return (
    <section className="mx-auto mt-24 max-w-[1280px] px-8">
      <h2 className="display text-[36px] text-ink">See it in action</h2>
      <p className="mt-4 max-w-xl text-base leading-normal text-smoke">
        Pick a stack, copy the command, and review the skills it installs.
      </p>
      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-[20px] bg-taupe">
        <iframe
          className="absolute left-0 w-full [top:max(-64px,-10%)] [height:calc(100%+max(64px,10%))]"
          src={EMBED_SRC}
          title="Brix demo: pick a stack, copy one command, review the skills"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
