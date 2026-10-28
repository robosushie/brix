"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  choiceLabel,
  decodeConfig,
  encodeConfig,
  evaluate,
  initCommand,
  registry,
  emptySelection,
  selectOption,
  type Selection,
  type StackSection,
} from "@brix/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

function chosenValues(section: StackSection, selection: Selection): string[] {
  if (section.id === "agents") return selection.agents;
  if (section.id === "tools") return selection.tools;
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
            const reason = disabled[`${section.id}.${option.id}`];
            const selected = isSelected(section, option.id, selection);
            return (
              <Button
                key={option.id}
                type="button"
                size="sm"
                title={reason}
                disabled={Boolean(reason) && !selected}
                variant={selected ? "pillSelected" : "pill"}
                onClick={() => onSelect(section.id, option.id)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StackBuilder() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ core: true });

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const decoded = hash ? decodeConfig(hash) : null;
    setSelection(decoded ?? emptySelection());
  }, []);

  useEffect(() => {
    if (!selection) return;
    const next = `#${encodeConfig(selection)}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", `${window.location.pathname}${next}`);
    }
  }, [selection]);

  if (!selection) {
    return <p className="mx-auto max-w-[1200px] px-6 py-12 text-muted-foreground">Loading stack…</p>;
  }

  const result = evaluate(selection);
  const command = initCommand(result.selection);
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
            App type sits on top. Core, Services, Cloud, and Tools open on their own. None leaves that flag off the command.
          </p>
        </div>

        {appType ? (
          <Card>
            <CardHeader>
              <p className="text-lg font-medium text-ink">{appType.label}</p>
            </CardHeader>
            <CardContent>
              <Question section={appType} selection={selection} disabled={result.disabled} onSelect={choose} hideLabel />
            </CardContent>
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
                <CardContent className="flex flex-col gap-6 pt-0">
                  {sections.map((section) => (
                    <Question
                      key={section.id}
                      section={section}
                      selection={selection}
                      disabled={result.disabled}
                      onSelect={choose}
                    />
                  ))}
                </CardContent>
              ) : null}
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <p className="text-lg font-medium text-ink">Advanced</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={selection.notes}
              maxLength={2000}
              placeholder="Extra requirements — realtime, admin, i18n…"
              onChange={(event) =>
                setSelection({ ...selection, notes: event.target.value.slice(0, 2000) })
              }
            />
          </CardContent>
        </Card>
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
            <pre className="overflow-x-auto rounded-[4px] border border-stone bg-taupe p-3 font-mono text-[13px] leading-relaxed text-ink">
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
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
