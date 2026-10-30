export type HighlightToken = {
  text: string;
  color?: string;
};

const color = {
  comment: "#6A9955",
  string: "#CE9178",
  keyword: "#C586C0",
  heading: "#569CD6",
  command: "#DCDCAA",
  flag: "#9CDCFE",
  path: "#4EC9B0",
  punct: "#808080",
  marker: "#808080",
};

const shellFence = new Set(["", "sh", "bash", "shell", "zsh", "ps1", "powershell"]);

export function highlightSkill(source: string, kind: "markdown" | "shell"): HighlightToken[] {
  if (kind === "shell") return highlightShell(source);
  return highlightMarkdown(source);
}

function highlightMarkdown(source: string): HighlightToken[] {
  const lines = source.split("\n");
  const tokens: HighlightToken[] = [];
  let mode: "start" | "frontmatter" | "body" | "fence" = source.startsWith("---") ? "start" : "body";
  let fenceLang = "";

  lines.forEach((line, index) => {
    const newline = index < lines.length - 1 ? "\n" : "";
    if (mode === "start" || mode === "frontmatter") {
      if (line.trim() === "---") {
        mode = mode === "start" ? "frontmatter" : "body";
        tokens.push({ text: line + newline, color: color.punct });
        return;
      }
      tokens.push(...highlightYamlLine(line), { text: newline });
      return;
    }
    if (mode === "fence") {
      if (line.trim().startsWith("```")) {
        mode = "body";
        tokens.push({ text: line + newline, color: color.punct });
        return;
      }
      const inner = shellFence.has(fenceLang) ? highlightShellLine(line) : highlightCodeLine(line);
      tokens.push(...inner, { text: newline });
      return;
    }
    if (line.trim().startsWith("```")) {
      mode = "fence";
      fenceLang = line.trim().slice(3).trim().toLowerCase();
      tokens.push({ text: line + newline, color: color.punct });
      return;
    }
    tokens.push(...highlightMarkdownLine(line), { text: newline });
  });

  return tokens.filter((token) => token.text.length > 0);
}

function highlightYamlLine(line: string): HighlightToken[] {
  const match = /^(\s*)([A-Za-z0-9_-]+)(\s*:\s*)(.*)$/.exec(line);
  if (!match) return [{ text: line, color: color.string }];
  const [, indent, key, colon, value] = match;
  return [
    { text: indent },
    { text: key, color: color.flag },
    { text: colon, color: color.punct },
    { text: value, color: color.string },
  ].filter((token) => token.text.length > 0);
}

function highlightMarkdownLine(line: string): HighlightToken[] {
  const heading = /^(#{1,6})(\s+.*)$/.exec(line);
  if (heading) {
    return [
      { text: heading[1], color: color.punct },
      { text: heading[2], color: color.heading },
    ];
  }
  const list = /^(\s*)([-*]|\d+\.)(\s+)(.*)$/.exec(line);
  if (list) {
    return [
      { text: list[1] },
      { text: list[2], color: color.marker },
      { text: list[3] },
      ...highlightInline(list[4]),
    ].filter((token) => token.text.length > 0);
  }
  return highlightInline(line);
}

function highlightInline(text: string): HighlightToken[] {
  const parts = text.split(/(`[^`\n]+`)/g);
  return parts
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`") ? { text: part, color: color.string } : { text: part },
    );
}

function highlightShell(source: string): HighlightToken[] {
  const lines = source.split("\n");
  const tokens: HighlightToken[] = [];
  lines.forEach((line, index) => {
    tokens.push(...highlightShellLine(line));
    if (index < lines.length - 1) tokens.push({ text: "\n" });
  });
  return tokens.filter((token) => token.text.length > 0);
}

function highlightShellLine(line: string): HighlightToken[] {
  if (!line.trim()) return [{ text: line }];
  if (line.trimStart().startsWith("#")) return [{ text: line, color: color.comment }];

  const tokens: HighlightToken[] = [];
  const pattern =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|https?:\/\/\S+|--[\w.-]+(?:=(?:"[^"]*"|'[^']*'|\S+))?|-[A-Za-z0-9]+|\s+|\S+)/g;
  let commandSeen = false;
  for (const match of line.matchAll(pattern)) {
    const part = match[0];
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part });
      continue;
    }
    if (part.startsWith('"') || part.startsWith("'") || part.startsWith("http://") || part.startsWith("https://")) {
      tokens.push({ text: part, color: color.string });
      commandSeen = true;
      continue;
    }
    if (part.startsWith("-")) {
      const eq = part.indexOf("=");
      if (eq === -1) tokens.push({ text: part, color: color.flag });
      else {
        tokens.push({ text: part.slice(0, eq), color: color.flag });
        tokens.push({ text: "=", color: color.punct });
        tokens.push({ text: part.slice(eq + 1), color: color.string });
      }
      commandSeen = true;
      continue;
    }
    if (!commandSeen) {
      tokens.push({ text: part, color: color.command });
      commandSeen = true;
      continue;
    }
    if (part.includes("/") || part.startsWith("@") || part.includes(".")) {
      tokens.push({ text: part, color: color.path });
      continue;
    }
    if (/^[A-Za-z][\w-]*$/.test(part)) {
      tokens.push({ text: part, color: color.keyword });
      continue;
    }
    tokens.push({ text: part });
  }
  return tokens;
}

function highlightCodeLine(line: string): HighlightToken[] {
  if (line.trimStart().startsWith("#") || line.trimStart().startsWith("//")) {
    return [{ text: line, color: color.comment }];
  }
  return highlightInline(line);
}
