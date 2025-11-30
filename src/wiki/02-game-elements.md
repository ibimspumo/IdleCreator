# Game Elements

This guide covers all the game elements you can create in the Editor.

## Resources

Resources are the fundamental currency/points that players collect.

### Resource Properties

| Property | Description | Example |
|----------|-------------|---------|
| **ID** | Unique identifier (no spaces) | `gold`, `gems`, `energy` |
| **Name** | Display name | `Gold`, `Premium Gems` |
| **Description** | Tooltip text | `The main currency` |
| **Icon** | 8x8 pixel art icon | Use pixel editor |
| **Click Power** | Amount per click | `1`, `10`, `100` |
| **Start Amount** | Initial resource value | `0`, `10`, `1000` |
| **Max Amount** | Maximum storage (optional) | `Infinity`, `999999` |

### Resource Icons

Click the **Icon** field to open the built-in pixel art editor:
- 8x8 grid for retro-style icons
- Full color picker
- Save compresses to base64 string

### Resource Tracking

The game automatically tracks for each resource:
- **Current Amount** - Player's current balance
- **Total Produced** - Lifetime production
- **Total Spent** - Lifetime spending
- **Per Second** - Current production rate

## Buildings

Buildings produce resources automatically over time.

### Building Properties

| Property | Description | Details |
|----------|-------------|---------|
| **ID** | Unique identifier | `goldMine`, `factory` |
| **Name** | Display name | `Gold Mine` |
| **Description** | Building tooltip | `Produces gold automatically` |
| **Icon** | 8x8 pixel art | Visual representation |
| **Costs** | Purchase costs | Can require multiple resources |
| **Production** | Output per second | Resource ID + amount |
| **Max Owned** | Ownership limit | Default: Infinity |
| **Unlock Requirements** | Prerequisites | Optional resource/building/upgrade checks |

### Cost Scaling

Buildings use **exponential cost scaling**:

```
finalCost = baseCost × (scaling^owned)
```

**Example:**
- Base cost: 10 gold
- Scaling: 1.15
- Owned: 5

```
Cost of 6th building = 10 × (1.15^5) = 20.11 gold
Cost of 7th building = 10 × (1.15^6) = 23.13 gold
```

### Production Output

Buildings can produce:
- **Single resource** - Most common (e.g., gold mine → gold)
- **Multiple resources** - Advanced (e.g., factory → gold + wood)

Production is calculated every tick (100ms = 10 times per second).

### Unlock Requirements

Buildings can be hidden until requirements are met:

```javascript
{
  type: 'resource',
  resourceId: 'gold',
  amount: 100  // Unlocks when player has 100+ gold
}
```

Types:
- `resource` - Require minimum resource amount
- `building` - Require another building owned
- `upgrade` - Require specific upgrade purchased

## Upgrades

One-time permanent purchases that boost game mechanics.

### Upgrade Properties

| Property | Description | Example |
|----------|-------------|---------|
| **ID** | Unique identifier | `betterClicks` |
| **Name** | Display name | `Better Clicks` |
| **Description** | Upgrade tooltip | `Doubles click power` |
| **Icon** | 8x8 pixel art | Visual representation |
| **Costs** | Purchase costs | One-time payment |
| **Effects** | Multipliers/bonuses | See effects below |
| **Unlock Requirements** | Prerequisites | Optional conditions |

### Upgrade Effects

Effects modify game mechanics permanently:

#### Multiply Effect
```javascript
{
  type: 'multiply',
  target: 'production',     // or 'click'
  resourceId: 'gold',       // optional (null = all resources)
  value: 2                  // 2x multiplier
}
```

**Targets:**
- `production` - Affects passive building production
- `click` - Affects manual clicking power

**Resource Scoping:**
- Specific: `resourceId: 'gold'` - Only affects gold
- Global: `resourceId: null` - Affects all resources

#### Add Effect
```javascript
{
  type: 'add',
  target: 'production',
  resourceId: 'gold',
  value: 10                 // +10 per second
}
```

### Effect Stacking

Multiple upgrades stack **multiplicatively**:

```
Base production: 10/sec
Upgrade 1: ×2 multiplier
Upgrade 2: ×1.5 multiplier
Final: 10 × 2 × 1.5 = 30/sec
```

## Achievements

Track player milestones and display progress.

### Achievement Properties

| Property | Description | Example |
|----------|-------------|---------|
| **ID** | Unique identifier | `firstMillion` |
| **Name** | Display name | `Millionaire` |
| **Description** | Achievement text | `Earn 1,000,000 gold` |
| **Icon** | 8x8 pixel art | Trophy/medal icon |
| **Requirements** | Unlock conditions | Multiple types supported |

### Achievement Requirements

#### Resource Requirement
```javascript
{
  type: 'resource',
  resourceId: 'gold',
  amount: 1000000
}
```

#### Building Requirement
```javascript
{
  type: 'building',
  buildingId: 'goldMine',
  amount: 50           // Own 50 gold mines
}
```

#### Upgrade Requirement
```javascript
{
  type: 'upgrade',
  upgradeId: 'betterClicks'   // Purchase this upgrade
}
```

#### Playtime Requirement
```javascript
{
  type: 'playtime',
  seconds: 3600        // Play for 1 hour
}
```

### Achievement Checking

Achievements are automatically checked every game tick (10 times/second). When unlocked:
- Visual notification appears
- `onAchievementUnlock` logic event triggers
- Progress tracked in game state

## Prestige System

Reset the game for permanent bonuses.

### Prestige Properties

| Property | Description | Options |
|----------|-------------|---------|
| **Formula** | Currency calculation | Linear, Exponential, Logarithmic |
| **Base Value** | Formula parameter | Affects currency gain |
| **Currency Name** | Prestige currency | Default: `Prestige Points` |

### Prestige Formulas

#### Linear
```
prestigeCurrency = floor(totalResources / baseValue)
```
Simple division of total resources.

#### Exponential
```
prestigeCurrency = floor(totalResources^(1/baseValue))
```
Grows rapidly with resource accumulation.

#### Logarithmic
```
prestigeCurrency = floor(log(totalResources) * baseValue)
```
Slower growth, rewards long-term play.

### Prestige Effects

After prestiging:
- Game state resets (resources, buildings, upgrades)
- Prestige level increases
- Prestige currency accumulated
- Special prestige multipliers can be applied via logic

## Theme Customization

Customize the visual appearance of your game.

### Theme Properties

- **Primary Color** - Main accent color
- **Secondary Color** - Alternative highlights
- **Background Color** - Main background
- **Text Color** - Primary text
- **Font Family** - Typography choice

All colors support full hex color picker with alpha transparency.

## Best Practices

### Resource Design
- Start with 1-2 resources, expand gradually
- Use clear, intuitive names
- Design distinct icons for visual clarity
- Set reasonable click power values (1-10 for early game)

### Building Design
- Cost scaling 1.10-1.20 is balanced for most games
- Start with simple single-resource production
- Use unlock requirements to pace content
- Design building icons to reflect their purpose

### Upgrade Design
- 2x multipliers are powerful, use sparingly
- Combine multiple smaller upgrades for progression
- Use unlock requirements to create upgrade trees
- Name upgrades descriptively ("Double Gold Production")

### Achievement Design
- Create varied requirements (resources, buildings, playtime)
- Include easy early achievements for engagement
- Design challenging long-term achievements
- Use achievements to guide player strategy

## Next Steps

- **[Logic System](03-logic-system.md)** - Add custom behaviors
- **[Advanced Features](04-advanced-features.md)** - Deep mechanics
- **[Export & Share](05-export-share.md)** - Save your creation
