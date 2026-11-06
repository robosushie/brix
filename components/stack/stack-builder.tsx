"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Eye } from "lucide-react";
import {
  choiceLabel,
  evaluate,
  initCommand,
  registry,
  emptySelection,
  selectOption,
  type Selection,
  type StackSection,
} from "@brix/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LayoutPicker } from "@/components/stack/layout-picker";
import { chosenValues, Question } from "@/components/stack/question";
import { SkillsModal } from "@/components/stack/skills-modal";
import { StarToast } from "@/components/site/star-banner";

function sectionUnused(section: StackSection, disabled: Record<string, string>): boolean {
  const reasons = section.options.map((option) => disabled[`${section.id}.${option.id}`]);
  return Boolean(reasons[0]?.startsWith("Not used") && reasons.every((reason) => reason === reasons[0]));
}

export function StackBuilder() {
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const [copied, setCopied] = useState(false);
  const [starToast, setStarToast] = useState(false);
  const starTimer = useRef<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const result = evaluate(selection);
  const command = initCommand(result.selection);
  const showCommand = Boolean(result.selection.choices.appType);
  const appType = registry.sections.find((section) => section.id === "appType");
  const agents = registry.sections.find((section) => section.id === "agents");
  const layout = registry.sections.find((section) => section.id === "layout");
  const summary = registry.sections.flatMap((section) => {
    if (section.multi) {
      const values = chosenValues(section, result.selection);
      if (section.id === "agents" && values.length === 0) {
        return [
          {
            id: section.id,
            label: section.label,
            value: choiceLabel(section.id, "all"),
          },
        ];
      }
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
    if (!value || (value === "none" && section.id !== "layout")) return [];
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
            App type sets which sides exist, then you pick the coding agents, frontend, and backend.
            Layout is the folder tree. None installs no folder structure skill.
            Core is the UI, package manager, Turborepo, and database.
            Services adds auth, payments, files, email, workflows, AI, and testing.
            Cloud adds delivery and containers. Tools adds a code index, how the agent
            writes, memory, and a skill pack.
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
            {agents ? (
              <div>
                <Separator />
                <div className="px-8 py-6">
                  <Question
                    section={agents}
                    selection={selection}
                    disabled={result.disabled}
                    onSelect={choose}
                  />
                </div>
              </div>
            ) : null}
            {["frontend", "backend"].map((id) => {
              const section = registry.sections.find((item) => item.id === id);
              if (!section || sectionUnused(section, result.disabled)) return null;
              const nested = registry.sections.filter(
                (item) => item.nestUnder === section.id && !item.hidden,
              );
              return (
                <div key={section.id}>
                  <Separator />
                  <div className="px-8 py-6">
                    <Question
                      section={section}
                      selection={selection}
                      disabled={result.disabled}
                      onSelect={choose}
                    />
                    {nested.map((child) => (
                      <div key={child.id} className="mt-4">
                        <Question
                          section={child}
                          selection={selection}
                          disabled={result.disabled}
                          onSelect={choose}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        ) : null}

        {layout ? (
          <Card>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between px-8 py-6 text-left"
              aria-expanded={open.layout ?? false}
              onClick={() => setOpen((current) => ({ ...current, layout: !current.layout }))}
            >
              <span className="text-lg font-medium text-ink">{layout.label}</span>
              <ChevronDown
                className={`size-4 text-ink transition-transform ${open.layout ? "rotate-180" : ""}`}
              />
            </button>
            {open.layout ? (
              <div className="pb-2">
                <Separator />
                <div className="px-8 py-6">
                  <LayoutPicker
                    section={layout}
                    selection={selection}
                    disabled={result.disabled}
                    onSelect={choose}
                  />
                </div>
              </div>
            ) : null}
          </Card>
        ) : null}

        {registry.groups.map((group) => {
          const sections = registry.sections.filter(
            (section) =>
              section.group === group.id &&
              !section.hidden &&
              !section.nestUnder &&
              section.id !== "frontend" &&
              section.id !== "backend" &&
              section.id !== "agents",
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
                  {sections.map((section, index) => {
                    const nested = registry.sections.filter(
                      (item) => item.nestUnder === section.id && !item.hidden,
                    );
                    return (
                      <div key={section.id}>
                        {index > 0 ? <Separator /> : null}
                        <div className="px-8 py-6">
                          <Question
                            section={section}
                            selection={selection}
                            disabled={result.disabled}
                            onSelect={choose}
                          />
                          {nested.map((child) => (
                            <div key={child.id} className="mt-4">
                              <Question
                                section={child}
                                selection={selection}
                                disabled={result.disabled}
                                onSelect={choose}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
                      setStarToast(true);
                      if (starTimer.current) window.clearTimeout(starTimer.current);
                      starTimer.current = window.setTimeout(() => setStarToast(false), 6000);
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
            layoutId={result.selection.choices.layout}
            frontend={result.selection.choices.frontend}
            backend={result.selection.choices.backend}
            onClose={() => setSkillsOpen(false)}
          />
        ) : null}
      </aside>
      {starToast ? <StarToast /> : null}
    </div>
  );
}
