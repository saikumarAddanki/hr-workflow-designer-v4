# HR Workflow Designer

A visual drag-and-drop HR workflow builder built with React + React Flow. Design, configure, and simulate HR workflows like onboarding, leave approvals, and document verification.

## Live Demo
Deploy to Vercel (see below).

---

## Architecture

```
src/
├── api/
│   └── mockApi.ts          # Mock API layer (GET /automations, POST /simulate)
├── components/
│   ├── nodes/
│   │   ├── BaseNode.tsx     # Shared node UI with handles and styling
│   │   └── NodeTypes.tsx    # 5 custom node type components
│   ├── forms/
│   │   └── NodeForm.tsx     # Dynamic config forms for each node type
│   └── panels/
│       ├── Topbar.tsx       # Header with actions (simulate, export, import)
│       ├── Sidebar.tsx      # Draggable node palette
│       ├── PropertiesPanel.tsx # Right panel - shows node form on selection
│       └── SimulationPanel.tsx # Modal sandbox with execution log
├── hooks/
│   ├── useAutomations.ts   # Fetches mock automation actions
│   └── useSimulation.ts    # Handles workflow simulation
├── store/
│   └── workflowStore.ts    # Zustand store - single source of truth
├── types/
│   └── index.ts            # TypeScript interfaces for all node types
└── App.tsx                 # Root layout: Topbar + Sidebar + Canvas + PropertiesPanel
```

### Key Design Decisions

**Zustand over Context/Redux**: Lightweight, no boilerplate, direct store access from any component. Perfect for a graph state that changes frequently.

**Discriminated Union types** (`WorkflowNodeData`): Each node type has its own typed data shape. TypeScript narrows correctly in switch/conditionals — zero type assertions needed.

**Mock API as a real abstraction**: `apiClient` in `mockApi.ts` mirrors how a real REST API would be called (async, returns typed responses). Swapping for a real backend = just change the `fetch` URLs.

**BaseNode pattern**: All 5 node types render through `BaseNode` which handles handles, selection border, color accent, and layout. Node-specific rendering is just `label`, `subtitle`, and `color`.

**Dynamic forms**: `NodeForm.tsx` uses a type switch to render the correct form. Each sub-form is its own component with local `updateNodeData` calls. Adding a new node type = add a new form component + add it to the switch.

---

## Node Types

| Node | Color | Purpose |
|------|-------|---------|
| Start | Green | Entry point — one per workflow |
| Task | Blue | Human task with assignee + due date |
| Approval | Purple | Approval step with role + auto-threshold |
| Automated | Orange | System action from mock API |
| End | Red | Completion with optional summary |

---

## Mock API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/automations` | GET | Returns 6 automation actions with dynamic params |
| `/simulate` | POST | Validates graph structure, BFS traversal, returns step-by-step log |

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## How to Build

```bash
npm run build
# Output in /dist — ready for Vercel
```

---

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts — framework auto-detected as Vite
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — click Deploy

No environment variables required.

---

## Features Completed

- ✅ Drag-and-drop canvas with 5 custom node types
- ✅ Node configuration forms (all fields from spec)
- ✅ Dynamic Automated Step form (params change by action)
- ✅ Mock API layer (`getAutomations`, `simulate`)
- ✅ Workflow simulation with BFS traversal + step log
- ✅ Validation: missing Start/End, disconnected nodes, cycles
- ✅ Export/Import workflow as JSON
- ✅ Delete nodes (Delete key or button)
- ✅ MiniMap + zoom controls
- ✅ Snap-to-grid
- ✅ Zustand state management
- ✅ Full TypeScript with discriminated unions
- ✅ Clean folder structure — modular and scalable

## What I'd Add With More Time

- **Undo/Redo**: Using `useHistoryState` or immer-based patches on the Zustand store
- **Visual validation errors**: Red border on nodes that fail validation (e.g., Task with no title)
- **Auto-layout**: Dagre.js integration for automatic graph layout
- **Node templates**: Pre-built workflows (Onboarding, Leave Approval) you can load
- **Conditional edges**: Edge labels with condition expressions
- **Real backend**: FastAPI + PostgreSQL with workflow persistence
- **Keyboard shortcuts**: Ctrl+Z undo, Ctrl+S save, etc.
- **Drag selection**: Multi-select nodes for bulk delete/move

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tooling
- **React Flow 11** — graph canvas
- **Zustand** — state management
- **Lucide React** — icons

---

Built for Tredence Studio — AI Agents Engineering Frontend Internship 2025.
