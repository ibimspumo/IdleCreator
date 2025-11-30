# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Idle Game Creator is a **no-code visual game development framework** for creating incremental/idle games. The architecture uses a **template-based, auto-loading system** inspired by modular design patterns where components self-register through Vite's `import.meta.glob`.

## Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build
```

## Core Architecture Principles

### 1. Template-Based Auto-Loading System

**Critical Pattern:** New logic nodes, managers, and executors are automatically discovered and loaded via Vite's `import.meta.glob`. No manual registration needed.

**Example - Adding a Logic Node:**
```javascript
// src/components/LogicEditor/nodes/actions/YourAction.jsx
export default {
  id: 'yourAction',           // Unique identifier
  label: 'Your Action',       // Display name
  icon: '🎯',                 // Emoji icon
  description: 'What it does',
  category: 'actions',        // actions|events|conditions|logic
  type: 'action',
  defaultData: {
    actionType: 'yourAction',
    customValue: 100
  },
  component: ({ id, data, updateNodeData }) => {
    // React component for node UI
  }
};
```

**Auto-loader pattern (index.js):**
```javascript
const modules = import.meta.glob('./*.jsx', { eager: true });
export const TYPES = {};
Object.entries(modules).forEach(([path, module]) => {
  if (module.default?.id) {
    TYPES[module.default.id] = module.default;
  }
});
```

### 2. Manager-Based Engine Architecture

`GameEngine.js` (230 lines) orchestrates 5 specialized managers instead of being monolithic:

- **ResourceManager** - Resource operations, production, thresholds
- **BuildingManager** - Purchases, cost scaling, unlocking
- **UpgradeManager** - One-time purchases, multipliers
- **AchievementManager** - Milestone tracking, requirements
- **ProductionManager** - Click handling, passive generation, time-based events

**Pattern:** GameEngine delegates to managers, managers handle domain-specific logic:
```javascript
// In GameEngine.js
addResource(resourceId, amount) {
  return this.resourceManager.addResource(resourceId, amount);
}
```

### 3. Executor-Based Logic System

`LogicExecutor.js` (102 lines) orchestrates 4 specialized executors for the visual node graph system:

- **EventExecutor** - Triggers events (onGameStart, onTick, onClick, etc.)
- **ActionExecutor** - Executes actions (addResource, unlockUpgrade, etc.)
- **ConditionExecutor** - Evaluates conditions (ifResource, ifBuilding, etc.)
- **LogicNodeExecutor** - Flow control (delay, random, loop, branch)

**Pattern:** Visual graph execution flows through event → action/condition → logic chains.

### 4. Hooks-First React Architecture

Large components are broken down into custom hooks. Example: `LogicEditor.jsx` (210 lines) uses:

- `useLogicEditorState` - Nodes, edges, selection state
- `useAutoSave` - 5-second debounced auto-save to gameData
- `useNodeOperations` - Add, delete, drag, group operations
- `useCodePreview` - Generate syntax-highlighted pseudo-code

**Pattern:** Keep components under 300 lines by extracting logic into hooks.

## Key Data Flow

### Game Data Structure (GameDataContext)

The entire game configuration lives in `GameDataContext`:

```javascript
{
  resources: [],      // Resource definitions (coins, gems, etc.)
  buildings: [],      // Building definitions (production units)
  upgrades: [],       // One-time upgrade definitions
  achievements: [],   // Achievement definitions
  prestige: {},       // Prestige configuration
  theme: {},          // Visual theme (colors, fonts)
  logic: {            // Visual logic graph
    nodes: [],        // Logic nodes
    edges: []         // Connections between nodes
  }
}
```

### Game State (GameEngine.gameState)

Runtime state managed by GameEngine:

```javascript
{
  resources: {        // Runtime resource amounts
    [id]: {
      amount: 0,
      total: 0,
      perSecond: 0,
      totalProduced: 0,
      totalSpent: 0
    }
  },
  buildings: {        // Runtime building counts
    [id]: { owned: 0, totalBought: 0, unlocked: false }
  },
  upgrades: {         // Runtime upgrade status
    [id]: { purchased: false, unlocked: false }
  },
  achievements: {     // Runtime achievement progress
    [id]: { unlocked: false, progress: 0 }
  },
  prestige: {         // Prestige state
    level: 0,
    currency: 0
  },
  // Event tracking
  totalClicks: 0,
  eventCounters: {},
  notifications: []
}
```

**Important:** `gameData` = configuration (what's possible), `gameState` = runtime (what's happening now).

## File Size Constraints

**Maximum file size: 300 lines** (current max: 243 lines in GamePlayer.jsx)

When a file approaches 300 lines:
1. Extract hooks for state/logic
2. Create shared components for UI
3. Create managers/executors for domain logic
4. Use template-based auto-loading for repetitive patterns

## Logic Node System Deep Dive

### Node Categories

- **Events** (19 nodes) - Entry points: `onGameStart`, `onTick`, `onClick`, `afterXClicks`, etc.
- **Actions** (12 nodes) - State mutations: `addResource`, `unlockUpgrade`, `showNotification`, etc.
- **Conditions** (8 nodes) - Branching: `ifResource`, `ifBuilding`, `ifUpgradeOwned`, etc.
- **Logic** (5 nodes) - Flow control: `delay`, `random`, `loop`, `branch`, `sequence`

### Adding Execution Logic for New Nodes

After creating a node template, add execution in the corresponding executor:

```javascript
// src/engine/executors/ActionExecutor.js
executeAction(node, context) {
  const { data } = node;
  switch (data.actionType) {
    case 'yourAction':
      // Implement action logic here
      console.log('Executing with:', data.customValue);
      break;
  }
}
```

### Adding Code Preview for New Nodes

```javascript
// src/utils/codePreview/generators/ActionGenerator.js
generate(data) {
  switch (data.actionType) {
    case 'yourAction':
      return `${HtmlFormatter.keyword('perform')} custom action (${HtmlFormatter.number(data.customValue)})`;
  }
}
```

## Common Patterns

### Shared Property Components

Located in `src/components/Editor/properties/shared/`:

- **BasePropertiesPanel** - Common fields (id, name, description, icon)
- **CostBuilder** - Reusable cost array builder
- **EffectBuilder** - Reusable effect array builder
- **FormField** - Generic input/textarea component
- **IconField** - Pixel art icon selector

**Pattern:** Use shared components in property panels to reduce duplication.

### Game Player Panels

`GamePlayer.jsx` delegates rendering to modular panels in `src/components/Player/panels/`:

- `BuildingsPanel.jsx` - Buildings purchase UI
- `UpgradesPanel.jsx` - Upgrades purchase UI
- `AchievementsPanel.jsx` - Achievement progress UI
- `StatsPanel.jsx` - Game statistics display
- `PrestigePanel.jsx` - Prestige system UI

Each panel uses card components from `src/components/Player/components/` (BuildingCard, UpgradeCard, etc.).

## Testing During Development

**Manual testing workflow:**
1. Start dev server: `npm run dev`
2. Open browser to http://localhost:5173
3. Create test game elements in Editor
4. Switch to Player tab to verify runtime behavior
5. Check Logic tab for visual programming
6. Test export/import in Settings

**Build verification:**
```bash
npm run build        # Must complete without errors
npm run preview      # Verify production build works
```

## Important Implementation Notes

### Don't Break Auto-Loading

When creating new logic nodes, managers, or executors:
- **Always** use `export default` for node definitions
- **Always** include an `id` field in the exported object
- **Never** manually register in a central file - let `import.meta.glob` discover it
- **Follow** the exact folder structure: `nodes/actions/*.jsx`, `nodes/events/*.jsx`, etc.

### React Flow Integration

Logic editor uses React Flow:
- Nodes have `id`, `type`, `position`, `data` properties
- Edges connect nodes via `source`, `target`, `sourceHandle`, `targetHandle`
- Use `.nodrag` className on interactive elements inside nodes to prevent dragging
- `updateNodeData(nodeId, newData)` updates node data without recreating the node

### State Management

- **GameDataContext** - For game configuration (shared across Editor/Player/Logic)
- **GameEngine.gameState** - For runtime state (managed by GameEngine instance)
- **Auto-save** - LogicEditor auto-saves logic graph to gameData every 5 seconds (debounced)

### Performance Considerations

- Tick rate: 100ms (10 ticks/second) - balance between responsiveness and CPU
- Auto-save debounce: 5 seconds - prevents excessive localStorage writes
- React Flow virtualization handles 100+ nodes efficiently
- LZString compression reduces save data ~70%

## Common Development Tasks

### Adding a New Game Element Type

1. Add to `GameDataContext` default structure
2. Create property panel in `src/components/Editor/properties/`
3. Add manager in `src/engine/managers/` (if needs runtime logic)
4. Add layer section in `GameEditor.jsx`
5. Add panel in `GamePlayer.jsx` (for runtime display)
6. Update relevant executors if needs logic node support

### Modifying Game Mechanics

**Cost Scaling:**
- Handled in `BuildingManager.calculateBuildingCost()`
- Formula: `baseCost * (scaling ** owned)`

**Production Calculation:**
- Handled in `ProductionManager.calculateProduction()`
- Runs every tick (100ms)
- Applies building production + upgrade multipliers

**Prestige:**
- Triggered via `GameEngine.performPrestige()`
- Resets game state but preserves `gameState.prestige`
- Fires `onPrestige` logic event

## Code Style Conventions

```javascript
// File naming
components/     → PascalCase.jsx     (GameEditor.jsx)
utils/          → camelCase.js       (formatters.js)
hooks/          → useName.js         (useGameData.js)
styles/         → kebab-case.css     (logic-editor.css)

// React patterns
- Prefer functional components with hooks
- Extract logic into custom hooks when component >200 lines
- Use useMemo/useCallback for expensive operations
- Destructure props in function signature

// State updates
- Use functional setState when depending on previous state
- Batch related state updates when possible
- Prefer immutable updates (spread operator)
```

## Debugging Tips

**Logic Graph Not Executing:**
- Check that edges connect properly (inspect `gameData.logic.edges`)
- Verify event is being triggered (add console.log in EventExecutor)
- Check node data has correct `actionType`/`eventType`/etc.

**Auto-Save Not Working:**
- Check 5-second debounce timer hasn't been interrupted
- Verify `onGameDataChange` callback is being called
- Check browser console for errors

**New Node Not Appearing:**
- Verify file is in correct directory (`nodes/actions/`, `nodes/events/`, etc.)
- Ensure `export default` with `id` field
- Check browser console for import errors
- Restart dev server if using HMR

## Wiki Documentation Maintenance

**CRITICAL:** After making changes to the codebase, **always review and update the Wiki documentation** located in `src/wiki/`.

### Wiki Structure

The wiki contains 9 comprehensive markdown files:

1. **00-overview.md** - Wiki navigation and learning paths
2. **01-getting-started.md** - Quick start guide for new users
3. **02-game-elements.md** - Resources, buildings, upgrades, achievements
4. **03-logic-system.md** - Complete logic node reference (19 events, 12 actions, 8 conditions, 5 logic)
5. **04-advanced-features.md** - Prestige, production mechanics, optimization
6. **05-export-share.md** - Save/load system, sharing, backups
7. **06-examples-patterns.md** - Real-world logic patterns and complete games
8. **07-troubleshooting.md** - Common issues and debugging
9. **08-api-reference.md** - Technical API documentation

### When to Update Wiki

**Always update after:**
- ✅ Adding new logic nodes (update 03-logic-system.md and 08-api-reference.md)
- ✅ Modifying game mechanics (update 02-game-elements.md and 04-advanced-features.md)
- ✅ Changing API methods (update 08-api-reference.md)
- ✅ Adding new features (update relevant sections and 00-overview.md)
- ✅ Fixing bugs (add to 07-troubleshooting.md if user-facing)
- ✅ Changing data structures (update 08-api-reference.md)

**Review and verify:**
- Code examples still work
- Screenshots/diagrams still accurate (if added in future)
- Cross-references between pages are correct
- New features have examples in 06-examples-patterns.md

### Wiki Update Checklist

When making code changes:

```markdown
- [ ] Identify which wiki pages are affected
- [ ] Update code examples to match new implementation
- [ ] Add new features to appropriate sections
- [ ] Update API reference if methods/parameters changed
- [ ] Add troubleshooting entries for known issues
- [ ] Update examples if patterns changed
- [ ] Verify cross-references still work
- [ ] Test all code examples in wiki
```

### Wiki Conventions

**Code examples:**
- Must be tested and working
- Use realistic variable names
- Include context/explanation
- Show both simple and complex usage

**Logic flow examples:**
```
Event → Action → Condition
  ✓ → True path
  ✗ → False path
```

**Internal links:**
```markdown
[Link Text](relative-file.md)
[Link with Anchor](file.md#section-name)
```

### Auto-Loading System in Wiki

The wiki system uses `import.meta.glob` to auto-discover all `.md` files in `src/wiki/`:

```javascript
// WikiPage.jsx
const markdownFiles = import.meta.glob('../wiki/*.md', { as: 'raw', eager: true });

// WikiSidebar.jsx
const markdownFilesContext = import.meta.glob('../wiki/*.md', { eager: true });
```

**Important:** New wiki files are automatically discovered. Just add `.md` files to `src/wiki/` and they appear in the sidebar.

### Common Wiki Update Scenarios

**New Logic Node Added:**
1. Update `03-logic-system.md` - Add node to appropriate category section
2. Update `08-api-reference.md` - Add to node types reference
3. Update `06-examples-patterns.md` - Add example usage pattern
4. Update `00-overview.md` - Increment node count if needed

**Game Mechanic Changed:**
1. Update `02-game-elements.md` - Document new behavior
2. Update `04-advanced-features.md` - Explain advanced usage
3. Update `06-examples-patterns.md` - Update affected examples
4. Update `07-troubleshooting.md` - Add potential issues

**API Method Modified:**
1. Update `08-api-reference.md` - Update method signature and description
2. Update code examples throughout wiki using that method
3. Add migration notes if breaking change

**New Feature Added:**
1. Determine primary wiki page for feature
2. Add comprehensive documentation
3. Add examples to `06-examples-patterns.md`
4. Add to `00-overview.md` navigation
5. Cross-link from related pages

## Architecture References

See `REFACTORING_PLAN.md` for detailed refactoring history and architectural decisions that shaped the current modular structure.

See `README.md` for complete API reference, performance benchmarks, and contribution guidelines.

See `src/wiki/` for complete user documentation (automatically loaded in the Wiki tab).
