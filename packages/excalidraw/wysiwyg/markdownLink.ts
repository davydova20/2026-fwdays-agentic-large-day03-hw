import { normalizeLink } from "@excalidraw/common";

/**
 * Matches a single markdown-style link that occupies the whole string (trimmed):
 * `[label](url)`. Does not match inline links inside other text.
 */
const WHOLE_MARKDOWN_LINK_RE = /^\[([^\]]*)\]\(([^)]*)\)$/;

export type ParsedMarkdownLink = {
  label: string;
  url: string;
};

/**
 * If `text` (after trim) is exactly `[label](url)`, returns the captured parts.
 * Otherwise returns null.
 */
export const tryParseMarkdownLink = (text: string): ParsedMarkdownLink | null => {
  const trimmed = text.trim();
  const match = WHOLE_MARKDOWN_LINK_RE.exec(trimmed);
  if (!match) {
    return null;
  }
  return { label: match[1], url: match[2] };
};

export type MarkdownSubmitResolution = {
  originalText: string;
  /** When set, replaces `element.link`; when omitted, previous link is kept. */
  link?: string | null;
};

/**
 * On text editor submit: if the full content is `[label](url)` and the URL is
 * safe/non-empty after `normalizeLink`, replace visible text with `label` and
 * set `link` to the normalized URL. Otherwise leave text as-is (and keep the
 * existing `element.link` — caller omits `link` in the patch).
 */
export const resolveMarkdownTextOnSubmit = (
  raw: string,
): MarkdownSubmitResolution => {
  const parsed = tryParseMarkdownLink(raw);
  if (!parsed) {
    return { originalText: raw };
  }

  const urlTrimmed = parsed.url.trim();
  if (!urlTrimmed) {
    return { originalText: raw };
  }

  const normalized = normalizeLink(urlTrimmed);
  if (!normalized) {
    return { originalText: raw };
  }

  return {
    originalText: parsed.label,
    link: normalized,
  };
};
