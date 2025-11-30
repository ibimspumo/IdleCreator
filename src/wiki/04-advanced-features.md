# Advanced Features

Master advanced mechanics and optimization techniques for your idle game.

## Prestige System Deep Dive

### Prestige Formulas Explained

The prestige system allows players to reset progress for permanent bonuses.

#### Linear Formula
```
prestigeCurrency = floor(totalResources / divisor)
```

**Characteristics:**
- Predictable scaling
- Constant growth rate
- Good for balanced games

**Example:**
```
Total gold: 10,000
Divisor: 100
Result: 10,000 / 100 = 100 prestige points
```

**Use when:** You want steady, predictable prestige gains.

#### Exponential Formula
```
prestigeCurrency = floor(totalResources ^ (1 / exponent))
```

**Characteristics:**
- Rapid early growth
- Slows down at high values
- Square root relationship

**Example:**
```
Total gold: 1,000,000
Exponent: 2
Result: 1,000,000 ^ (1/2) = 1,000 prestige points
```

**Use when:** You want fast early prestiges, slower late game.

#### Logarithmic Formula
```
prestigeCurrency = floor(log(totalResources) * multiplier)
```

**Characteristics:**
- Very slow growth
- Rewards extreme resource accumulation
- Good for long-term games

**Example:**
```
Total gold: 100,000
Multiplier: 10
Result: log(100,000) * 10 ≈ 50 prestige points
```

**Use when:** You want to heavily reward patient players.

### Prestige Logic Integration

**Basic prestige reward:**
```
onPrestige → Multiply Production (all resources, 1.1)
```

**Tiered prestige bonuses:**
```
onPrestige → If Prestige Level >= 10
  ✓ → Multiply Production (all, 2.0)
  ✗ → Multiply Production (all, 1.5)
```

**Prestige currency shop:**
```
Custom upgrades that cost prestige points instead of regular resources
(Requires manual logic implementation)
```

## Production Mechanics

### Production Calculation Order

Every game tick (100ms), production is calculated in this order:

1. **Base Building Production**
   ```
   building.production * building.owned
   ```

2. **Upgrade Multipliers Applied**
   ```
   baseProduction * upgrade1.multiplier * upgrade2.multiplier...
   ```

3. **Prestige Multipliers Applied**
   ```
   upgradedProduction * prestigeMultiplier
   ```

4. **Logic Node Bonuses Applied**
   ```
   finalProduction + addProduction bonuses
   finalProduction * multiplyProduction bonuses
   ```

### Production Optimization

**Efficient Building Strategy:**
```
Cost scaling: 1.15
Production: Linear

Early game: Buy many cheap buildings
Mid game: Balance buildings and upgrades
Late game: Focus on multiplier upgrades
```

**Upgrade Priority:**
```
1. Global multipliers (affect all resources)
2. Resource-specific multipliers (high-production resources)
3. Flat bonuses (early game only)
```

## Click Power Mechanics

### Click Power Calculation

```
finalClickPower = baseClickPower * clickMultiplier + clickAddBonus
```

**Example:**
```
Base: 1
Multiplier upgrades: ×2, ×1.5
Add bonuses: +5

Final: (1 * 2 * 1.5) + 5 = 3 + 5 = 8 per click
```

### Advanced Click Mechanics

**Click combos using logic:**
```
onClick → Add Resource (comboCounter, 1)
onClick → If Resource (comboCounter >= 10)
  ✓ → Multiply Click Power (2) → Set Resource (comboCounter, 0)
```

**Timed click bonuses:**
```
afterXSeconds(60) → Branch
  → Set Click Power (10)
  → Show Notification ("2x clicks for 10 seconds!")
  → Delay (10)
  → Set Click Power (5)
```

## Cost Scaling Strategies

### Understanding Scaling Factors

| Scaling | Growth Rate | Best For |
|---------|-------------|----------|
| 1.05 | Very slow | Long-term idle games |
| 1.10 | Slow | Balanced progression |
| 1.15 | Medium | Standard idle games |
| 1.20 | Fast | Short sessions |
| 1.25+ | Very fast | Challenge modes |

### Dynamic Scaling

**Reduce scaling after milestone:**
```
afterXBuildings(goldMine, 50) → (Custom logic needed)
  Modify building.scaling from 1.15 to 1.10
```

Note: Currently requires manual gameData modification.

### Bulk Buy Optimization

The engine automatically calculates bulk purchase costs:

```
totalCost = Σ(baseCost × scaling^i) for i = owned to (owned + amount)
```

Players can buy 1, 10, 25, 100, or Max at once.

## Event Counter System

### How Event Counters Work

Event counters track cumulative triggers for counter-based events.

**Tracked automatically:**
- Total clicks per resource
- Total resources earned
- Total resources spent
- Total buildings purchased
- Total upgrades purchased
- Total achievements unlocked
- Playtime seconds

**Accessing in logic:**
Counter events (`afterXClicks`, `afterXResources`, etc.) check these automatically.

### Custom Counter Logic

**Track custom events:**
```
onCustomEvent → Add Resource (customCounter, 1)
afterXResources(customCounter, 100) → Trigger reward
```

## Unlock Requirements System

### Requirement Types

#### Resource Requirements
```javascript
{
  type: 'resource',
  resourceId: 'gold',
  amount: 1000,
  operator: '>='  // >=, <=, ==, >, <
}
```

#### Building Requirements
```javascript
{
  type: 'building',
  buildingId: 'goldMine',
  amount: 10,
  operator: '>='
}
```

#### Upgrade Requirements
```javascript
{
  type: 'upgrade',
  upgradeId: 'betterClicks',
  owned: true
}
```

#### Achievement Requirements
```javascript
{
  type: 'achievement',
  achievementId: 'firstMillion',
  unlocked: true
}
```

#### Prestige Requirements
```javascript
{
  type: 'prestige',
  level: 5,
  operator: '>='
}
```

### Multiple Requirements

Requirements use **AND** logic (all must be true):

```javascript
requirements: [
  { type: 'resource', resourceId: 'gold', amount: 10000 },
  { type: 'building', buildingId: 'goldMine', amount: 5 },
  { type: 'upgrade', upgradeId: 'betterClicks', owned: true }
]
```

All three conditions must be met for unlock.

### Requirement Checking

Requirements are checked every tick for:
- Buildings (visibility)
- Upgrades (visibility)
- Achievements (unlock)

**Note:** Once unlocked, buildings/upgrades stay visible.

## Game State Management

### State vs Data

**gameData (Configuration):**
- What's possible in the game
- Buildings available, costs, production rates
- Upgrade effects
- Achievement requirements
- Defined in Editor

**gameState (Runtime):**
- What's happening now
- Current resource amounts
- Buildings owned
- Upgrades purchased
- Managed by GameEngine

### State Persistence

**Auto-save:**
- Saves to localStorage every 5 seconds (debounced)
- Triggered on any gameData change
- Includes full state snapshot

**Manual save:**
```
Settings → Export Game
```

**State includes:**
```javascript
{
  resources: { /* amounts */ },
  buildings: { /* owned counts */ },
  upgrades: { /* purchase status */ },
  achievements: { /* unlock status */ },
  prestige: { /* level, currency */ },
  totalClicks: N,
  startTime: timestamp,
  eventCounters: { /* tracked events */ }
}
```

## Export & Import System

### Compression

Game data is compressed using **LZString**:
- ~70% size reduction
- Base64 encoded for sharing
- Includes both gameData and gameState

### Export Format

```javascript
{
  version: '1.0',
  gameData: { /* full configuration */ },
  gameState: { /* full runtime state */ },
  timestamp: Date.now()
}
```

### Import Validation

When importing:
1. Decompress LZString data
2. Parse JSON
3. Validate structure
4. Check version compatibility
5. Load into engine

**Safety:** Invalid imports are rejected with error message.

## Theme System

### CSS Variable System

Themes use CSS custom properties:

```css
--bg-primary: #1a1a1a
--bg-secondary: #2a2a2a
--bg-tertiary: #3a3a3a
--text-primary: #ffffff
--text-secondary: #cccccc
--accent-primary: #4a9eff
--accent-light: #6bb6ff
--border-primary: #444444
```

### Creating Custom Themes

1. **Editor → Theme Properties**
2. Modify colors using picker
3. Changes apply instantly
4. Export to save theme

### Pre-built Themes

Create theme presets:
```javascript
const darkTheme = {
  primaryColor: '#4a9eff',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff'
};

const lightTheme = {
  primaryColor: '#2196F3',
  backgroundColor: '#f5f5f5',
  textColor: '#333333'
};
```

Import via Settings → Import.

## Performance Optimization

### Tick Rate Optimization

**Default:** 100ms (10 ticks/second)

**High-performance mode (future):**
```javascript
engine.tickRate = 200; // 5 ticks/second (slower but lighter)
```

### Logic Optimization

**Avoid:**
```
onTick → If Resource (gold >= 1000) → Action
```
Checks 10 times per second unnecessarily.

**Better:**
```
afterXResources(gold, 1000) → Action
```
Triggers once when threshold is met.

### Production Caching

The engine caches production calculations:
- Recalculates only when buildings/upgrades change
- Applies cached value every tick
- Significant performance improvement

### Large Number Handling

**Notation system:**
```
1,000 = 1K
1,000,000 = 1M
1,000,000,000 = 1B
1,000,000,000,000 = 1T
```

**Scientific notation (very large):**
```
1e15 = 1 Quadrillion
1e18 = 1 Quintillion
```

JavaScript numbers are safe up to `Number.MAX_SAFE_INTEGER` (9e15).

For larger numbers, consider implementing BigInt (future feature).

## Notification System

### Notification Properties

```javascript
{
  message: 'Text to display',
  duration: 3000  // milliseconds
}
```

### Notification Queue

Multiple notifications queue and display sequentially:
```
Show Notification ("First")
Show Notification ("Second")
Show Notification ("Third")
```

Displays one at a time with 3-second intervals.

### Custom Notification Styles

Currently uses default toast style.

**Future:** Custom colors, positions, icons.

## Achievement Progress Tracking

### Progress System

Some achievements track progress:

```javascript
{
  id: 'millionaire',
  requirements: [
    { type: 'resource', resourceId: 'gold', amount: 1000000 }
  ]
}
```

**State:**
```javascript
achievements.millionaire = {
  unlocked: false,
  progress: 0.45  // 45% complete (450,000 gold)
}
```

### Progress Display

Progress is shown in achievement cards:
```
Millionaire
Earn 1,000,000 gold
Progress: 450,000 / 1,000,000 (45%)
```

### Multi-requirement Progress

With multiple requirements:
```
Progress = average of all requirement progress
```

**Example:**
```
Requirements:
- 1,000,000 gold (current: 500,000) → 50%
- 10 gold mines (current: 5) → 50%

Total Progress: 50%
```

## Random Systems

### Random Chance Node

**Syntax:**
```javascript
{
  nodeType: 'random',
  chance: 25  // 25% probability
}
```

**Outputs:**
- Success path (25% chance)
- Failure path (75% chance)

### Random Applications

**Random rewards:**
```
onClick → Random (10%)
  ✓ → Add Resource (gems, 1)
  ✗ → Add Resource (gold, 1)
```

**Random events:**
```
onTick → Random (0.1%)  // Very rare
  ✓ → Show Notification ("Rare event!") → Add Resource (gems, 100)
```

**Loot tables:**
```
afterBoughtBuilding(goldMine) → Random (50%)
  ✓ → Random (50%)
    ✓ → Add Resource (legendaryGem, 1)
    ✗ → Add Resource (rareGem, 1)
  ✗ → Add Resource (commonGem, 1)
```

## Loop Systems

### Loop Node

**Syntax:**
```javascript
{
  nodeType: 'loop',
  iterations: 10
}
```

### Loop Applications

**Bulk actions:**
```
afterXClicks(gold, 100) → Loop (10) → Add Resource (gold, 5)
```
After 100 clicks, add 50 gold (5 × 10).

**Staged unlocks:**
```
onGameStart → Loop (5) → Sequence
  → Delay (10)
  → Unlock Building (nextBuilding)
```
Unlocks 5 buildings at 10-second intervals.

**Prestige bonuses:**
```
onPrestige → Loop (prestigeLevel) → Add Production (gold, 10)
```
Each prestige level adds +10 gold/sec permanently.

## Delay Systems

### Delay Node

**Syntax:**
```javascript
{
  nodeType: 'delay',
  seconds: 5
}
```

**Important:** Delays are asynchronous - game continues during delay.

### Delay Applications

**Timed sequences:**
```
onGameStart → Show Notification ("Welcome!")
  → Delay (3)
  → Show Notification ("Here's a bonus!")
  → Add Resource (gold, 100)
```

**Cooldown systems:**
```
onClick → Add Resource (gold, 10)
  → Delay (5)
  → Set Click Power (1)
```

**Tutorial pacing:**
```
onGameStart → Unlock Building (goldMine)
  → Delay (30)
  → Unlock Building (goldFactory)
  → Delay (60)
  → Unlock Upgrade (betterProduction)
```

## Best Practices Summary

### Performance
1. Use counter events instead of onTick when possible
2. Limit deep logic chains
3. Cache expensive calculations
4. Use bulk buy for large purchases

### Game Design
1. Balance cost scaling (1.10-1.20 range)
2. Provide early upgrades for engagement
3. Use prestige for long-term goals
4. Create varied achievement types

### Logic Design
1. Test flows incrementally
2. Use code preview to verify
3. Group related nodes
4. Comment complex logic (via notifications during dev)

### Player Experience
1. Provide clear feedback (notifications)
2. Show progress for achievements
3. Balance click vs idle gameplay
4. Pace content unlocks appropriately

## Next Steps

- **[Examples & Patterns](06-examples-patterns.md)** - Real-world implementations
- **[Troubleshooting](07-troubleshooting.md)** - Common issues and fixes
- **[API Reference](08-api-reference.md)** - Technical documentation
