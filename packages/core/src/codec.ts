import { registry } from "./registry.ts";
import { normalizeSelection } from "./selection.ts";
import { isAgent, type AgentId, type Selection } from "./types.ts";

export function encodeConfig(sel: Selection): string {
  const json = JSON.stringify(normalizeSelection(sel));
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

export function decodeConfig(hash: string): Selection | null {
  try {
    const trimmed = hash.replace(/^#/, "").trim();
    if (!trimmed) return null;
    let base64 = trimmed.replaceAll("-", "+").replaceAll("_", "/");
    while (base64.length % 4) base64 += "=";
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<Selection>;
    if (!parsed || typeof parsed !== "object" || !parsed.choices) return null;
    return normalizeSelection({
      registryVersion: registry.version,
      preset: parsed.preset ?? null,
      agents: (parsed.agents ?? []).filter((agent): agent is AgentId => isAgent(String(agent))),
      choices: parsed.choices,
      notes: parsed.notes ?? "",
    });
  } catch {
    return null;
  }
}
