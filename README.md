# PageCraft — Dynamic Content Builder

> **Frontend Developer Intern Assignment 3** — A drag-and-drop personal page builder built with React.

## Live Demo
https://content-builder-omega.vercel.app/

---

## What is PageCraft?

PageCraft is a web application where users can visually compose a personal content page by dragging, dropping, and customising modular content blocks. Think of it as a lite Notion/Framer hybrid — built entirely in React with zero external UI dependencies.

---

## Features

### Content Blocks (Palette)
| Block | Description |
|-------|-------------|
| **Heading** | H1–H4 levels, editable text |
| **Rich Text** | Multi-line paragraph block |
| **Image** | URL-based image with alt text + caption |
| **Markdown** | Write Markdown, preview rendered HTML |
| **Blockquote** | Styled quote with author attribution |
| **Divider** | Visual separator (solid / dashed / dotted / double) |

### Canvas Interactions
- **Drag-and-drop reordering** — native HTML5 Drag & Drop API
- **Up/Down arrow buttons** — keyboard-accessible reordering
- **Duplicate block** — clone any block in place
- **Delete block** — remove with confirmation
- **Click to select** — opens the editor panel

### Configuration Panel
Each block type has a dedicated editor with context-appropriate controls:
- Segmented controls (heading level, divider style)
- Text inputs and textareas
- Markdown editor with live preview tab
- Image URL with inline preview

### Persistence
All block data (content + order) is automatically saved to **localStorage** under the key `dcb_blocks` after every change. The page state is fully restored on page refresh — no server required.

---

## UI/UX Design Choices

### Typography
- **Fraunces** (serif, variable) — display headings, logo, quote blocks. Creates editorial warmth.
- **DM Sans** — body text, UI labels. Clean and highly legible.
- **DM Mono** — code blocks, markdown editor.

### Color
A warm neutral canvas (`#f6f5f3`) with an indigo accent (`#6366f1`) creates a professional yet inviting feel. Semantic red for destructive actions. All colors are CSS custom properties for easy theming.

### Interactions
- Canvas blocks reveal their controls (drag handle, action toolbar) only on hover — keeps the canvas clean.
- The palette opens as a modal with a backdrop blur + spring animation.
- The editor panel slides in from the right.
- Drag targets show dashed indigo borders with a slight scale transform.
- Dragging blocks renders them semi-transparent so the target location stays clear.

---

## Architecture & State Management

```
src/
├── App.js                 # Root state + drag logic
├── hooks/
│   └── useLocalStorage.js # Persistence hook
├── components/
│   ├── Palette.js         # Block type picker modal
│   ├── Canvas.js          # Drop zone + block list
│   ├── BlockRenderer.js   # Renders each block type
│   └── BlockEditor.js     # Config panel per block type
├── utils/
│   └── markdown.js        # Lightweight MD → HTML parser
└── styles/
    └── App.css            # Design system + all styles
```

### State Strategy
All block data lives in a single `blocks` array in `App.js` (top-level state). This array is:
1. Initialised from `localStorage` via the `useLocalStorage` hook.
2. Persisted on every state change via a `useEffect` inside the hook.
3. Passed down to `Canvas` and `BlockEditor` via props.
4. Modified only through pure callbacks (`addBlock`, `updateBlock`, `deleteBlock`, `duplicateBlock`, `moveBlock`) defined in `App.js`.

This single-source-of-truth approach with unidirectional data flow makes the state predictable and easy to debug.

### Drag-and-Drop
Uses the native **HTML5 Drag & Drop API** — no third-party library needed:
- `draggable="true"` on each block wrapper
- `onDragStart` records the source index in a `useRef`
- `onDragOver` sets the visual drop target
- `onDrop` splices the array to reorder
- `onDragEnd` clears all drag state
- Edge cases handled: same-slot drops are no-ops, `dragSrcIdx` resets on `dragEnd`.

### Persistence
```js
// hooks/useLocalStorage.js
const [state, setState] = useState(() => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initialValue;
});

useEffect(() => {
  localStorage.setItem(key, JSON.stringify(state));
}, [key, state]);
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/content-builder.git
cd content-builder

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# → Opens http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output in /build folder — deploy to Vercel, Netlify, or any static host
```

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
# Follow prompts — live URL in ~30 seconds
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 | Hooks-based, component model fits block architecture |
| State | useState + useLocalStorage | No redux needed for this scope |
| Styling | Pure CSS (custom properties) | Full control, no class conflicts, easy theming |
| Fonts | Google Fonts (Fraunces + DM Sans) | Distinctive, editorial feel |
| Drag & Drop | HTML5 native API | Zero dependencies, sufficient for vertical lists |
| Persistence | localStorage | Zero-config, works offline |
| IDs | uuid v4 | Collision-proof block identifiers |
| Bundler | Create React App | Zero-config setup |

---

## Screenshots

<img width="1920" height="1080" alt="Screenshot (1335)" src="https://github.com/user-attachments/assets/2f031526-ccea-45a7-92a4-ae671cd876f5" />
<img width="1920" height="1080" alt="Screenshot (1334)" src="https://github.com/user-attachments/assets/14b2eca6-c55d-47e7-bee2-3269e53e7bd0" />


---

## Author
Ketaki Galgale — Frontend Developer Intern Assignment
