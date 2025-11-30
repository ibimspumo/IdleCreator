# Logic Node System - Developer Guide

This directory contains the new dynamic, template-based node system for the Logic Flow Editor.

## 📁 Directory Structure

```
nodes/
├── base/                       # Base templates for each node type
│   ├── BaseEventNode.jsx
│   ├── BaseActionNode.jsx
│   ├── BaseConditionNode.jsx
│   └── BaseLogicNode.jsx
├── events/                     # All event node definitions
│   ├── index.js               # Auto-loader
│   ├── OnGameStart.jsx
│   ├── AfterXClicks.jsx
│   └── ...
├── actions/                    # All action node definitions
│   ├── index.js               # Auto-loader
│   ├── AddResource.jsx
│   ├── UnlockUpgrade.jsx
│   └── ...
├── conditions/                 # All condition node definitions
│   ├── index.js               # Auto-loader
│   ├── IfResource.jsx
│   └── ...
├── logic/                      # All logic node definitions
│   ├── index.js               # Auto-loader
│   ├── Delay.jsx
│   └── ...
├── EventNodeWrapper.jsx        # Wrapper component for events
├── ActionNodeWrapper.jsx       # Wrapper component for actions
├── ConditionNodeWrapper.jsx    # Wrapper component for conditions
├── LogicNodeWrapper.jsx        # Wrapper component for logic
├── GroupNode.jsx              # Group node (visual organization)
└── README.md                  # This file
```

## 🚀 How to Add a New Node

### Step 1: Choose the Category

Determine which category your node belongs to:
- **events/** - Triggers for game events (when something happens)
- **actions/** - Actions to perform (do something)
- **conditions/** - Conditional logic (if/else branches)
- **logic/** - Flow control (delay, random, loops)

### Step 2: Copy the Template

Each category has a base template in the `base/` folder. Look at existing nodes in your category for examples.

### Step 3: Create Your Node File

Create a new file in the appropriate category folder:

**Example: `events/OnPlayerLevelUp.jsx`**

```jsx
import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  // Unique identifier (camelCase)
  id: 'onPlayerLevelUp',

  // Display name (shown in toolbox and dropdowns)
  label: 'On Player Level Up',

  // Icon (emoji or icon)
  icon: '⬆️',

  // Short description (shown in toolbox)
  description: 'When player levels up',

  // Category (must match folder name)
  category: 'events',

  // Node type
  type: 'event',

  // Default data when node is created
  defaultData: {
    eventType: 'onPlayerLevelUp',
    targetLevel: 1
  },

  // Optional: Properties component (if node needs configuration)
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Target Level:</label>
        <input
          className="nodrag"
          type="number"
          name="targetLevel"
          value={data.targetLevel || 1}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
```

### Step 4: That's It!

The node will be **automatically loaded** thanks to the auto-loader system. No need to:
- ❌ Import it manually
- ❌ Add it to any registry
- ❌ Update any configuration files

Just refresh the app and your node will appear in the toolbox!

## 📋 Node Definition Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (camelCase) |
| `label` | string | Display name |
| `icon` | string | Icon (emoji recommended) |
| `description` | string | Short description for toolbox |
| `category` | string | Must match folder: 'events', 'actions', 'conditions', or 'logic' |
| `type` | string | Node type: 'event', 'action', 'condition', or 'logic' |
| `defaultData` | object | Default values when node is created |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `component` | React Component | Properties UI for configuring the node |

## 🎨 Component Patterns

### Simple Node (No Properties)

```jsx
export default {
  id: 'onGameStart',
  label: 'On Game Start',
  icon: '🎮',
  description: 'When game starts',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'onGameStart'
  }
  // No component needed
};
```

### Node with Input Fields

```jsx
component: ({ id, data, updateNodeData }) => {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <>
      <label>Amount:</label>
      <input
        className="nodrag"
        type="number"
        name="amount"
        value={data.amount || 0}
        onChange={handleChange}
      />
    </>
  );
}
```

### Node with Dropdown (Select from Game Data)

```jsx
component: ({ id, data, updateNodeData }) => {
  const { gameData } = useContext(GameDataContext);
  const resources = gameData?.resources || [];
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <>
      <label>Resource:</label>
      <select
        className="nodrag"
        name="resourceId"
        value={data.resourceId || ''}
        onChange={handleChange}
      >
        {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
    </>
  );
}
```

### Node with Checkbox

```jsx
component: ({ id, data, updateNodeData }) => {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <>
      <label>
        <input
          className="nodrag"
          type="checkbox"
          name="repeat"
          checked={data.repeat || false}
          onChange={(e) => handleChange({ target: { name: 'repeat', value: e.target.checked } })}
        />
        Repeat Event
      </label>
    </>
  );
}
```

## 🔧 Important Notes

### Always Use `className="nodrag"`

All interactive elements (inputs, selects, buttons) must have `className="nodrag"` to prevent dragging conflicts with ReactFlow.

### Use NodeDataUpdater Helper

Always use the `NodeDataUpdater` helper for handling form changes:

```jsx
const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
```

### Access Game Data

To access resources, buildings, upgrades, etc.:

```jsx
const { gameData } = useContext(GameDataContext);
const resources = gameData?.resources || [];
```

## 🧪 Testing Your Node

1. **Refresh the app** - The node should appear in the toolbox
2. **Drag to canvas** - Verify it renders correctly
3. **Edit properties** - Check that all inputs work
4. **Save and reload** - Ensure data persists
5. **Test in game** - Verify the logic executes correctly

## 🎯 Best Practices

### ✅ DO

- Use descriptive, clear labels
- Add helpful descriptions
- Use emojis for icons (better cross-platform)
- Keep component code simple
- Test thoroughly before committing

### ❌ DON'T

- Don't modify the auto-loader files (`index.js`)
- Don't import nodes manually elsewhere
- Don't forget `className="nodrag"` on inputs
- Don't use complex logic in components
- Don't hardcode values that should be configurable

## 🐛 Troubleshooting

### Node doesn't appear in toolbox

- Check that the file is in the correct folder
- Verify the file exports `default`
- Ensure `category` matches the folder name
- Check console for import errors

### Node appears but doesn't work

- Verify `defaultData` has all required fields
- Check that `type` matches the category
- Ensure `component` function signature is correct
- Look for console errors

### Properties don't update

- Confirm you're using `NodeDataUpdater`
- Check that `name` attribute matches the data field
- Verify `updateNodeData` is being called

## 📚 Examples

See existing nodes in each category for working examples:
- **Simple**: `events/OnGameStart.jsx`
- **With Input**: `events/AfterXClicks.jsx`
- **With Dropdown**: `actions/AddResource.jsx`
- **Complex**: `conditions/IfResource.jsx`

## 🚧 Future Enhancements

Potential improvements to this system:
- [ ] Hot reload support
- [ ] Node validation
- [ ] Custom node types from plugins
- [ ] Visual node builder UI
- [ ] Node templates generator
- [ ] Community node marketplace

---

**Happy Node Building!** 🎉
