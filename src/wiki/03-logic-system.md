# Logic System

The Logic System is the heart of custom game behavior. Using visual node-based programming, you can create complex mechanics without writing code.

## Overview

The logic system uses a **flow-based graph** where:
- **Nodes** represent events, actions, conditions, or logic operations
- **Edges** connect nodes to define execution flow
- **Data** flows from left to right through handles

## Node Categories

### Events (Entry Points)
Events trigger logic flows. Every flow must start with an event node.

### Actions (State Changes)
Actions modify game state (add resources, unlock content, etc.).

### Conditions (Branching)
Conditions evaluate true/false and branch execution.

### Logic (Flow Control)
Logic nodes control execution timing and patterns.

---

## Event Nodes (19 Types)

### Core Events

#### `onGameStart`
**Triggers:** Once when the game initializes

**Use cases:**
- Welcome bonuses
- Initial tutorial messages
- Setup starting conditions

**Example:**
```
onGameStart → Add Resource (gold, 100)
```

#### `onTick`
**Triggers:** Every 100ms (10 times per second)

**Use cases:**
- Continuous checks
- Timed mechanics
- Progress tracking

**Warning:** Use sparingly - runs very frequently!

**Example:**
```
onTick → If Resource (gold >= 1000) → Show Notification
```

#### `onClick`
**Triggers:** When player clicks a resource

**Properties:**
- `resourceId` - Which resource was clicked

**Use cases:**
- Click bonuses
- Click-based unlocks
- Click combo systems

**Example:**
```
onClick(gold) → Add Resource (gold, 5) → Show Notification
```

### Counter Events

#### `afterXClicks`
**Triggers:** After N total clicks

**Properties:**
- `resourceId` - Target resource
- `clickCount` - Number of clicks required

**Example:**
```
afterXClicks(gold, 100) → Unlock Upgrade (clickBonus)
```

#### `afterXSeconds`
**Triggers:** After N seconds of playtime

**Properties:**
- `seconds` - Time threshold

**Example:**
```
afterXSeconds(60) → Show Notification ("1 minute played!")
```

#### `afterXResources`
**Triggers:** When resource amount reaches threshold

**Properties:**
- `resourceId` - Target resource
- `amount` - Threshold amount

**Example:**
```
afterXResources(gold, 1000) → Unlock Building (goldMine)
```

#### `afterXResourcesSpent`
**Triggers:** When total spent reaches threshold

**Properties:**
- `resourceId` - Target resource
- `amount` - Total spending threshold

**Example:**
```
afterXResourcesSpent(gold, 500) → Unlock Achievement (bigSpender)
```

### Purchase Events

#### `afterBoughtBuilding`
**Triggers:** When a specific building is purchased

**Properties:**
- `buildingId` - Target building

**Example:**
```
afterBoughtBuilding(goldMine) → Show Notification ("First mine!")
```

#### `afterXBuildings`
**Triggers:** When building count reaches threshold

**Properties:**
- `buildingId` - Target building
- `amount` - Number owned

**Example:**
```
afterXBuildings(goldMine, 10) → Unlock Upgrade (miningBonus)
```

#### `afterBoughtUpgrade`
**Triggers:** When a specific upgrade is purchased

**Properties:**
- `upgradeId` - Target upgrade

**Example:**
```
afterBoughtUpgrade(betterClicks) → Show Notification ("Clicks improved!")
```

#### `afterXBoughtUpgrades`
**Triggers:** When total upgrades purchased reaches N

**Properties:**
- `amount` - Total upgrades threshold

**Example:**
```
afterXBoughtUpgrades(5) → Unlock Achievement (upgradeCollector)
```

### Achievement Events

#### `onAchievementUnlock`
**Triggers:** When any achievement is unlocked

**Properties:**
- `achievementId` - Specific achievement (optional)

**Example:**
```
onAchievementUnlock(firstMillion) → Add Resource (gems, 10)
```

#### `afterXAchievements`
**Triggers:** When total achievements unlocked reaches N

**Properties:**
- `amount` - Achievement count threshold

**Example:**
```
afterXAchievements(10) → Unlock Upgrade (achievementBonus)
```

### Special Events

#### `onPrestige`
**Triggers:** When player performs prestige

**Use cases:**
- Prestige bonuses
- Special unlocks
- Prestige tracking

**Example:**
```
onPrestige → Multiply Production (all, 1.1)
```

#### `onResourceFull`
**Triggers:** When resource hits maximum capacity

**Properties:**
- `resourceId` - Target resource

**Example:**
```
onResourceFull(gold) → Show Notification ("Gold storage full!")
```

#### `onResourceEmpty`
**Triggers:** When resource reaches zero

**Properties:**
- `resourceId` - Target resource

**Example:**
```
onResourceEmpty(energy) → Add Resource (energy, 10)
```

#### `afterXProduction`
**Triggers:** When production rate reaches threshold

**Properties:**
- `resourceId` - Target resource
- `amount` - Production per second threshold

**Example:**
```
afterXProduction(gold, 100) → Unlock Building (goldFactory)
```

#### `onBuildingMaxed`
**Triggers:** When building reaches max ownership

**Properties:**
- `buildingId` - Target building

**Example:**
```
onBuildingMaxed(goldMine) → Unlock Achievement (maxedOut)
```

#### `afterPlaytime`
**Triggers:** After N seconds of total playtime

**Properties:**
- `seconds` - Playtime threshold

**Example:**
```
afterPlaytime(3600) → Unlock Achievement (oneHour)
```

---

## Action Nodes (12 Types)

### Resource Actions

#### `addResource`
**Effect:** Add or remove resource amount

**Properties:**
- `resourceId` - Target resource
- `amount` - Amount to add (negative to remove)

**Example:**
```javascript
{ resourceId: 'gold', amount: 100 }  // Add 100 gold
{ resourceId: 'gold', amount: -50 }  // Remove 50 gold
```

#### `setResource`
**Effect:** Set resource to exact value

**Properties:**
- `resourceId` - Target resource
- `amount` - Exact value

**Example:**
```javascript
{ resourceId: 'gold', amount: 0 }    // Reset gold to 0
```

#### `multiplyResource`
**Effect:** Multiply resource amount

**Properties:**
- `resourceId` - Target resource
- `multiplier` - Multiplication factor

**Example:**
```javascript
{ resourceId: 'gold', multiplier: 2 }  // Double gold
```

### Production Actions

#### `addProduction`
**Effect:** Add flat production bonus

**Properties:**
- `resourceId` - Target resource
- `amount` - Production per second to add

**Example:**
```javascript
{ resourceId: 'gold', amount: 10 }  // +10 gold/sec
```

#### `multiplyProduction`
**Effect:** Multiply production rate

**Properties:**
- `resourceId` - Target resource (null = all)
- `multiplier` - Multiplication factor

**Example:**
```javascript
{ resourceId: 'gold', multiplier: 1.5 }  // 1.5x gold production
{ resourceId: null, multiplier: 2 }      // 2x all production
```

#### `setClickPower`
**Effect:** Change click power amount

**Properties:**
- `amount` - New click power value

**Example:**
```javascript
{ amount: 10 }  // Clicks now give 10 instead of 1
```

### Unlock Actions

#### `unlockBuilding`
**Effect:** Make building visible/purchasable

**Properties:**
- `buildingId` - Target building

**Example:**
```javascript
{ buildingId: 'goldMine' }
```

#### `unlockUpgrade`
**Effect:** Make upgrade visible/purchasable

**Properties:**
- `upgradeId` - Target upgrade

**Example:**
```javascript
{ upgradeId: 'betterClicks' }
```

#### `unlockAchievement`
**Effect:** Unlock achievement manually

**Properties:**
- `achievementId` - Target achievement

**Example:**
```javascript
{ achievementId: 'secretBonus' }
```

### Special Actions

#### `showNotification`
**Effect:** Display toast message to player

**Properties:**
- `message` - Notification text
- `duration` - Display time (milliseconds)

**Example:**
```javascript
{ message: 'Welcome to the game!', duration: 3000 }
```

#### `forcePrestige`
**Effect:** Trigger prestige immediately

**Use cases:**
- Automatic prestige systems
- Forced resets
- Challenge modes

**Example:**
```javascript
// No properties - just triggers prestige
```

---

## Condition Nodes (8 Types)

Conditions have **two output handles**:
- **✓ True** (green) - Executes if condition is true
- **✗ False** (red) - Executes if condition is false

### Resource Conditions

#### `ifResource`
**Check:** Compare resource amount

**Properties:**
- `resourceId` - Target resource
- `operator` - `>=`, `<=`, `==`, `>`, `<`
- `amount` - Comparison value

**Example:**
```javascript
{ resourceId: 'gold', operator: '>=', amount: 1000 }
```

**Flow:**
```
If Resource (gold >= 1000)
  ✓ → Unlock Building (goldMine)
  ✗ → Show Notification ("Need more gold")
```

#### `ifProductionRate`
**Check:** Compare production per second

**Properties:**
- `resourceId` - Target resource
- `operator` - `>=`, `<=`, `==`, `>`, `<`
- `amount` - Production threshold

**Example:**
```javascript
{ resourceId: 'gold', operator: '>=', amount: 50 }
```

### Building Conditions

#### `ifBuilding`
**Check:** Compare building count

**Properties:**
- `buildingId` - Target building
- `operator` - `>=`, `<=`, `==`, `>`, `<`
- `amount` - Building count

**Example:**
```javascript
{ buildingId: 'goldMine', operator: '>=', amount: 10 }
```

#### `ifBuildingOwned`
**Check:** If player owns at least one building

**Properties:**
- `buildingId` - Target building

**Example:**
```javascript
{ buildingId: 'goldMine' }  // True if owned >= 1
```

### Upgrade/Achievement Conditions

#### `ifUpgradeOwned`
**Check:** If upgrade is purchased

**Properties:**
- `upgradeId` - Target upgrade

**Example:**
```javascript
{ upgradeId: 'betterClicks' }
```

#### `ifAchievementUnlocked`
**Check:** If achievement is unlocked

**Properties:**
- `achievementId` - Target achievement

**Example:**
```javascript
{ achievementId: 'firstMillion' }
```

### Meta Conditions

#### `ifPrestigeLevel`
**Check:** Compare prestige level

**Properties:**
- `operator` - `>=`, `<=`, `==`, `>`, `<`
- `level` - Prestige level

**Example:**
```javascript
{ operator: '>=', level: 5 }
```

#### `ifPlaytime`
**Check:** Compare total playtime

**Properties:**
- `operator` - `>=`, `<=`, `==`, `>`, `<`
- `seconds` - Playtime threshold

**Example:**
```javascript
{ operator: '>=', seconds: 3600 }  // 1 hour
```

---

## Logic Nodes (5 Types)

### Flow Control

#### `delay`
**Effect:** Wait N seconds before continuing

**Properties:**
- `seconds` - Delay duration

**Example:**
```
onGameStart → Delay (5) → Show Notification ("Welcome!")
```

Wait 5 seconds after game start before showing message.

#### `sequence`
**Effect:** Execute outputs in order

**Outputs:** Multiple sequential outputs

**Example:**
```
onGameStart → Sequence
  → Output 1: Add Resource (gold, 100)
  → Output 2: Show Notification
  → Output 3: Unlock Building
```

Each output executes after the previous completes.

#### `branch`
**Effect:** Execute all outputs in parallel

**Outputs:** Multiple parallel outputs

**Example:**
```
onGameStart → Branch
  → Output 1: Add Resource (gold, 100)
  → Output 2: Add Resource (gems, 10)
  → Output 3: Show Notification
```

All outputs execute simultaneously.

#### `loop`
**Effect:** Repeat N times

**Properties:**
- `iterations` - Number of loops

**Example:**
```
onClick → Loop (5) → Add Resource (gold, 1)
```

Each click adds 5 gold (1 × 5 iterations).

#### `random`
**Effect:** Random chance branching

**Properties:**
- `chance` - Probability percentage (0-100)

**Outputs:**
- **✓ Success** - Executes with chance%
- **✗ Failure** - Executes with (100-chance)%

**Example:**
```
onClick → Random (25%)
  ✓ → Add Resource (gems, 1)    // 25% chance
  ✗ → Add Resource (gold, 1)    // 75% chance
```

---

## Building Logic Flows

### Basic Flow Pattern

```
[Event] → [Action]
```

Example:
```
onGameStart → Add Resource (gold, 100)
```

### Conditional Flow

```
[Event] → [Condition]
  ✓ → [Action if true]
  ✗ → [Action if false]
```

Example:
```
onClick → If Resource (gold >= 100)
  ✓ → Unlock Building (goldMine)
  ✗ → Show Notification ("Need 100 gold")
```

### Complex Flow

```
[Event] → [Condition] → [Logic] → [Multiple Actions]
```

Example:
```
afterXSeconds(60) → If Upgrade Owned (autoClicker)
  ✓ → Loop (10)
    → Add Resource (gold, 1)
    → Show Notification ("+10 gold bonus!")
  ✗ → Show Notification ("Upgrade autoClicker first")
```

### Parallel Execution

```
[Event] → Branch
  → Path 1: [Condition] → [Action]
  → Path 2: [Action]
  → Path 3: [Delay] → [Action]
```

Example:
```
onPrestige → Branch
  → Path 1: Add Resource (prestigePoints, 10)
  → Path 2: Show Notification ("Prestige complete!")
  → Path 3: Delay (2) → Multiply Production (all, 1.1)
```

---

## Code Preview

The **Code Preview** panel generates human-readable pseudo-code from your node graph.

### Example Preview

**Node Graph:**
```
onGameStart
  → If Resource (gold >= 100)
    ✓ → Add Resource (gold, 50)
    ✗ → Show Notification ("Need gold")
```

**Generated Code:**
```
when game starts:
  if Gold ≥ 100:
    ✓ add 50 to Gold
  else:
    ✗ show notification "Need gold"
```

### Color Coding

- **Purple** - Keywords (when, if, else, loop, etc.)
- **Blue** - Variables (resource names, building names)
- **Orange** - Numbers
- **Green** - Strings
- **Cyan** - Operators (≥, ≤, ==, etc.)
- **Gray** - Comments

---

## Best Practices

### Performance

1. **Avoid onTick for heavy operations** - Runs 10 times/second
2. **Use counter events instead** - More efficient than continuous checks
3. **Limit complex logic chains** - Deep nesting impacts performance

### Organization

1. **Group related nodes** - Use the group feature for complex systems
2. **Name nodes clearly** - Future you will thank you
3. **Use code preview** - Verify logic before testing

### Design Patterns

#### Welcome Bonus
```
onGameStart → Add Resource (gold, 100)
```

#### Progressive Unlocks
```
afterXResources(gold, 100) → Unlock Building (goldMine)
afterXResources(gold, 1000) → Unlock Building (goldFactory)
```

#### Click Combos
```
afterXClicks(gold, 10) → Multiply Click Power (2)
afterXClicks(gold, 50) → Multiply Click Power (3)
```

#### Milestone Rewards
```
afterXBuildings(goldMine, 10) → Branch
  → Add Resource (gems, 5)
  → Show Notification ("10 mines! Bonus gems!")
  → Unlock Achievement (dedication)
```

#### Random Events
```
onTick → Random (1%)
  ✓ → Add Resource (gems, 1) → Show Notification ("Lucky!")
  ✗ → (no action)
```

---

## Debugging Logic

### Common Issues

**Logic not triggering:**
- Check event conditions are met
- Verify connections between nodes
- Check node configuration

**Unexpected behavior:**
- Use code preview to verify logic
- Test incrementally (add nodes one at a time)
- Check for circular dependencies

**Performance issues:**
- Reduce onTick usage
- Simplify complex chains
- Check for infinite loops

### Testing Strategies

1. **Test in isolation** - Test each flow independently
2. **Use notifications** - Add debug messages
3. **Check code preview** - Verify generated logic
4. **Monitor player tab** - Watch real-time effects

---

## Next Steps

- **[Advanced Features](04-advanced-features.md)** - Complex mechanics
- **[Examples & Patterns](06-examples-patterns.md)** - Real-world logic flows
- **[Troubleshooting](07-troubleshooting.md)** - Common problems
