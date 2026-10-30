"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, Eye } from "lucide-react";
import {
  choiceLabel,
  evaluate,
  initCommand,
  registry,
  emptySelection,
  selectOption,
  type Selection,
} from "@brix/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { chosenValues, Question } from "@/components/stack/question";
import { SkillsModal } from "@/components/stack/skills-modal";

export function StackBuilder() {
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const [copied, setCopied] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ core: true });

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const result = evaluate(selection);
  const command = initCommand(result.selection);
  const showCommand = Boolean(result.selection.choices.appType);
  const appType = registry.sections.find((section) => section.id === "appType");
  const summary = registry.sections.flatMap((section) => {
    if (section.multi) {
      const values = chosenValues(section, result.selection);
      if (values.length === 0) return [];
      return [
        {
          id: section.id,
          label: section.label,
          value: values.map((id) => choiceLabel(section.id, id)).join(", "),
        },
      ];
    }
    const value = result.selection.choices[section.id];
    if (!value || value === "none") return [];
    return [
      { id: section.id, label: section.label, value: choiceLabel(section.id, value) },
    ];
  });

  function choose(sectionId: string, optionId: string) {
    setCopied(false);
    setSelection((current) =>
      current ? selectOption(current, sectionId, optionId) : current,
    );
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-8 px-8 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mono-label text-muted-foreground">Stack</p>
          <h1 className="display mt-3 text-[48px] text-ink">Build a stack</h1>
          <p className="mt-3 max-w-xl text-base text-smoke">
            App type sets the shape of the app. Core is the frontend, UI, backend,
            database, and coding agents. Services adds auth, payments, files,
            email, workflows, AI, and testing. Cloud adds delivery and
            containers. Tools adds a code index, how the agent writes, memory, and a skill
            pack.
          </p>
        </div>

        {appType ? (
          <Card>
            <div className="px-8 pb-6 pt-8">
              <p className="text-lg font-medium text-ink">{appType.label}</p>
            </div>
            <Separator />
            <div className="px-8 py-6">
              <Question
                section={appType}
                selection={selection}
                disabled={result.disabled}
                onSelect={choose}
                hideLabel
              />
            </div>
          </Card>
        ) : null}

        {registry.groups.map((group) => {
          const sections = registry.sections.filter(
            (section) => section.group === group.id && !section.hidden,
          );
          const expanded = open[group.id] ?? false;
          return (
            <Card key={group.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between px-8 py-6 text-left"
                aria-expanded={expanded}
                onClick={() =>
                  setOpen((current) => ({ ...current, [group.id]: !expanded }))
                }
              >
                <span className="text-lg font-medium text-ink">{group.label}</span>
                <ChevronDown
                  className={`size-4 text-ink transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded ? (
                <div className="pb-2">
                  <Separator />
                  {sections.map((section, index) => (
                    <div key={section.id}>
                      {index > 0 ? <Separator /> : null}
                      <div className="px-8 py-6">
                        <Question
                          section={section}
                          selection={selection}
                          disabled={result.disabled}
                          onSelect={choose}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <aside className="h-fit lg:sticky lg:top-6">
        <Card className="bg-eggshell shadow-whisper">
          <CardHeader>
            <p className="mono-label text-muted-foreground">Summary</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1 text-sm leading-5">
              {summary.map((row) => (
                <li key={row.id}>
                  <span className="text-muted-foreground">{row.label}: </span>
                  <span className="font-medium">{row.value}</span>
                </li>
              ))}
            </ul>
            {result.errors.length > 0 ? (
              <ul className="space-y-1 text-sm text-destructive">
                {result.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : null}
            {showCommand ? (
              <div className="rounded-[4px] border border-stone bg-taupe">
                <div className="flex items-center gap-1 px-2 pt-2">
                  <button
                    type="button"
                    aria-label={copied ? "Copied" : "Copy command"}
                    className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink transition-colors duration-200 hover:bg-eggshell"
                    onClick={async () => {
                      await navigator.clipboard.writeText(command);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1500);
                    }}
                  >
                    {copied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md px-1.5 text-xs text-ink transition-colors duration-200 hover:bg-eggshell"
                    onClick={() => setSkillsOpen(true)}
                  >
                    <Eye className="size-3.5" />
                    View Skills
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-words px-3 pt-2 pb-3 font-mono text-[13px] leading-relaxed text-ink">
                  {command}
                </pre>
              </div>
            ) : null}
          </CardContent>
        </Card>
        {skillsOpen ? (
          <SkillsModal
            skills={result.skills}
            agents={result.selection.agents}
            onClose={() => setSkillsOpen(false)}
          />
        ) : null}
      </aside>
    </div>
  );
}
