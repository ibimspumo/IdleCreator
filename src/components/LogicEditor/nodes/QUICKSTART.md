# Quick Start: Adding a New Logic Node

## 🎯 TL;DR

1. Copy an existing node file from the same category
2. Change the `id`, `label`, `icon`, and `description`
3. Update `defaultData` with your fields
4. Customize the `component` (or remove it if no properties needed)
5. Save and refresh - Done! ✨

## 📝 Example: Adding "On Player Death" Event

### Step 1: Copy Template

```bash
cd src/components/LogicEditor/nodes/events
cp OnGameStart.jsx OnPlayerDeath.jsx
```

### Step 2: Edit the File

```jsx
// OnPlayerDeath.jsx
export default {
  id: 'onPlayerDeath',                    // ✏️ Change this
  label: 'On Player Death',              // ✏️ Change this
  icon: '💀',                             // ✏️ Change this
  description: 'When player dies',       // ✏️ Change this
  category: 'events',                    // ✅ Keep as-is
  type: 'event',                         // ✅ Keep as-is
  defaultData: {
    eventType: 'onPlayerDeath'           // ✏️ Change this
  }
  // No component needed for simple events
};
```

### Step 3: Save & Refresh

That's it! Your new node will automatically appear in the toolbox under **Events**.

## 🎨 Add Properties (Optional)

If your node needs configuration (like amounts, targets, etc.):

```jsx
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'onPlayerDeath',
  label: 'On Player Death',
  icon: '💀',
  description: 'When player dies',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'onPlayerDeath',
    lives: 3                              // ✨ Add default value
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Lives Lost:</label>
        <input
          className="nodrag"               // ⚠️ Required!
          type="number"
          name="lives"                    // ✏️ Must match defaultData key
          value={data.lives || 3}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
```

## 🔗 With Game Data (Dropdowns)

Need to select from resources, buildings, etc.?

```jsx
import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'onPlayerDeath',
  label: 'On Player Death',
  icon: '💀',
  description: 'When player dies',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'onPlayerDeath',
    resourceLost: ''                      // ✨ Resource to lose
  },
  component: ({ id, data, updateNodeData }) => {
    const { gameData } = useContext(GameDataContext);
    const resources = gameData?.resources || [];
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Resource Lost:</label>
        <select
          className="nodrag"               // ⚠️ Required!
          name="resourceLost"
          value={data.resourceLost || ''}
          onChange={handleChange}
        >
          {resources.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </>
    );
  }
};
```

## 📂 Categories

| Folder | Purpose | Examples |
|--------|---------|----------|
| `events/` | Game triggers | OnGameStart, AfterXClicks |
| `actions/` | Do something | AddResource, ShowNotification |
| `conditions/` | If/else logic | IfResource, IfBuilding |
| `logic/` | Flow control | Delay, Random, Loop |

## ⚠️ Important Rules

1. **Always use `className="nodrag"`** on inputs/selects
2. **Match the category** - file folder must match `category` field
3. **Unique IDs** - no two nodes can have the same `id`
4. **Export default** - always `export default { ... }`

## 🐛 Common Mistakes

### ❌ Forgot `className="nodrag"`
```jsx
<input type="text" name="message" ... />  // Will break dragging!
```

### ✅ Correct
```jsx
<input className="nodrag" type="text" name="message" ... />
```

### ❌ Wrong category
```jsx
// File: events/MyAction.jsx
category: 'actions'  // Should be 'events'!
```

### ✅ Correct
```jsx
// File: events/MyEvent.jsx
category: 'events'
```

## 🚀 Pro Tips

- **Copy similar nodes** - Easiest way to start
- **Test immediately** - Save and refresh to see it work
- **Check console** - Errors will show up there
- **Keep it simple** - Start with no properties, add later

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation and advanced patterns.

---

**Ready? Go add your first node!** 🎉
