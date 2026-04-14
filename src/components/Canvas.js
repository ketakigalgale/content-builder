import React from "react";
import BlockRenderer from "./BlockRenderer";

export default function Canvas({
  blocks,
  selectedId,
  draggingId,
  dragOverId,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDelete,
  onDuplicate,
  onMove,
  onAddBlock,
}) {
  if (blocks.length === 0) {
    return (
      <div className="canvas canvas--empty">
        <div className="empty-state">
          <div className="empty-state__icon">◈</div>
          <h2 className="empty-state__title">Your canvas is empty</h2>
          <p className="empty-state__desc">
            Add your first block to start building your page
          </p>
          <button className="btn btn--primary btn--lg" onClick={onAddBlock}>
            + Add your first block
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas">
      <div className="canvas__inner">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className={[
              "canvas-block-wrapper",
              selectedId === block.id ? "canvas-block-wrapper--selected" : "",
              draggingId === block.id ? "canvas-block-wrapper--dragging" : "",
              dragOverId === block.id && draggingId !== block.id
                ? "canvas-block-wrapper--over"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            draggable
            onDragStart={(e) => onDragStart(e, block.id)}
            onDragOver={(e) => onDragOver(e, block.id)}
            onDrop={(e) => onDrop(e, block.id)}
            onDragEnd={onDragEnd}
            onClick={() => onSelect(block.id)}
          >
            {/* Drag handle */}
            <div className="block-handle" title="Drag to reorder">
              ⋮⋮
            </div>

            {/* Block content */}
            <div className="block-content">
              <BlockRenderer block={block} />
            </div>

            {/* Block toolbar */}
            <div className="block-toolbar">
              <button
                className="block-toolbar__btn"
                title="Move up"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(block.id, -1);
                }}
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                className="block-toolbar__btn"
                title="Move down"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(block.id, 1);
                }}
                disabled={idx === blocks.length - 1}
              >
                ↓
              </button>
              <button
                className="block-toolbar__btn"
                title="Duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(block.id);
                }}
              >
                ⧉
              </button>
              <button
                className="block-toolbar__btn block-toolbar__btn--danger"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(block.id);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* Add block at bottom */}
        <button className="canvas-add-btn" onClick={onAddBlock}>
          <span>+</span> Add Block
        </button>
      </div>
    </div>
  );
}
