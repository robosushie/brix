"use client";

import { useEffect, useState } from "react";
import {
  choiceLabel,
  decodeConfig,
  encodeConfig,
  evaluate,
  initCommand,
  registry,
  emptySelection,
  selectOption,
  type AgentId,
  type Selection,
} from "@brix/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function StackBuilder() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [copied, setCopied] = useState(false);

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
  const command = result.valid ? initCommand(result.selection) : "";
  const summary = registry.sections.filter((section) => {
    if (section.id === "agents") return false;
    const value = result.selection.choices[section.id];
    return Boolean(value && value !== "none");
  });

  return (
    <div className="mx-auto grid max-w-[1280px] gap-8 px-8 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mono-label text-muted-foreground">Stack</p>
          <h1 className="display mt-3 text-[48px] text-ink">Build a stack</h1>
          <p className="mt-3 max-w-xl text-base text-smoke">
            One choice per section. Each section unlocks after the one above it. A section that does not fit the app type stays off.
          </p>
        </div>

        {registry.sections
          .filter((section) => section.id !== "agents")
          .map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(() => {
                  const reasons = section.options.map((option) => result.disabled[`${section.id}.${option.id}`]);
                  const unused = reasons[0]?.startsWith("Not used") && reasons.every((reason) => reason === reasons[0]);
                  if (unused) return <p className="text-sm text-smoke">{reasons[0]}</p>;
                  return section.options.map((option) => {
                    const id = `${section.id}.${option.id}`;
                    const reason = result.disabled[id];
                    const selected = selection.choices[section.id] === option.id;
                    return (
                      <Button
                        key={option.id}
                        type="button"
                        size="sm"
                        title={reason}
                        disabled={Boolean(reason) && !selected}
                        variant={selected ? "pillSelected" : "pill"}
                        onClick={() => {
                          setCopied(false);
                          setSelection(selectOption(selection, section.id, option.id));
                        }}
                      >
                        {option.label}
                      </Button>
                    );
                  });
                })()}
              </CardContent>
            </Card>
          ))}

        <Card>
          <CardHeader>
            <CardTitle>AI tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {registry.sections
              .find((section) => section.id === "agents")
              ?.options.map((option) => {
                const selected = selection.agents.includes(option.id as AgentId);
                return (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={selected ? "pillSelected" : "pill"}
                    onClick={() => {
                      setCopied(false);
                      setSelection(selectOption(selection, "agents", option.id));
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced</CardTitle>
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
              {summary.map((section) => (
                <li key={section.id}>
                  <span className="text-muted-foreground">{section.label}</span>
                  <span className="mt-0.5 block font-medium">
                    {choiceLabel(section.id, result.selection.choices[section.id])}
                  </span>
                </li>
              ))}
              <li>
                <span className="text-muted-foreground">AI tools</span>
                <span className="mt-0.5 block font-medium">{result.selection.agents.join(", ")}</span>
              </li>
            </ul>
            {result.valid ? (
              <>
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
              </>
            ) : (
              <ul className="space-y-1 text-sm text-destructive">
                {result.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
