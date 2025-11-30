# Logic System Test Guide

## How the Logic System Works

### Data Flow:
```
Visual Editor (LogicEditor.jsx)
  → gameData.logic { nodes: [], edges: [] }
    → Auto-saved to localStorage every 5 seconds
      → GameEngine reads gameData.logic
        → LogicExecutor builds nodeMap and edgeMap
          → Events trigger → Graph executes → Actions run
```

### Test Scenario 1: Welcome Bonus

**Setup in Logic Editor:**
1. You should already have an `onGameStart` event node
2. Add an `Add Resource` action node
3. Configure it to add 100 gold
4. Connect: `onGameStart` → `Add Resource`
5. Wait 5 seconds for auto-save (check green "Saved" indicator)

**Test in Player:**
1. Switch to Player tab
2. You should start with 100 gold (from onGameStart)
3. If not, check browser console for errors

### Test Scenario 2: Click Bonus

**Setup in Logic Editor:**
1. Add `onClick` event node
2. Configure it for your gold resource
3. Add `Show Notification` action node
4. Set message: "Clicked!"
5. Connect: `onClick` → `Show Notification`
6. Wait for auto-save

**Test in Player:**
1. Switch to Player tab
2. Click the gold resource
3. You should see "Clicked!" notification
4. If not, open browser console (F12) and check for errors

### Debugging Steps

**1. Check if logic is saved:**
```javascript
// In browser console (F12):
const data = JSON.parse(localStorage.getItem('idleGameData'));
console.log('Logic nodes:', data.logic.nodes);
console.log('Logic edges:', data.logic.edges);
```

**2. Check if GameEngine loads logic:**
```javascript
// Add console.log to GameEngine.js constructor (line 30):
console.log('LogicExecutor initialized with logic:', this.logicExecutor.logic);
```

**3. Check if events trigger:**
```javascript
// Add console.log to EventExecutor.js triggerEvent (line 15):
console.log('Triggering event:', eventName, 'Found nodes:', eventNodes.length);
```

**4. Check if actions execute:**
```javascript
// Add console.log to ActionExecutor.js executeAction (line 17):
console.log('Executing action:', data.actionType, 'with data:', data);
```

### Common Issues

**Issue: Logic doesn't run after import**
- **Cause:** gameData.logic is empty or not loaded
- **Fix:**
  1. Check if export includes logic: Look for `logic: {nodes: [], edges: []}` in exported JSON
  2. Make sure to wait for auto-save before exporting
  3. Try manual save (make any change, wait 5 seconds)

**Issue: onGameStart doesn't trigger**
- **Cause:** Event only triggers once on engine initialization
- **Fix:**
  1. Reload Player tab to restart engine
  2. Or add console.log to verify it's running
  3. Check if node is connected to actions

**Issue: Events trigger but nothing happens**
- **Cause:** Edges not properly connected
- **Fix:**
  1. Check that edges connect output of event to input of action
  2. Verify edge color (green = valid, red = invalid)
  3. Check node configuration (resourceId, amount, etc.)

### Manual Trigger Test

To manually test an event from browser console:

```javascript
// Get the game engine instance (set breakpoint in GamePlayer.jsx)
// Or expose it globally for testing:

// In GamePlayer.jsx, add after line 21:
window.testEngine = gameEngine;

// Then in console:
window.testEngine.logicExecutor.triggerEvent('onGameStart');
window.testEngine.logicExecutor.triggerEvent('onClick', { resourceId: 'gold' });
```

### Verify Logic Structure

**Expected gameData.logic structure:**
```javascript
{
  logic: {
    nodes: [
      {
        id: "event_1234567890",
        type: "event",
        position: { x: 250, y: 50 },
        data: { eventType: "onGameStart" }
      },
      {
        id: "action_1234567891",
        type: "action",
        position: { x: 500, y: 50 },
        data: {
          actionType: "addResource",
          resourceId: "gold",
          amount: 100
        }
      }
    ],
    edges: [
      {
        id: "edge_1234567892",
        source: "event_1234567890",
        target: "action_1234567891",
        sourceHandle: "output",
        targetHandle: "input"
      }
    ]
  }
}
```

### Success Checklist

- [ ] Logic nodes visible in Logic Editor
- [ ] Edges connect nodes
- [ ] Auto-save shows "Saved" (green dot)
- [ ] Export contains logic data
- [ ] Player tab loads without errors
- [ ] Events trigger (test with notification action)
- [ ] Actions execute (resources change, etc.)
- [ ] Console shows no errors

If all checkboxes pass, the system works correctly!
