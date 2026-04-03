# Markdown-style links in text elements

Related upstream discussion: [excalidraw/excalidraw#11024](https://github.com/excalidraw/excalidraw/issues/11024).

## Supported format (MVP)

When **the entire** text of a text element is a single markdown link (after trimming), finishing the editor (blur / Escape) will:

- Show only the **label** as the visible text.
- Attach the **URL** to the element’s existing `link` field (same as the hyperlink tool), after sanitization via `normalizeLink()` (`@braintree/sanitize-url`).

Example: type `[Open Docs](https://example.com)` and exit the editor — the canvas shows `Open Docs` with the usual link affordance.

## Not supported

- **Inline** links inside other text, e.g. `See [here](https://a.com) for details`, are left **unchanged** (no silent mutation).
- URLs that sanitize to an empty string (e.g. dangerous schemes) do **not** trigger conversion; the raw text is kept.

## Implementation

- Parser and submit resolution: [`packages/excalidraw/wysiwyg/markdownLink.ts`](../packages/excalidraw/wysiwyg/markdownLink.ts)
- Wired on text editor submit: [`packages/excalidraw/components/App.tsx`](../packages/excalidraw/components/App.tsx) (`handleTextWysiwyg` → `resolveMarkdownTextOnSubmit`)
