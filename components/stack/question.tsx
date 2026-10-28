"use client";

import { optionRelations, type Selection, type StackSection } from "@brix/core";
import { Button } from "@/components/ui/button";

export function chosenValues(section: StackSection, selection: Selection): string[] {
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

export function Question({
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
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-72 -translate-x-1/2 rounded-[4px] border border-stone bg-eggshell px-3 py-2 text-left text-xs leading-relaxed text-ink group-hover:block"
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
