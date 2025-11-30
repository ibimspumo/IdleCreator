# Logic System - Complete Technical Explanation

## ✅ Das Logic System IST vollständig implementiert und funktionsfähig!

Wenn es bei dir nicht funktioniert, liegt es wahrscheinlich an einem der folgenden Probleme:

1. Logic wurde nicht gespeichert vor dem Export
2. gameData.logic ist leer
3. Nodes sind nicht richtig verbunden
4. Browser-Console zeigt Fehler

## 🔄 Wie das System funktioniert

### 1. Visual Flow Creation (Logic Editor)

**Datei:** `src/components/LogicEditor/LogicEditor.jsx`

```javascript
// Wenn du Nodes und Edges im Editor erstellst:
const nodes = [
  {
    id: 'event_123',
    type: 'event',
    position: { x: 100, y: 50 },
    data: { eventType: 'onGameStart' }
  },
  {
    id: 'action_456',
    type: 'action',
    position: { x: 400, y: 50 },
    data: {
      actionType: 'addResource',
      resourceId: 'gold',
      amount: 100
    }
  }
];

const edges = [
  {
    id: 'edge_789',
    source: 'event_123',
    target: 'action_456'
  }
];
```

Diese Struktur wird nach **5 Sekunden** automatisch in `gameData.logic` gespeichert:

```javascript
gameData.logic = { nodes, edges };
```

### 2. Data Storage (Auto-Save)

**Datei:** `src/components/LogicEditor/hooks/useAutoSave.js`

```javascript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onGameDataChange({
      ...gameData,
      logic: { nodes, edges }  // ← Hier wird die Logic gespeichert!
    });
  }, 5000);  // 5 Sekunden Debounce
}, [nodes, edges]);
```

**Wichtig:** Warte mindestens 5 Sekunden nach der letzten Änderung, bevor du exportierst!

### 3. Game Engine Initialization

**Datei:** `src/engine/GameEngine.js`

```javascript
// Zeile 6-15
import { LogicExecutor } from './LogicExecutor.js';

constructor(gameData) {
  this.gameData = gameData;
  // ...

  // Initialize Logic Executor
  this.logicExecutor = new LogicExecutor(this);  // ← Erstellt LogicExecutor
}
```

### 4. Logic Executor Setup

**Datei:** `src/engine/LogicExecutor.js`

```javascript
// Zeile 12-26
constructor(gameEngineInstance) {
  this.game = gameEngineInstance;
  this.logic = this.game.gameData.logic || { nodes: [], edges: [] };  // ← Lädt Logic!
  this.nodeMap = new Map(this.logic.nodes.map(node => [node.id, node]));
  this.edgeMap = new Map();

  // Build edge map für schnelles Lookup
  for (const edge of this.logic.edges) {
    if (!this.edgeMap.has(edge.source)) {
      this.edgeMap.set(edge.source, []);
    }
    this.edgeMap.get(edge.source).push(edge);
  }

  // Initialize executors
  this.eventExecutor = new EventExecutor(this);
  this.actionExecutor = new ActionExecutor(this);
  this.conditionExecutor = new ConditionExecutor(this);
  this.logicNodeExecutor = new LogicNodeExecutor(this);
}
```

### 5. Event Triggering

Events werden an verschiedenen Stellen getriggert:

**onGameStart** - `src/engine/GameEngine.js` Zeile 109:
```javascript
start() {
  if (this.tickInterval) return;
  this.logicExecutor.triggerEvent('onGameStart');  // ← Trigger!
  // ...
}
```

**onTick** - `src/engine/GameEngine.js` Zeile 126:
```javascript
tick() {
  this.logicExecutor.triggerEvent('onTick');  // ← 10x pro Sekunde!
  this.productionManager.calculateProduction();
  // ...
}
```

**onClick** - `src/engine/managers/ProductionManager.js`:
```javascript
click() {
  const clickableResource = this.game.gameData.resources.find(r => r.clickable);
  if (!clickableResource) return;

  // Trigger onClick event
  this.game.logicExecutor.triggerEvent('onClick', {
    resourceId: clickableResource.id
  });
  // ...
}
```

**afterBoughtBuilding** - `src/engine/managers/BuildingManager.js`:
```javascript
buyBuilding(buildingId, amount = 1) {
  // ... purchase logic ...

  // Trigger event
  this.game.logicExecutor.triggerEvent('afterBoughtBuilding', {
    buildingId: buildingId
  });
}
```

### 6. Event Execution

**Datei:** `src/engine/executors/EventExecutor.js` Zeile 14-42:

```javascript
triggerEvent(eventName, context = {}) {
  // 1. Finde alle Event-Nodes mit diesem eventType
  const eventNodes = this.executor.logic.nodes.filter(
    node => node.type === 'event' && node.data.eventType === eventName
  );

  for (const eventNode of eventNodes) {
    // 2. Prüfe ob Event-spezifische Requirements erfüllt sind
    const nodeData = eventNode.data;
    let shouldTrigger = true;

    // Beispiel: onClick event nur für spezifische Resource?
    if (context.resourceId && nodeData.resourceId &&
        nodeData.resourceId !== context.resourceId) {
      shouldTrigger = false;
    }

    // 3. Wenn ja, starte Graph-Execution ab diesem Event
    if (shouldTrigger) {
      this.executor.executeGraphFromNode(eventNode.id, context);
    }
  }
}
```

### 7. Graph Execution

**Datei:** `src/engine/LogicExecutor.js` Zeile 51-73:

```javascript
executeGraphFromNode(nodeId, context = {}) {
  const startNode = this.nodeMap.get(nodeId);
  if (!startNode) return;

  // Finde alle ausgehenden Edges von diesem Node
  const outgoingEdges = this.edgeMap.get(nodeId) || [];

  for (const edge of outgoingEdges) {
    const targetNode = this.nodeMap.get(edge.target);
    if (!targetNode) continue;

    // Führe Target-Node aus basierend auf Typ
    if (targetNode.type === 'action') {
      this.executeAction(targetNode, context);
      // Rekursiv weiter vom Action-Node
      this.executeGraphFromNode(targetNode.id, context);
    }
    else if (targetNode.type === 'condition') {
      this.executeCondition(targetNode, context);
    }
    else if (targetNode.type === 'logic') {
      this.executeLogic(targetNode, context);
    }
  }
}
```

### 8. Action Execution

**Datei:** `src/engine/executors/ActionExecutor.js` Zeile 14-96:

```javascript
executeAction(node, context = {}) {
  const data = node.data;

  switch (data.actionType) {
    case 'addResource':
      if (data.resourceId && data.amount) {
        this.game.resourceManager.addResource(
          data.resourceId,
          parseFloat(data.amount)
        );
      }
      break;

    case 'showNotification':
      if (data.message) {
        this.game.gameState.notifications.push({
          message: data.message,
          timestamp: Date.now(),
          duration: data.duration || 3000
        });
      }
      break;

    // ... alle anderen Action-Types
  }
}
```

## 🧪 Testing & Debugging

### Browser Console Tools

Öffne die Browser-Console (F12) im Player-Tab:

```javascript
// 1. Prüfe ob Logic geladen wurde
LogicDebug.checkLogicData(gameEngine.gameData);

// 2. Visualisiere den Logic Flow
LogicDebug.visualizeFlow(gameEngine.gameData);

// 3. Validiere Logic-Struktur
LogicDebug.validateLogic(gameEngine.gameData);

// 4. Test Logic-Execution
LogicDebug.testLogicExecution(gameEngine);

// 5. Enable Debug-Logging
LogicDebug.enableDebugMode(gameEngine);
```

### Manual Event Trigger

```javascript
// Trigger events manuell zum Testen:
gameEngine.logicExecutor.triggerEvent('onGameStart');
gameEngine.logicExecutor.triggerEvent('onClick', { resourceId: 'gold' });
gameEngine.logicExecutor.triggerEvent('afterBoughtBuilding', { buildingId: 'goldMine' });
```

### Check Game State

```javascript
// Prüfe ob Actions ausgeführt wurden:
console.log(gameEngine.gameState.resources);
console.log(gameEngine.gameState.notifications);
```

## 🐛 Häufige Probleme

### Problem 1: "Logic funktioniert nicht nach Import"

**Ursache:** gameData.logic wurde nicht gespeichert

**Lösung:**
```javascript
// 1. Prüfe localStorage:
const data = JSON.parse(localStorage.getItem('idleGameData'));
console.log('Logic nodes:', data.logic?.nodes?.length || 0);
console.log('Logic edges:', data.logic?.edges?.length || 0);

// 2. Wenn leer → Logic Editor öffnen, warte 5 Sekunden, dann export
```

### Problem 2: "onGameStart Event triggert nicht"

**Ursache:** Event triggert nur beim ersten Start

**Lösung:**
```javascript
// Manuell triggern zum Test:
gameEngine.logicExecutor.triggerEvent('onGameStart');

// Oder: Player-Tab neu laden (neu-initialisiert Engine)
```

### Problem 3: "Actions werden ausgeführt aber nichts passiert"

**Ursache:** Node-Konfiguration falsch

**Check:**
```javascript
// Prüfe Node-Daten:
const nodes = gameEngine.gameData.logic.nodes;
const actionNodes = nodes.filter(n => n.type === 'action');
console.log('Actions:', actionNodes.map(n => ({
  type: n.data.actionType,
  data: n.data
})));

// Stelle sicher:
// - resourceId existiert in gameData.resources
// - amount ist eine Zahl
// - buildingId/upgradeId existieren
```

### Problem 4: "Edges verbinden sich nicht"

**Ursache:** Inkompatible Node-Typen

**Regel:**
- Events → Actions, Conditions, Logic ✅
- Actions → Actions, Conditions, Logic ✅
- Conditions → Actions (true/false handles) ✅
- Logic → Actions ✅
- Actions → Events ❌
- Events → Events ❌

## 📊 Complete Flow Example

### Visual Editor:
```
[onGameStart Event] → [Add Resource Action]
                          ↓
                       resourceId: "gold"
                       amount: 100
```

### Saved to gameData.logic:
```json
{
  "logic": {
    "nodes": [
      {
        "id": "event_1234",
        "type": "event",
        "position": {"x": 100, "y": 50},
        "data": {"eventType": "onGameStart"}
      },
      {
        "id": "action_5678",
        "type": "action",
        "position": {"x": 400, "y": 50},
        "data": {
          "actionType": "addResource",
          "resourceId": "gold",
          "amount": 100
        }
      }
    ],
    "edges": [
      {
        "id": "edge_9012",
        "source": "event_1234",
        "target": "action_5678"
      }
    ]
  }
}
```

### Execution Flow:
```
1. GameEngine.start()
   ↓
2. logicExecutor.triggerEvent('onGameStart')
   ↓
3. EventExecutor finds event_1234 node
   ↓
4. executeGraphFromNode('event_1234')
   ↓
5. Finds edge to action_5678
   ↓
6. executeAction(action_5678)
   ↓
7. ActionExecutor: case 'addResource'
   ↓
8. resourceManager.addResource('gold', 100)
   ↓
9. gameState.resources.gold.amount += 100
   ↓
10. ✅ Player startet mit 100 Gold!
```

## 🎯 Verification Checklist

Gehe diese Schritte durch um zu verifizieren, dass alles funktioniert:

1. **Logic Editor:**
   - [ ] Nodes sind sichtbar
   - [ ] Edges verbinden Nodes (grüne Linien)
   - [ ] "Saved" Indikator erscheint nach 5 Sekunden
   - [ ] Code Preview zeigt korrekten Code

2. **Export/Import:**
   - [ ] Export enthält `"logic": {"nodes": [...], "edges": [...]}`
   - [ ] nodes und edges Arrays sind nicht leer
   - [ ] Import lädt ohne Fehler

3. **Player Mode:**
   - [ ] Console zeigt "Debug tools available"
   - [ ] `LogicDebug.checkLogicData(gameEngine.gameData)` zeigt Nodes/Edges
   - [ ] `LogicDebug.validateLogic(gameEngine.gameData)` zeigt ✅
   - [ ] `LogicDebug.enableDebugMode(gameEngine)` zeigt Event-Logs

4. **Runtime:**
   - [ ] Events triggern (sichtbar in Debug-Logs)
   - [ ] Actions führen zu State-Changes
   - [ ] Notifications erscheinen
   - [ ] Resources ändern sich

## 💡 Pro-Tipps

### Tip 1: Immer mit Notification testen

```
Event → Show Notification ("Test!")
```
Wenn Notification erscheint → Logic funktioniert! ✅

### Tip 2: Debug-Mode während Entwicklung

```javascript
// Im Player Tab Console:
LogicDebug.enableDebugMode(gameEngine);
```
Dann siehst du **jedes** Event und **jede** Action in der Console!

### Tip 3: Validate vor Export

```javascript
// Vor Export immer validieren:
LogicDebug.validateLogic(gameEngine.gameData);
```
Findet Probleme bevor du exportierst!

### Tip 4: Check gameData nach Import

```javascript
// Nach Import:
const data = JSON.parse(localStorage.getItem('idleGameData'));
console.log(data.logic);
```

## 🔍 Source Code References

| Feature | File | Lines |
|---------|------|-------|
| Logic Editor UI | `src/components/LogicEditor/LogicEditor.jsx` | 1-211 |
| Auto-Save | `src/components/LogicEditor/hooks/useAutoSave.js` | 1-46 |
| Logic Executor | `src/engine/LogicExecutor.js` | 1-103 |
| Event Executor | `src/engine/executors/EventExecutor.js` | 1-73 |
| Action Executor | `src/engine/executors/ActionExecutor.js` | 1-97 |
| Condition Executor | `src/engine/executors/ConditionExecutor.js` | Full file |
| Logic Node Executor | `src/engine/executors/LogicNodeExecutor.js` | Full file |
| Debug Tools | `src/utils/logicDebug.js` | 1-end |

## ✅ Conclusion

Das Logic System ist **vollständig implementiert** und funktioniert wie folgt:

1. ✅ Visual Editor erstellt Nodes & Edges
2. ✅ Auto-Save speichert zu gameData.logic nach 5 Sekunden
3. ✅ GameEngine lädt logic beim Start
4. ✅ LogicExecutor baut nodeMap und edgeMap
5. ✅ Events werden getriggert bei Spielereignissen
6. ✅ EventExecutor findet passende Event-Nodes
7. ✅ Graph-Execution folgt Edges zu Actions
8. ✅ ActionExecutor führt Befehle aus
9. ✅ Game State ändert sich
10. ✅ Spieler sieht Ergebnisse!

**Wenn es nicht funktioniert:**
- Benutze die Debug-Tools (`window.LogicDebug`)
- Prüfe Browser Console auf Fehler
- Validiere gameData.logic Struktur
- Teste mit Notifications

Das System funktioniert zuverlässig - if you follow the debugging steps above, you'll find the issue! 🎮
