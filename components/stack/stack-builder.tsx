"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  choiceLabel,
  evaluate,
  initCommand,
  optionRelations,
  registry,
  emptySelection,
  selectOption,
  type Selection,
  type StackSection,
} from "@brix/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function chosenValues(section: StackSection, selection: Selection): string[] {
  if (section.id === "agents") return selection.agents;
  return [];
}

function isSelected(section: StackSection, optionId: string, selection: Selection): boolean {
  if (section.multi) {
    const values = chosenValues(section, selection);
    if (optionId === "none") return values.length === 0;
    return values.includes(optionId);
  }
  return selection.choices[section.id] === optionId;
}

function Question({
  section,
  selection,
  disabled,
  onSelect,
  hideLabel = false,
}: {
  section: StackSection;
  selection: Selection;
  disabled: Record<string, string>;
  onSelect: (sectionId: string, optionId: string) => void;
  hideLabel?: boolean;
}) {
  const reasons = section.options.map((option) => disabled[`${section.id}.${option.id}`]);
  const unused = Boolean(reasons[0]?.startsWith("Not used") && reasons.every((reason) => reason === reasons[0]));

  return (
    <div>
      {hideLabel ? null : <p className="mb-2 text-sm font-medium text-ink">{section.label}</p>}
      {unused ? (
        <p className="text-sm text-smoke">{reasons[0]}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {section.options.map((option) => {
            const selected = isSelected(section, option.id, selection);
            const relations = optionRelations(section.id, option.id, selection);
            const reason = relations.reason;
            const dependencies = [...relations.with, ...relations.without];
            const status = reason && !reason.startsWith("Conflicts with") && !reason.startsWith("Requires ") ? reason : null;
            return (
              <span key={option.id} className="group relative inline-flex">
                <Button
                  type="button"
                  size="sm"
                  disabled={Boolean(reason) && !selected}
                  variant={selected ? "pillSelected" : "pill"}
                  onClick={() => onSelect(section.id, option.id)}
                >
                  {option.label}
                </Button>
                {option.description || status || dependencies.length > 0 ? (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-72 -translate-x-1/2 rounded-[4px] border border-stone bg-eggshell px-3 py-2 text-left text-xs leading-relaxed text-ink group-hover:block group-focus-within:block"
                  >
                    {status ? <span className="mb-1 block font-medium">{status}</span> : null}
                    {option.description ? <span className="block">{option.description}</span> : null}
                    {dependencies.length > 0 ? (
                      <>
                        <span className="my-2 block h-px w-full bg-stone" />
                        <span className="block text-[10px] uppercase tracking-wide text-smoke">Dependencies:</span>
                        <span className="mt-1.5 flex flex-wrap gap-1">
                          {dependencies.map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center rounded-full border border-stone bg-taupe px-2 py-0.5 text-[10px] leading-4 text-ink"
                            >
                              {label}
                            </span>
                          ))}
                        </span>
                      </>
                    ) : null}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StackBuilder() {
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const [copied, setCopied] = useState(false);
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
      return [{ id: section.id, label: section.label, value: values.map((id) => choiceLabel(section.id, id)).join(", ") }];
    }
    const value = result.selection.choices[section.id];
    if (!value || value === "none") return [];
    return [{ id: section.id, label: section.label, value: choiceLabel(section.id, value) }];
  });

  function choose(sectionId: string, optionId: string) {
    setCopied(false);
    setSelection((current) => (current ? selectOption(current, sectionId, optionId) : current));
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-8 px-8 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mono-label text-muted-foreground">Stack</p>
          <h1 className="display mt-3 text-[48px] text-ink">Build a stack</h1>
          <p className="mt-3 max-w-xl text-base text-smoke">
            App type sets the shape of the app. Core is the frontend, UI, backend, database, and coding agents. Services adds auth, payments, cache, files, email, workflows, and testing. Cloud adds monitoring, delivery, and containers. Tools adds a code index, how the agent writes, memory, and a skill pack.
          </p>
        </div>

        {appType ? (
          <Card>
            <div className="px-8 pb-6 pt-8">
              <p className="text-lg font-medium text-ink">{appType.label}</p>
            </div>
            <Separator />
            <div className="px-8 py-6">
              <Question section={appType} selection={selection} disabled={result.disabled} onSelect={choose} hideLabel />
            </div>
          </Card>
        ) : null}

        {registry.groups.map((group) => {
          const sections = registry.sections.filter((section) => section.group === group.id);
          const expanded = open[group.id] ?? false;
          return (
            <Card key={group.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-8 py-6 text-left"
                aria-expanded={expanded}
                onClick={() => setOpen((current) => ({ ...current, [group.id]: !expanded }))}
              >
                <span className="text-lg font-medium text-ink">{group.label}</span>
                <ChevronDown className={`size-4 text-ink transition-transform ${expanded ? "rotate-180" : ""}`} />
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
            <ul className="space-y-2 text-sm">
              {summary.map((row) => (
                <li key={row.id}>
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="mt-0.5 block font-medium">{row.value}</span>
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
              <>
                <pre className="whitespace-pre-wrap break-words rounded-[4px] border border-stone bg-taupe p-3 font-mono text-[13px] leading-relaxed text-ink">
                  {command}
                </pre>
                <Button
                  type="button"
                  className="w-full"
                  onClick={async () => {
                    await navigator.clipboard.writeText(command);
                    setCopied(true);
                  }}
                >
                  {copied ? "Copied" : "Copy command"}
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
