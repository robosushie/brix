"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { registry, type AgentId, type SkillRef } from "@brix/core";
import {
  commandPreview,
  skillFilePaths,
  skillSources,
  visitorPlatform,
  type SkillPlatform,
} from "@/lib/skill-preview";

type SkillsModalProps = {
  skills: SkillRef[];
  agents: AgentId[];
  onClose: () => void;
};

export function SkillsModal({ skills, agents, onClose }: SkillsModalProps) {
  const titleId = useId();
  const platform = visitorPlatform();
  const names = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of registry.skills) map.set(entry.id, entry.name ?? entry.id);
    return map;
  }, []);
  const [selectedId, setSelectedId] = useState(skills[0]?.id ?? "");
  const [bodies, setBodies] = useState<Record<string, string> | null>(null);
  const [bodiesError, setBodiesError] = useState("");
  const [copied, setCopied] = useState(false);

  const selected = skills.find((skill) => skill.id === selectedId) ?? skills[0];

  useEffect(() => {
    if (skills.some((skill) => skill.id === selectedId)) return;
    setSelectedId(skills[0]?.id ?? "");
  }, [skills, selectedId]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/skill-bodies")
      .then(async (response) => {
        const payload = (await response.json()) as Record<string, string> & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Could not load skill text.");
        return payload;
      })
      .then((payload) => {
        if (!cancelled) setBodies(payload);
      })
      .catch((error: unknown) => {
        if (!cancelled) setBodiesError(error instanceof Error ? error.message : "Could not load skill text.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [selected?.id]);

  const preview = selected ? previewFor(selected, agents, platform, bodies, bodiesError) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-[640px] max-h-[calc(100vh-2rem)] w-[960px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[20px] bg-eggshell shadow-whisper"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone px-5 py-4">
          <h2 id={titleId} className="text-lg font-medium text-ink">
            Skills
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-taupe"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1">
          <ul className="w-60 shrink-0 overflow-y-auto border-r border-stone">
            {skills.map((skill) => {
              const active = skill.id === selected?.id;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    className={`w-full cursor-pointer px-4 py-3 text-left text-sm break-words ${
                      active ? "bg-ink text-eggshell" : "text-ink hover:bg-taupe"
                    }`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setSelectedId(skill.id)}
                  >
                    {names.get(skill.id) ?? skill.id}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-4">
            {preview?.sources.length ? (
              <ul className="space-y-1 text-sm">
                {preview.sources.map((source) => (
                  <li key={source.label} className="break-words">
                    {source.href ? (
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink underline underline-offset-2"
                      >
                        {source.label}
                      </a>
                    ) : (
                      <span className="text-ink">{source.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {preview ? (
              <EditorFrame
                title={preview.title}
                body={preview.body}
                copied={copied}
                onCopy={async () => {
                  await navigator.clipboard.writeText(preview.body);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function previewFor(
  skill: SkillRef,
  agents: AgentId[],
  platform: SkillPlatform,
  bodies: Record<string, string> | null,
  bodiesError: string,
) {
  if (skill.kind === "local") {
    const paths = skillFilePaths(skill.id, agents);
    const body = bodiesError
      ? bodiesError
      : bodies
        ? (bodies[skill.id] ?? `No composed skill for ${skill.id}.`)
        : "Loading skill text…";
    return { title: paths.join("\n"), body, sources: [] as ReturnType<typeof skillSources> };
  }
  const sources = skillSources(skill, platform);
  const commands = commandPreview(skill, agents, platform);
  return {
    title: "commands",
    body: commands || "No commands for this platform.",
    sources,
  };
}

function EditorFrame({
  title,
  body,
  copied,
  onCopy,
}: {
  title: string;
  body: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex items-start gap-3 border-b border-white/10 px-4 py-3">
        <span className="mt-1 flex shrink-0 gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="min-w-0 flex-1 font-mono text-xs leading-5 break-words whitespace-pre-wrap text-[#9a9a9a]">
          {title}
        </p>
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy"}
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#d4d4d4] hover:bg-white/10"
          onClick={onCopy}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
        {body}
      </pre>
    </div>
  );
}
