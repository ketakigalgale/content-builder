import React, { useState } from "react";
import { BLOCK_TYPES } from "../constants/blockTypes";

export default function BlockEditor({ block, onChange, onDelete, onClose }) {
  return (
    <div className="editor">
      <div className="editor__header">
        <span className="editor__type-badge">{block.type}</span>
        <button className="editor__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="editor__body">
        {block.type === BLOCK_TYPES.HEADER && (
          <HeaderEditor block={block} onChange={onChange} />
        )}
        {block.type === BLOCK_TYPES.TEXT && (
          <TextEditor block={block} onChange={onChange} />
        )}
        {block.type === BLOCK_TYPES.IMAGE && (
          <ImageEditor block={block} onChange={onChange} />
        )}
        {block.type === BLOCK_TYPES.MARKDOWN && (
          <MarkdownEditor block={block} onChange={onChange} />
        )}
        {block.type === BLOCK_TYPES.QUOTE && (
          <QuoteEditor block={block} onChange={onChange} />
        )}
        {block.type === BLOCK_TYPES.DIVIDER && (
          <DividerEditor block={block} onChange={onChange} />
        )}
      </div>

      <div className="editor__footer">
        <button className="btn btn--danger btn--sm" onClick={onDelete}>
          Delete block
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      {children}
    </div>
  );
}

function HeaderEditor({ block, onChange }) {
  return (
    <>
      <Field label="Heading text">
        <input
          className="input"
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Enter heading..."
        />
      </Field>
      <Field label="Level">
        <div className="seg-control">
          {["h1", "h2", "h3", "h4"].map((l) => (
            <button
              key={l}
              className={`seg-control__btn ${block.level === l ? "seg-control__btn--active" : ""}`}
              onClick={() => onChange({ level: l })}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </Field>
    </>
  );
}

function TextEditor({ block, onChange }) {
  return (
    <Field label="Content">
      <textarea
        className="input input--textarea"
        rows={8}
        value={block.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write your text..."
      />
    </Field>
  );
}

function ImageEditor({ block, onChange }) {
  const [preview, setPreview] = useState(block.url);

  return (
    <>
      <Field label="Image URL">
        <input
          className="input"
          value={block.url}
          onChange={(e) => {
            onChange({ url: e.target.value });
            setPreview(e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
        />
      </Field>
      {preview && (
        <div className="image-preview">
          <img
            src={preview}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}
      <Field label="Alt text">
        <input
          className="input"
          value={block.alt || ""}
          onChange={(e) => onChange({ alt: e.target.value })}
          placeholder="Describe the image..."
        />
      </Field>
      <Field label="Caption (optional)">
        <input
          className="input"
          value={block.caption || ""}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Image caption..."
        />
      </Field>
    </>
  );
}

function MarkdownEditor({ block, onChange }) {
  const [tab, setTab] = useState("edit");
  const html = require("../utils/markdown").parseMarkdown(block.content || "");

  return (
    <>
      <div className="tab-bar">
        <button
          className={`tab-bar__tab ${tab === "edit" ? "tab-bar__tab--active" : ""}`}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          className={`tab-bar__tab ${tab === "preview" ? "tab-bar__tab--active" : ""}`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>
      {tab === "edit" ? (
        <textarea
          className="input input--textarea input--code"
          rows={12}
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Write markdown..."
          spellCheck={false}
        />
      ) : (
        <div
          className="markdown-body markdown-body--preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </>
  );
}

function QuoteEditor({ block, onChange }) {
  return (
    <>
      <Field label="Quote text">
        <textarea
          className="input input--textarea"
          rows={4}
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Enter quote..."
        />
      </Field>
      <Field label="Author">
        <input
          className="input"
          value={block.author || ""}
          onChange={(e) => onChange({ author: e.target.value })}
          placeholder="Author name..."
        />
      </Field>
    </>
  );
}

function DividerEditor({ block, onChange }) {
  return (
    <Field label="Style">
      <div className="seg-control">
        {["solid", "dashed", "dotted", "double"].map((s) => (
          <button
            key={s}
            className={`seg-control__btn ${block.style === s ? "seg-control__btn--active" : ""}`}
            onClick={() => onChange({ style: s })}
          >
            {s}
          </button>
        ))}
      </div>
    </Field>
  );
}
