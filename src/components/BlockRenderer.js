import React, { useMemo } from "react";
import { BLOCK_TYPES } from "../constants/blockTypes";
import { parseMarkdown } from "../utils/markdown";

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case BLOCK_TYPES.HEADER:
      return <HeaderBlock block={block} />;
    case BLOCK_TYPES.TEXT:
      return <TextBlock block={block} />;
    case BLOCK_TYPES.IMAGE:
      return <ImageBlock block={block} />;
    case BLOCK_TYPES.MARKDOWN:
      return <MarkdownBlock block={block} />;
    case BLOCK_TYPES.QUOTE:
      return <QuoteBlock block={block} />;
    case BLOCK_TYPES.DIVIDER:
      return <DividerBlock block={block} />;
    default:
      return null;
  }
}

function HeaderBlock({ block }) {
  const Tag = block.level || "h1";
  const sizes = { h1: "2.4rem", h2: "1.8rem", h3: "1.3rem", h4: "1.1rem" };
  return (
    <Tag
      style={{
        fontSize: sizes[Tag] || "2rem",
        fontWeight: 700,
        lineHeight: 1.2,
        margin: 0,
        color: "var(--text-primary)",
        fontFamily: "var(--font-display)",
      }}
    >
      {block.text || "Heading"}
    </Tag>
  );
}

function TextBlock({ block }) {
  return (
    <p
      style={{
        margin: 0,
        lineHeight: 1.75,
        color: "var(--text-secondary)",
        fontSize: "1.05rem",
        whiteSpace: "pre-wrap",
      }}
    >
      {block.text || ""}
    </p>
  );
}

function ImageBlock({ block }) {
  return (
    <figure style={{ margin: 0 }}>
      <img
        src={block.url}
        alt={block.alt || ""}
        style={{
          width: "100%",
          borderRadius: "8px",
          display: "block",
          maxHeight: "480px",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.src = "https://placehold.co/800x400?text=Image+not+found";
        }}
      />
      {block.caption && (
        <figcaption
          style={{
            marginTop: "8px",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function MarkdownBlock({ block }) {
  const html = useMemo(
    () => parseMarkdown(block.content || ""),
    [block.content],
  );
  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function QuoteBlock({ block }) {
  return (
    <blockquote className="quote-block">
      <p className="quote-block__text">"{block.text}"</p>
      {block.author && (
        <cite className="quote-block__author">— {block.author}</cite>
      )}
    </blockquote>
  );
}

function DividerBlock({ block }) {
  const styles = {
    solid: { borderTop: "2px solid var(--border)" },
    dashed: { borderTop: "2px dashed var(--border)" },
    dotted: { borderTop: "2px dotted var(--border)" },
    double: { borderTop: "4px double var(--border)" },
  };
  return (
    <hr
      style={{
        border: "none",
        margin: "4px 0",
        ...(styles[block.style] || styles.solid),
      }}
    />
  );
}
