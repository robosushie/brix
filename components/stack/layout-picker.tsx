"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type Selection, type StackSection } from "@brix/core";
import { cn } from "@/lib/utils";

type TreeNode = { name: string; depth: number; children: TreeNode[] };
type Guide = "blank" | "pipe" | "branch" | "last";
type TreeRow = { name: string; guides: Guide[] };

function folderRows(lines: string[]): TreeRow[] {
  const root: TreeNode = { name: "root/", depth: -1, children: [] };
  const stack: TreeNode[] = [root];
  for (const raw of lines) {
    const match = /^( *)(.*)$/.exec(raw);
    const depth = match?.[1].length ?? 0;
    const name = (match?.[2] ?? raw).trim();
    if (!name) continue;
    const node: TreeNode = { name, depth, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  const rows: TreeRow[] = [{ name: "root/", guides: [] }];
  const walk = (nodes: TreeNode[], prefix: Array<"blank" | "pipe">) => {
    nodes.forEach((node, index) => {
      const last = index === nodes.length - 1;
      rows.push({ name: node.name, guides: [...prefix, last ? "last" : "branch"] });
      walk(node.children, [...prefix, last ? "blank" : "pipe"]);
    });
  };
  walk(root.children, []);
  return rows;
}

const line = "1px solid #44403b";
const guideWidth = 32;

function TreeGuide({ guide }: { guide: Guide }) {
  if (guide === "blank") return <span className="inline-block shrink-0" style={{ width: guideWidth }} />;
  return (
    <span className="relative inline-block shrink-0 self-stretch" style={{ width: guideWidth }}>
      <span
        className="absolute"
        style={{ left: 12, top: 0, height: guide === "last" ? "50%" : "100%", borderLeft: line }}
      />
      {guide === "pipe" ? null : (
        <span className="absolute" style={{ left: 12, top: "50%", width: 16, borderTop: line }} />
      )}
    </span>
  );
}

export function LayoutPicker({
  section,
  selection,
  disabled,
  onSelect,
}: {
  section: StackSection;
  selection: Selection;
  disabled: Record<string, string>;
  onSelect: (sectionId: string, optionId: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {section.options.map((option) => {
        const reason = disabled[`${section.id}.${option.id}`];
        const selected = selection.choices[section.id] === option.id;
        const expanded = openId === option.id && !reason;
        const points = (option.description ?? "").split(/(?<=\.)\s+/).map((point) => point.trim()).filter(Boolean);
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            aria-expanded={expanded}
            aria-disabled={Boolean(reason) || undefined}
            onClick={() => {
              if (reason) return;
              setOpenId((current) => (current === option.id ? null : option.id));
              onSelect(section.id, option.id);
            }}
            className={cn(
              "flex w-full flex-col rounded-[20px] border bg-eggshell text-left transition-colors duration-200",
              reason ? "cursor-default" : "cursor-pointer",
              selected ? "border-ink" : "border-stone",
              reason ? "" : "hover:border-ink",
            )}
            style={{ padding: 28 }}
          >
            <span className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  reason ? "border-stone" : "border-ink",
                )}
              >
                {selected ? <span className="size-2 rounded-full bg-ink" /> : null}
              </span>
              <span className={cn("text-sm font-medium", reason ? "text-ash" : "text-ink")}>
                {option.label}
              </span>
              {reason ? null : (
                <ChevronDown
                  className={cn("ml-auto size-4 shrink-0 text-ink transition-transform", expanded && "rotate-180")}
                />
              )}
            </span>
            {expanded ? (
              <span className="block">
                <span className="block border-t border-stone" style={{ margin: "16px 0" }} />
                <span className="grid items-start gap-6 md:grid-cols-2">
                  {option.tree ? (
                    <span className="min-w-0 rounded-[4px] border border-stone" style={{ padding: "12px 18px" }}>
                      {folderRows(option.tree).map((row, index) => (
                        <span
                          key={`${row.name}-${index}`}
                          className="flex items-stretch font-mono text-xs leading-5 text-ink"
                          style={{ fontSize: 11 }}
                        >
                          {row.guides.map((guide, guideIndex) => (
                            <TreeGuide key={guideIndex} guide={guide} />
                          ))}
                          <span style={{ paddingLeft: 6 }}>{row.name}</span>
                        </span>
                      ))}
                    </span>
                  ) : null}
                  {points.length > 0 ? (
                    <span className="flex flex-col gap-2 text-sm leading-relaxed text-smoke">
                      {points.map((point) => (
                        <span key={point} className="flex gap-2">
                          <span aria-hidden className="text-ink">•</span>
                          <span>{point}</span>
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
