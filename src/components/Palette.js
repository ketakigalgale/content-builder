import React from "react";
import { BLOCK_TYPES } from "../constants/blockTypes";

const PALETTE_ITEMS = [
  { type: BLOCK_TYPES.HEADER, label: "Heading" },
  { type: BLOCK_TYPES.TEXT, label: "Text" },
  { type: BLOCK_TYPES.IMAGE, label: "Image" },
];

export default function Palette({ onAdd, onClose }) {
  return (
    <div>
      <h2>Add Block</h2>
      {PALETTE_ITEMS.map((item) => (
        <button key={item.type} onClick={() => onAdd(item.type)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
