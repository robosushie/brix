"use client";

import { suggestedLayout, type Selection, type StackSection } from "@brix/core";
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

function TreeGuide({ guide }: { guide: Guide }) {
  if (guide === "blank") return <span className="inline-block shrink-0" style={{ width: 16 }} />;
  return (
    <span className="relative inline-block shrink-0 self-stretch" style={{ width: 16 }}>
      <span
        className="absolute"
        style={{ left: 7, top: 0, height: guide === "last" ? "50%" : "100%", borderLeft: line }}
      />
      {guide === "pipe" ? null : (
        <span className="absolute" style={{ left: 7, top: "50%", width: 9, borderTop: line }} />
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
  const suggested = suggestedLayout(selection);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {section.options.map((option) => {
        const reason = disabled[`${section.id}.${option.id}`];
        const selected = selection.choices[section.id] === option.id;
        const showSuggested = suggested === option.id && !selected;
        return (
          <span key={option.id} className="group relative flex">
            <button
              type="button"
              aria-pressed={selected}
              aria-disabled={Boolean(reason) || undefined}
              onClick={() => {
                if (!reason) onSelect(section.id, option.id);
              }}
              className={cn(
                "flex w-full cursor-pointer flex-col rounded-[20px] border bg-eggshell p-5 text-left transition-colors duration-200",
                selected ? "border-ink" : "border-stone",
                reason ? "cursor-not-allowed" : "hover:border-ink",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-ink" : reason ? "border-ash" : "border-stone",
                  )}
                >
                  {selected ? <span className="size-2 rounded-full bg-ink" /> : null}
                </span>
                <span className={cn("text-sm font-medium", reason ? "text-ash" : "text-ink")}>
                  {option.label}
                </span>
                {showSuggested ? <span className="mono-label ml-auto text-smoke">Suggested</span> : null}
              </span>
              {option.tree ? (
                <div className="mt-4 rounded-[20px] bg-white px-4 py-3" style={{ backgroundColor: "#ffffff" }}>
                  {folderRows(option.tree).map((row, index) => (
                    <div
                      key={`${row.name}-${index}`}
                      className="flex items-stretch font-mono text-xs leading-5 text-ink"
                      style={{ fontSize: 11 }}
                    >
                      {row.guides.map((guide, guideIndex) => (
                        <TreeGuide key={guideIndex} guide={guide} />
                      ))}
                      <span className="pl-1">{row.name}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </button>
            {option.description || reason ? (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-4 z-10 mb-2 hidden w-72 rounded-[4px] border border-stone bg-eggshell px-3 py-2 text-left text-xs leading-relaxed text-ink group-hover:block"
              >
                {reason ? <span className="mb-1 block font-medium">{reason}</span> : null}
                {option.description ? <span className="block">{option.description}</span> : null}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
