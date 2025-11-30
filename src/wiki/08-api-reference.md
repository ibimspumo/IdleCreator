# API Reference

Technical reference for developers working with the Idle Game Creator codebase.

## GameEngine API

### Constructor

```javascript
const engine = new GameEngine(gameData);
```

**Parameters:**
- `gameData` - Complete game configuration object

**Returns:** GameEngine instance

---

### Lifecycle Methods

#### `start()`
Start the game loop (10 ticks per second).

```javascript
engine.start();
```

**Side effects:**
- Triggers `onGameStart` event
- Begins tick interval (100ms)
- Initializes production calculations

---

#### `stop()`
Stop the game loop.

```javascript
engine.stop();
```

**Side effects:**
- Clears tick interval
- Game state preserved
- Can be restarted with `start()`

---

#### `tick()`
Manually execute a single game tick.

```javascript
engine.tick();
```

**Executes:**
1. `onTick` event trigger
2. Production calculation
3. Achievement checking
4. Upgrade unlock updates
5. Time-based event checks

---

### Resource Methods

#### `addResource(resourceId, amount)`
Add or remove resource amount.

```javascript
engine.addResource('gold', 100);    // Add 100 gold
engine.addResource('gold', -50);    // Remove 50 gold
```

**Parameters:**
- `resourceId` (string) - Resource identifier
- `amount` (number) - Amount to add (negative to subtract)

**Side effects:**
- Updates `gameState.resources[resourceId].amount`
- Updates `total` and `totalProduced`
- Triggers `onResourceFull` if max reached
- Triggers `onResourceEmpty` if zero reached

**Returns:** void

---

#### `removeResource(resourceId, amount)`
Remove resource amount (convenience method).

```javascript
engine.removeResource('gold', 50);
// Equivalent to:
engine.addResource('gold', -50);
```

---

### Building Methods

#### `buyBuilding(buildingId, amount = 1)`
Purchase building(s).

```javascript
engine.buyBuilding('goldMine', 1);    // Buy 1
engine.buyBuilding('goldMine', 10);   // Buy 10
```

**Parameters:**
- `buildingId` (string) - Building identifier
- `amount` (number) - Quantity to purchase (default: 1)

**Validation:**
- Checks sufficient resources
- Respects `maxOwned` limit
- Verifies building unlocked

**Side effects:**
- Deducts costs from resources
- Increments `owned` and `totalBought`
- Triggers `afterBoughtBuilding` event
- Triggers `onBuildingMaxed` if max reached

**Returns:** boolean - Success/failure

---

#### `calculateBuildingCost(building, currentOwned, amount = 1)`
Calculate cost for purchasing building(s).

```javascript
const cost = engine.calculateBuildingCost(building, 5, 10);
// Cost to buy 10 buildings when you already own 5
```

**Parameters:**
- `building` (object) - Building definition
- `currentOwned` (number) - Current ownership count
- `amount` (number) - Quantity to calculate for

**Formula:**
```javascript
totalCost = Σ(baseCost × scaling^(owned + i)) for i = 0 to amount-1
```

**Returns:** object - `{ resourceId: amount }` map

---

### Upgrade Methods

#### `buyUpgrade(upgradeId)`
Purchase upgrade.

```javascript
engine.buyUpgrade('betterClicks');
```

**Parameters:**
- `upgradeId` (string) - Upgrade identifier

**Validation:**
- Checks sufficient resources
- Verifies not already purchased
- Checks unlock requirements

**Side effects:**
- Deducts costs from resources
- Sets `purchased: true`
- Increments `totalUpgradesPurchased`
- Triggers `afterBoughtUpgrade` event
- Applies upgrade effects

**Returns:** boolean - Success/failure

---

### Production Methods

#### `click()`
Manually click primary resource.

```javascript
engine.click();
```

**Side effects:**
- Adds click power to primary resource
- Increments `totalClicks`
- Triggers `onClick` event
- Checks `afterXClicks` counters

**Returns:** void

---

### Prestige Methods

#### `performPrestige()`
Execute prestige reset.

```javascript
engine.performPrestige();
```

**Calculation:**
```javascript
prestigeCurrency = calculateByFormula(totalResources, formula, baseValue)
```

**Side effects:**
- Increments prestige level
- Adds prestige currency
- Triggers `onPrestige` event
- Calls `reset(true)` - preserves prestige data

**Returns:** void

---

### State Methods

#### `exportState()`
Export current game state as JSON string.

```javascript
const stateJson = engine.exportState();
```

**Returns:** string - JSON serialized gameState

---

#### `importState(stateJson)`
Import game state from JSON string.

```javascript
const success = engine.importState(stateJson);
```

**Parameters:**
- `stateJson` (string) - JSON serialized state

**Returns:** boolean - Success/failure

---

#### `reset(keepPrestige = false)`
Reset game state.

```javascript
engine.reset();         // Full reset
engine.reset(true);     // Keep prestige data
```

**Parameters:**
- `keepPrestige` (boolean) - Preserve prestige data

**Side effects:**
- Reinitializes all game state
- Optionally preserves prestige
- Does NOT trigger events

---

## LogicExecutor API

### Constructor

```javascript
const executor = new LogicExecutor(gameEngineInstance);
```

**Parameters:**
- `gameEngineInstance` - Reference to GameEngine

---

### Event Methods

#### `triggerEvent(eventName, context = {})`
Trigger logic event and execute connected nodes.

```javascript
executor.triggerEvent('onGameStart');
executor.triggerEvent('onClick', { resourceId: 'gold' });
```

**Parameters:**
- `eventName` (string) - Event type to trigger
- `context` (object) - Additional event data

**Execution flow:**
1. Find all event nodes matching `eventName`
2. Check event-specific conditions (counters, etc.)
3. Execute connected logic graphs
4. Propagate through actions, conditions, logic nodes

**Returns:** void

---

#### `executeGraphFromNode(nodeId, context = {})`
Execute logic flow starting from specific node.

```javascript
executor.executeGraphFromNode('node_123', { resourceId: 'gold' });
```

**Parameters:**
- `nodeId` (string) - Starting node ID
- `context` (object) - Execution context data

**Returns:** void

---

### Action Execution

Actions are executed via `ActionExecutor` (internal).

**Action types:**
- `addResource` - Add/remove resource
- `setResource` - Set exact amount
- `multiplyResource` - Multiply amount
- `addProduction` - Add flat production
- `multiplyProduction` - Multiply production rate
- `setClickPower` - Change click power
- `unlockBuilding` - Make building available
- `unlockUpgrade` - Make upgrade available
- `unlockAchievement` - Unlock achievement
- `showNotification` - Display message
- `forcePrestige` - Trigger prestige

---

### Condition Execution

Conditions are evaluated via `ConditionExecutor` (internal).

**Condition types:**
- `ifResource` - Compare resource amount
- `ifBuilding` - Compare building count
- `ifUpgradeOwned` - Check upgrade purchased
- `ifAchievementUnlocked` - Check achievement
- `ifProductionRate` - Compare production
- `ifPrestigeLevel` - Compare prestige level
- `ifPlaytime` - Compare playtime
- `ifBuildingOwned` - Check building exists

**Returns:** boolean (determines execution path)

---

### Logic Execution

Logic nodes control flow via `LogicNodeExecutor` (internal).

**Logic types:**
- `delay` - Wait N seconds
- `random` - Random chance branching
- `loop` - Repeat N times
- `branch` - Parallel execution
- `sequence` - Sequential execution

---

## Manager APIs

### ResourceManager

**Methods:**
- `initializeResources(resources)` - Setup resource state
- `addResource(resourceId, amount)` - Modify resource
- `removeResource(resourceId, amount)` - Subtract resource
- `setResource(resourceId, amount)` - Set exact value
- `multiplyResource(resourceId, multiplier)` - Multiply amount
- `resetProduction()` - Clear production bonuses

---

### BuildingManager

**Methods:**
- `initializeBuildings(buildings)` - Setup building state
- `buyBuilding(buildingId, amount)` - Purchase buildings
- `calculateBuildingCost(building, owned, amount)` - Get cost
- `calculateScaledCost(baseCost, scaling, owned, amount)` - Cost formula
- `unlockBuilding(buildingId)` - Make visible

---

### UpgradeManager

**Methods:**
- `initializeUpgrades(upgrades)` - Setup upgrade state
- `buyUpgrade(upgradeId)` - Purchase upgrade
- `updateUnlockedUpgrades()` - Check unlock requirements
- `getTotalMultiplier(resourceId, type)` - Calculate upgrade bonuses
- `getPrestigeMultiplier()` - Calculate prestige bonus
- `checkRequirements(requirements, context)` - Validate requirements

---

### AchievementManager

**Methods:**
- `initializeAchievements(achievements)` - Setup achievement state
- `checkAchievements()` - Evaluate all achievements
- `unlockAchievement(achievementId)` - Manually unlock

---

### ProductionManager

**Methods:**
- `calculateProduction()` - Compute production per tick
- `click()` - Handle resource click
- `checkTimeBasedEvents()` - Trigger timed events
- `setClickPower(amount)` - Override click power
- `addProduction(resourceId, amount)` - Flat production bonus
- `multiplyProduction(resourceId, multiplier)` - Production multiplier

---

## React Hooks

### useLogicEditorState

Manages logic editor nodes and edges.

```javascript
const {
  nodes, setNodes, onNodesChange,
  edges, setEdges, onEdgesChange,
  selectedNodeId, setSelectedNodeId,
  updateNodeData, clearSelection
} = useLogicEditorState(initialNodes, initialEdges);
```

**Returns:**
- `nodes` - Current nodes array
- `setNodes` - Update nodes
- `onNodesChange` - React Flow change handler
- `edges` - Current edges array
- `setEdges` - Update edges
- `onEdgesChange` - React Flow change handler
- `selectedNodeId` - Currently selected node
- `setSelectedNodeId` - Select node
- `updateNodeData` - Update specific node data
- `clearSelection` - Deselect all

---

### useAutoSave

Handles debounced auto-saving.

```javascript
const { saveStatus } = useAutoSave(nodes, edges, gameData, onGameDataChange);
```

**Parameters:**
- `nodes` - Logic nodes array
- `edges` - Logic edges array
- `gameData` - Complete game data
- `onGameDataChange` - Save callback

**Returns:**
- `saveStatus` - 'saving' | 'saved' | 'error'

**Behavior:**
- 5-second debounce
- Triggers on nodes/edges change
- Updates gameData.logic

---

### useNodeOperations

Handles node manipulation operations.

```javascript
const {
  onConnect, onNodeDragStop, onNodesDelete,
  addNodeToGroup, removeNodeFromGroup,
  onPaneClick, onNodeClick, onDragOver, onDrop
} = useNodeOperations(setNodes, setEdges, setSelectedNodeId, onNodeSelect);
```

**Returns:** Event handlers for React Flow

---

### useCodePreview

Generates syntax-highlighted code preview.

```javascript
const {
  showCodePreview, setShowCodePreview,
  toggleCodePreview, codePreview
} = useCodePreview(nodes, edges, gameData);
```

**Returns:**
- `showCodePreview` - Preview visibility state
- `setShowCodePreview` - Toggle visibility
- `toggleCodePreview` - Toggle function
- `codePreview` - Generated HTML code string

---

## Data Structures

### gameData Structure

```javascript
{
  resources: [
    {
      id: 'gold',
      name: 'Gold',
      description: 'Main currency',
      icon: 'data:image/png;base64,...',
      clickPower: 1,
      startAmount: 0,
      maxAmount: Infinity
    }
  ],
  buildings: [
    {
      id: 'goldMine',
      name: 'Gold Mine',
      description: 'Produces gold',
      icon: 'data:image/png;base64,...',
      costs: [
        { resourceId: 'gold', baseAmount: 10 }
      ],
      production: [
        { resourceId: 'gold', amount: 1 }
      ],
      costScaling: 1.15,
      maxOwned: Infinity,
      requirements: []
    }
  ],
  upgrades: [
    {
      id: 'betterClicks',
      name: 'Better Clicks',
      description: 'Double click power',
      icon: 'data:image/png;base64,...',
      costs: [
        { resourceId: 'gold', baseAmount: 100 }
      ],
      effects: [
        {
          type: 'multiply',
          target: 'click',
          resourceId: 'gold',
          value: 2
        }
      ],
      requirements: []
    }
  ],
  achievements: [
    {
      id: 'firstMillion',
      name: 'Millionaire',
      description: 'Earn 1,000,000 gold',
      icon: 'data:image/png;base64,...',
      requirements: [
        {
          type: 'resource',
          resourceId: 'gold',
          amount: 1000000,
          operator: '>='
        }
      ]
    }
  ],
  prestige: {
    formula: 'exponential',
    baseValue: 2,
    currencyName: 'Prestige Points'
  },
  theme: {
    primaryColor: '#4a9eff',
    secondaryColor: '#6bb6ff',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff'
  },
  logic: {
    nodes: [
      {
        id: 'event_123',
        type: 'event',
        position: { x: 100, y: 100 },
        data: { eventType: 'onGameStart' }
      }
    ],
    edges: [
      {
        id: 'edge_123',
        source: 'event_123',
        target: 'action_456',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ]
  }
}
```

---

### gameState Structure

```javascript
{
  resources: {
    gold: {
      amount: 1000,
      total: 5000,
      totalProduced: 4000,
      totalSpent: 3000,
      perSecond: 10,
      maxAmount: Infinity
    }
  },
  buildings: {
    goldMine: {
      owned: 5,
      totalBought: 10,
      totalProduction: 50,
      unlocked: true,
      maxOwned: Infinity
    }
  },
  upgrades: {
    betterClicks: {
      purchased: true,
      unlocked: true
    }
  },
  achievements: {
    firstMillion: {
      unlocked: false,
      progress: 0.5  // 50% complete
    }
  },
  prestige: {
    level: 3,
    currency: 150,
    upgrades: []
  },
  startTime: 1234567890123,
  totalClicks: 1000,
  totalUpgradesPurchased: 5,
  totalBuildingsPurchased: 25,
  totalAchievementsUnlocked: 3,
  eventCounters: {
    'afterXClicks_gold_100': { triggered: true, count: 150 }
  },
  notifications: []
}
```

---

## Node Definition Format

### Event Node

```javascript
export default {
  id: 'onGameStart',
  label: 'On Game Start',
  icon: '🎮',
  description: 'Triggers when game starts',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'onGameStart'
  },
  component: ({ id, data, updateNodeData }) => {
    return <div>Event configuration UI</div>;
  }
};
```

---

### Action Node

```javascript
export default {
  id: 'addResource',
  label: 'Add Resource',
  icon: '➕',
  description: 'Add resource amount',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'addResource',
    resourceId: '',
    amount: 0
  },
  component: ({ id, data, updateNodeData }) => {
    return <div>Action configuration UI</div>;
  }
};
```

---

### Condition Node

```javascript
export default {
  id: 'ifResource',
  label: 'If Resource',
  icon: '❓',
  description: 'Check resource amount',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifResource',
    resourceId: '',
    operator: '>=',
    amount: 0
  },
  component: ({ id, data, updateNodeData }) => {
    return <div>Condition configuration UI</div>;
  }
};
```

---

### Logic Node

```javascript
export default {
  id: 'delay',
  label: 'Delay',
  icon: '⏱️',
  description: 'Wait N seconds',
  category: 'logic',
  type: 'logic',
  defaultData: {
    logicType: 'delay',
    seconds: 1
  },
  component: ({ id, data, updateNodeData }) => {
    return <div>Logic configuration UI</div>;
  }
};
```

---

## Utility Functions

### formatNumber

Format large numbers with suffixes.

```javascript
import { formatNumber } from './utils/formatters';

formatNumber(1000);      // "1K"
formatNumber(1500000);   // "1.5M"
formatNumber(1e12);      // "1T"
```

---

### compressGameData

Compress gameData using LZString.

```javascript
import { compressGameData, decompressGameData } from './utils/compression';

const compressed = compressGameData(gameData);
const decompressed = decompressGameData(compressed);
```

---

## Constants

### Tick Rate
```javascript
const TICK_RATE = 100; // milliseconds
const TICKS_PER_SECOND = 10;
```

### Auto-save Delay
```javascript
const AUTOSAVE_DELAY = 5000; // 5 seconds
```

### Default Theme
```javascript
const DEFAULT_THEME = {
  primaryColor: '#4a9eff',
  secondaryColor: '#6bb6ff',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff'
};
```

---

## Event Types Reference

### Supported Events

| Event | Trigger | Context |
|-------|---------|---------|
| `onGameStart` | Game initialization | - |
| `onTick` | Every 100ms | - |
| `onClick` | Resource click | `{ resourceId }` |
| `afterXClicks` | N clicks reached | `{ resourceId, clickCount }` |
| `afterXSeconds` | Time elapsed | `{ seconds }` |
| `afterXResources` | Resource threshold | `{ resourceId, amount }` |
| `afterBoughtBuilding` | Building purchased | `{ buildingId }` |
| `afterXBuildings` | Building count | `{ buildingId, amount }` |
| `afterBoughtUpgrade` | Upgrade purchased | `{ upgradeId }` |
| `onPrestige` | Prestige triggered | - |
| `onAchievementUnlock` | Achievement unlocked | `{ achievementId }` |
| `onResourceFull` | Max capacity reached | `{ resourceId }` |
| `onResourceEmpty` | Resource depleted | `{ resourceId }` |

---

## Next Steps

- **[Getting Started](01-getting-started.md)** - Begin using the system
- **[Logic System](03-logic-system.md)** - Learn visual programming
- **[Examples & Patterns](06-examples-patterns.md)** - See implementations
