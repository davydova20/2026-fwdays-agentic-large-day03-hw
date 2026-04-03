import { describe, expect, it } from "vitest";

import {
  resolveMarkdownTextOnSubmit,
  tryParseMarkdownLink,
} from "../wysiwyg/markdownLink";

describe("tryParseMarkdownLink", () => {
  it("parses a whole-string markdown link", () => {
    expect(tryParseMarkdownLink("[Open Docs](https://example.com/path)")).toEqual(
      {
        label: "Open Docs",
        url: "https://example.com/path",
      },
    );
  });

  it("trims surrounding whitespace", () => {
    expect(tryParseMarkdownLink("  [Label](https://a.com)  ")).toEqual({
      label: "Label",
      url: "https://a.com",
    });
  });

  it("returns null for inline markdown inside other text", () => {
    expect(tryParseMarkdownLink('See [here](https://a.com) for more')).toBeNull();
  });

  it("returns null for multiple lines", () => {
    expect(tryParseMarkdownLink("[a](https://b.com)\nextra")).toBeNull();
  });

  it("allows empty label", () => {
    expect(tryParseMarkdownLink("[](https://example.com)")).toEqual({
      label: "",
      url: "https://example.com",
    });
  });
});

describe("resolveMarkdownTextOnSubmit", () => {
  it("replaces text with label and sets link when pattern matches", () => {
    const r = resolveMarkdownTextOnSubmit("[Hello](https://excalidraw.com)");
    expect(r.originalText).toBe("Hello");
    expect(r.link).toBeDefined();
    expect(r.link).toMatch(/^https:/);
  });

  it("leaves raw text when pattern does not match", () => {
    const r = resolveMarkdownTextOnSubmit("plain text");
    expect(r.originalText).toBe("plain text");
    expect(r.link).toBeUndefined();
  });

  it("does not apply when url is empty", () => {
    const raw = "[Label]()";
    const r = resolveMarkdownTextOnSubmit(raw);
    expect(r.originalText).toBe(raw);
    expect(r.link).toBeUndefined();
  });

  it("does not apply for javascript: URLs (sanitized to empty)", () => {
    const raw = "[x](javascript:alert(1))";
    const r = resolveMarkdownTextOnSubmit(raw);
    expect(r.originalText).toBe(raw);
    expect(r.link).toBeUndefined();
  });
});
