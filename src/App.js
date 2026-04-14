import React, { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./hooks/useLocalStorage";
import Palette from "./components/Palette";
import Canvas from "./components/Canvas";
import BlockEditor from "./components/BlockEditor";
import "./styles/App.css";
import { BLOCK_TYPES } from "./constants/blockTypes";


const defaultBlocks = [];

export default function App() {
  const [blocks, setBlocks] = useLocalStorage("dcb_blocks", defaultBlocks);
  const [selectedId, setSelectedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const dragSrcIdx = useRef(null);

  const selectedBlock = blocks.find((b) => b.id === selectedId);

  /* ── Add block from palette ─────────────────────────────────── */
  const addBlock = useCallback(
    (type) => {
      const defaults = {
        [BLOCK_TYPES.HEADER]: { level: "h1", text: "My Heading" },
        [BLOCK_TYPES.TEXT]: { text: "Start writing your content here..." },
        [BLOCK_TYPES.IMAGE]: {
          url: "https://picsum.photos/800/400",
          alt: "Beautiful image",
          caption: "",
        },
        [BLOCK_TYPES.MARKDOWN]: {
          content:
            "## Hello\n\nWrite **markdown** here.\n\n- Item one\n- Item two",
        },
        [BLOCK_TYPES.DIVIDER]: { style: "solid" },
        [BLOCK_TYPES.QUOTE]: {
          text: "An inspiring quote goes here.",
          author: "Author Name",
        },
      };
      const newBlock = { id: uuidv4(), type, ...defaults[type] };
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedId(newBlock.id);
      setPaletteOpen(false);
    },
    [setBlocks],
  );

  /* ── Update block content ────────────────────────────────────── */
  const updateBlock = useCallback(
    (id, patch) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      );
    },
    [setBlocks],
  );

  /* ── Delete block ────────────────────────────────────────────── */
  const deleteBlock = useCallback(
    (id) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      setSelectedId(null);
    },
    [setBlocks],
  );

  /* ── Duplicate block ─────────────────────────────────────────── */
  const duplicateBlock = useCallback(
    (id) => {
      setBlocks((prev) => {
        const idx = prev.findIndex((b) => b.id === id);
        if (idx === -1) return prev;
        const copy = { ...prev[idx], id: uuidv4() };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
      });
    },
    [setBlocks],
  );

  /* ── Move block up / down ────────────────────────────────────── */
  const moveBlock = useCallback(
    (id, dir) => {
      setBlocks((prev) => {
        const idx = prev.findIndex((b) => b.id === id);
        const swapIdx = idx + dir;
        if (swapIdx < 0 || swapIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return next;
      });
    },
    [setBlocks],
  );

  /* ── Drag-and-drop handlers ──────────────────────────────────── */
  const handleDragStart = useCallback(
    (e, id) => {
      dragSrcIdx.current = blocks.findIndex((b) => b.id === id);
      setDraggingId(id);
      e.dataTransfer.effectAllowed = "move";
    },
    [blocks],
  );

  const handleDragOver = useCallback((e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  }, []);

  const handleDrop = useCallback(
    (e, targetId) => {
      e.preventDefault();
      const srcIdx = dragSrcIdx.current;
      const tgtIdx = blocks.findIndex((b) => b.id === targetId);
      if (srcIdx === null || srcIdx === tgtIdx) return;
      setBlocks((prev) => {
        const next = [...prev];
        const [moved] = next.splice(srcIdx, 1);
        next.splice(tgtIdx, 0, moved);
        return next;
      });
      setDragOverId(null);
      setDraggingId(null);
    },
    [blocks, setBlocks],
  );

  const handleDragEnd = useCallback(() => {
    setDragOverId(null);
    setDraggingId(null);
    dragSrcIdx.current = null;
  }, []);

  const clearAll = useCallback(() => {
    if (window.confirm("Clear all blocks? This cannot be undone.")) {
      setBlocks([]);
      setSelectedId(null);
    }
  }, [setBlocks]);

  return (
    <div className="app">
      {/* ── Top Bar ───────────────────────────────────────────── */}
      <header className="topbar">
        <div className="topbar__logo">
          <span className="topbar__icon">◈</span>
          <span className="topbar__title">PageCraft</span>
        </div>
        <div className="topbar__actions">
          <span className="topbar__saved">✓ Auto-saved</span>
          {blocks.length > 0 && (
            <button className="btn btn--ghost btn--sm" onClick={clearAll}>
              Clear all
            </button>
          )}
          <button
            className="btn btn--primary"
            onClick={() => setPaletteOpen(true)}
          >
            + Add Block
          </button>
        </div>
      </header>

      <div className="workspace">
        {/* ── Canvas ────────────────────────────────────────────── */}
        <main className="main-area">
          <Canvas
            blocks={blocks}
            selectedId={selectedId}
            draggingId={draggingId}
            dragOverId={dragOverId}
            onSelect={setSelectedId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onDelete={deleteBlock}
            onDuplicate={duplicateBlock}
            onMove={moveBlock}
            onAddBlock={() => setPaletteOpen(true)}
          />
        </main>

        {/* ── Editor Panel ──────────────────────────────────────── */}
        {selectedBlock && (
          <aside className="editor-panel">
            <BlockEditor
              block={selectedBlock}
              onChange={(patch) => updateBlock(selectedBlock.id, patch)}
              onDelete={() => deleteBlock(selectedBlock.id)}
              onClose={() => setSelectedId(null)}
            />
          </aside>
        )}
      </div>

      {/* ── Palette Modal ──────────────────────────────────────── */}
      {paletteOpen && (
        <Palette onAdd={addBlock} onClose={() => setPaletteOpen(false)} />
      )}
    </div>
  );
}
