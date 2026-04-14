/**
 * Lightweight Markdown → HTML parser.
 * Supports: headings, bold, italic, inline code, code blocks,
 * blockquotes, ordered/unordered lists, horizontal rules, links.
 */
export function parseMarkdown(md) {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Code blocks (``` ... ```)
    .replace(
      /```([\s\S]*?)```/g,
      (_, code) => `<pre><code>${code.trim()}</code></pre>`,
    )

    // Headings
    .replace(/^#{6}\s(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s(.+)$/gm, "<h1>$1</h1>")

    // Blockquotes
    .replace(/^&gt;\s(.+)$/gm, "<blockquote>$1</blockquote>")

    // Horizontal rules
    .replace(/^---$/gm, "<hr />")

    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")

    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // Links
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Unordered lists (- or *)
    .replace(/^\s*[-*]\s(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>")

    // Ordered lists
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")

    // Paragraphs (lines separated by blank lines)
    .replace(/\n\n+/g, "\n\n")
    .split("\n\n")
    .map((para) => {
      const stripped = para.trim();
      if (!stripped) return "";
      if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr)/.test(stripped))
        return stripped;
      return `<p>${stripped.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}
