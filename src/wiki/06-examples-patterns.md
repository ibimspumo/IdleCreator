# Examples & Patterns

Learn from real-world logic patterns and complete game examples.

## Basic Patterns

### Welcome Bonus

**Goal:** Give players starting resources when the game begins.

**Pattern:**
```
onGameStart
  → Add Resource (gold, 100)
  → Show Notification ("Welcome! Here's 100 gold to start!")
```

**Use when:** Every game should give players something to start with.

---

### Click Bonus

**Goal:** Reward active clicking with bonus resources.

**Pattern:**
```
onClick (gold)
  → Add Resource (gold, clickPower)
  → Random (10%)
    ✓ → Add Resource (gold, 10)
       → Show Notification ("Lucky click! +10 bonus gold!")
```

**Variations:**
- Increasing bonus per click
- Streak bonuses for consecutive clicks
- Time-limited click bonuses

---

### Progressive Unlock

**Goal:** Unlock buildings/upgrades at specific milestones.

**Pattern:**
```
afterXResources (gold, 100)
  → Unlock Building (goldMine)
  → Show Notification ("Gold Mine unlocked!")

afterXResources (gold, 500)
  → Unlock Building (goldFactory)
  → Show Notification ("Gold Factory unlocked!")

afterXResources (gold, 1000)
  → Unlock Upgrade (betterProduction)
  → Show Notification ("Better Production upgrade available!")
```

**Use when:** Pacing content reveals throughout the game.

---

### Milestone Rewards

**Goal:** Reward players for reaching specific achievements.

**Pattern:**
```
afterXBuildings (goldMine, 10)
  → Branch
    → Add Resource (gems, 5)
    → Show Notification ("10 Gold Mines! Bonus: 5 gems!")
    → Unlock Achievement (dedication)
```

**Variations:**
- Multiple milestone tiers (10, 25, 50, 100)
- Different rewards per tier
- Escalating bonuses

---

### Auto-Clicker

**Goal:** Automatically click resources for players with upgrades.

**Pattern:**
```
onTick
  → If Upgrade Owned (autoClicker)
    ✓ → Add Resource (gold, 1)
```

**Improved version:**
```
afterBoughtUpgrade (autoClicker)
  → Show Notification ("Auto-clicker activated!")

onTick
  → If Upgrade Owned (autoClicker)
    ✓ → If Upgrade Owned (fasterAutoClicker)
      ✓ → Add Resource (gold, 5)
      ✗ → Add Resource (gold, 1)
```

**Warning:** onTick runs 10 times/second - use carefully!

---

### Timed Events

**Goal:** Trigger special events after specific time periods.

**Pattern:**
```
afterXSeconds (300)  // 5 minutes
  → Branch
    → Multiply Production (gold, 1.5)
    → Show Notification ("5 minute bonus! Production x1.5 for 30 seconds!")
    → Delay (30)
    → Multiply Production (gold, 0.667)  // Reverse 1.5x (1/1.5)
    → Show Notification ("Bonus ended!")
```

**Variations:**
- Hourly bonuses
- Daily login rewards (requires persistence)
- Random timed events

---

## Intermediate Patterns

### Dynamic Click Power

**Goal:** Increase click power based on player progression.

**Pattern:**
```
afterXClicks (gold, 100)
  → Set Click Power (5)
  → Show Notification ("100 clicks! Click power increased to 5!")

afterXClicks (gold, 500)
  → Set Click Power (10)
  → Show Notification ("500 clicks! Click power increased to 10!")

afterXClicks (gold, 1000)
  → Set Click Power (25)
  → Show Notification ("1000 clicks! Click power increased to 25!")
```

**Tip:** Use geometric progression (1 → 5 → 10 → 25 → 50).

---

### Building Synergy

**Goal:** Bonuses when owning multiple building types.

**Pattern:**
```
afterXBuildings (goldMine, 10)
  → If Building Owned (goldFactory)
    ✓ → Multiply Production (gold, 1.25)
       → Show Notification ("Synergy bonus! Mines + Factory = +25% gold production!")
```

**Advanced:**
```
onTick
  → If Building (goldMine >= 10)
    ✓ → If Building (goldFactory >= 5)
      ✓ → If Building (goldBank >= 1)
        ✓ → Multiply Production (all, 2.0)
```

**Note:** Complex conditions can impact performance - test carefully!

---

### Prestige Incentive

**Goal:** Encourage prestiging by showing potential gains.

**Pattern:**
```
afterXResources (gold, 1000000)
  → If Prestige Level (== 0)
    ✓ → Show Notification ("You can prestige for 1000 prestige points!")
       → Delay (5)
       → Show Notification ("Prestige to gain permanent bonuses!")
```

**Post-prestige rewards:**
```
onPrestige
  → Branch
    → Multiply Production (all, 1.1)
    → Add Click Power (prestigeLevel * 2)
    → Show Notification ("Prestige complete! +10% production, +click power!")
```

---

### Combo System

**Goal:** Reward rapid clicking with escalating bonuses.

**Pattern:**
```
onClick (gold)
  → Add Resource (comboCounter, 1)
  → Delay (2)
  → Set Resource (comboCounter, 0)

afterXResources (comboCounter, 5)
  → Multiply Click Power (2)
  → Show Notification ("5x Combo! Double click power!")

afterXResources (comboCounter, 10)
  → Multiply Click Power (3)
  → Show Notification ("10x Combo! Triple click power!")
```

**Reset mechanism:** Combo decays after 2 seconds of inactivity.

---

### Secret Achievements

**Goal:** Hidden achievements that surprise players.

**Pattern:**
```
onClick (gold)
  → Random (0.01%)  // 1 in 10,000 clicks
    ✓ → Unlock Achievement (luckyClick)
       → Add Resource (gems, 100)
       → Show Notification ("SECRET: Incredibly lucky click! +100 gems!")
```

**Other secrets:**
```
afterPlaytime (7200)  // 2 hours
  → If Building (goldMine == 0)  // No mines owned
    ✓ → Unlock Achievement (clickPurist)
       → Show Notification ("SECRET: Click Purist - 2 hours without buying buildings!")
```

---

### Upgrade Trees

**Goal:** Interconnected upgrades with prerequisites.

**Pattern:**
```
afterBoughtUpgrade (basicClicks)
  → Unlock Upgrade (betterClicks)

afterBoughtUpgrade (betterClicks)
  → Unlock Upgrade (bestClicks)

afterBoughtUpgrade (basicProduction)
  → Branch
    → Unlock Upgrade (goldProduction)
    → Unlock Upgrade (gemProduction)
```

**Visual:**
```
basicClicks → betterClicks → bestClicks
                    ↓
              advancedClicks
```

---

## Advanced Patterns

### Soft Reset System

**Goal:** Reset progress for bonuses without full prestige.

**Pattern:**
```
// Create "soft reset" button via custom resource
afterXResources (softResetToken, 1)
  → Branch
    → Set Resource (gold, 0)
    → Set Resource (gems, 0)
    → Loop (allBuildings)
      → Set Building (owned, 0)
    → Multiply Production (all, 1.5)
    → Show Notification ("Soft reset! +50% production permanently!")
    → Set Resource (softResetToken, 0)
```

**Note:** Requires manual building reset logic.

---

### Challenge Modes

**Goal:** Optional difficulty modifiers for bonus rewards.

**Pattern:**
```
afterBoughtUpgrade (hardMode)
  → Branch
    → Multiply Production (all, 0.5)  // Halve production
    → Multiply Click Power (0.5)      // Halve click power
    → Show Notification ("Hard mode activated! Double rewards on prestige!")

onPrestige
  → If Upgrade Owned (hardMode)
    ✓ → Multiply Production (all, 2.2)  // 2x normal bonus (1.1 * 2)
    ✗ → Multiply Production (all, 1.1)
```

---

### Dynamic Events

**Goal:** Random events that modify game state temporarily.

**Pattern:**
```
onTick
  → Random (0.1%)  // 1 in 1000 ticks ≈ every 100 seconds
    ✓ → Branch
      → Show Notification ("GOLD RUSH! 10x production for 10 seconds!")
      → Multiply Production (gold, 10)
      → Delay (10)
      → Multiply Production (gold, 0.1)
      → Show Notification ("Gold rush ended!")
```

**Variations:**
- Multiple event types (bonuses, penalties, special resources)
- Weighted random (some events rarer than others)
- Event duration scales with prestige level

---

### Ascension System

**Goal:** Multiple prestige layers with increasing power.

**Pattern:**
```
// First prestige
onPrestige
  → If Prestige Level (< 10)
    ✓ → Multiply Production (all, 1.1)
    ✗ → Show Notification ("Max prestige reached! Unlock Ascension!")
       → Unlock Upgrade (ascension)

// Ascension (super prestige)
afterBoughtUpgrade (ascension)
  → Branch
    → Set Prestige Level (0)
    → Set Prestige Currency (0)
    → Add Resource (ascensionPoints, 1)
    → Multiply Production (all, 2.0)
    → Show Notification ("ASCENSION COMPLETE! Production doubled!")
```

---

### Branching Paths

**Goal:** Player choices that affect game progression.

**Pattern:**
```
afterXResources (gold, 10000)
  → Branch
    → Unlock Upgrade (pathOfSpeed)
    → Unlock Upgrade (pathOfPower)
    → Show Notification ("Choose your path!")

afterBoughtUpgrade (pathOfSpeed)
  → Branch
    → Multiply Production (all, 3.0)
    → Multiply Click Power (0.5)
    → Unlock Building (speedBuildings...)

afterBoughtUpgrade (pathOfPower)
  → Branch
    → Multiply Production (all, 1.0)
    → Multiply Click Power (5.0)
    → Unlock Building (powerBuildings...)
```

**Note:** Mutually exclusive upgrades create replayability.

---

### Auto-Balancing

**Goal:** Adjust difficulty based on player performance.

**Pattern:**
```
afterXSeconds (300)  // Every 5 minutes
  → If Production Rate (gold >= 1000)
    ✓ → Branch
      → Multiply Building Costs (all, 1.2)
      → Show Notification ("Economy adjusted! Costs increased.")
```

**Note:** Cost scaling modification requires custom logic.

---

## Complete Game Examples

### Example 1: Classic Clicker

**Game Structure:**
- 1 resource: Gold
- 3 buildings: Mine, Factory, Bank
- 5 upgrades: Better clicks, 2x production, auto-clicker, faster auto-clicker, mega production
- 10 achievements: Various milestones
- Linear prestige

**Key Logic:**
```
onGameStart
  → Add Resource (gold, 50)
  → Show Notification ("Welcome to Gold Clicker!")

onClick (gold)
  → Add Resource (gold, clickPower)

afterXResources (gold, 100)
  → Unlock Building (goldMine)

afterXResources (gold, 1000)
  → Unlock Building (goldFactory)

afterXResources (gold, 10000)
  → Unlock Building (goldBank)

afterBoughtUpgrade (autoClicker)
  → onTick → If Upgrade Owned (autoClicker)
    ✓ → Add Resource (gold, 1)

afterXBuildings (goldMine, 25)
  → Unlock Achievement (miningMagnate)
  → Add Resource (gold, 10000)
```

---

### Example 2: Multi-Resource Empire

**Game Structure:**
- 3 resources: Wood, Stone, Gold
- 6 buildings: Lumber Mill, Quarry, Gold Mine, Sawmill, Stoneworks, Mint
- Buildings produce multiple resources
- Upgrades affect specific resources
- Exponential prestige

**Key Logic:**
```
onGameStart
  → Branch
    → Add Resource (wood, 10)
    → Add Resource (stone, 10)
    → Add Resource (gold, 10)

afterXResources (wood, 50)
  → Unlock Building (lumberMill)

afterXResources (stone, 50)
  → Unlock Building (quarry)

afterXBuildings (lumberMill, 10)
  → If Building (quarry >= 10)
    ✓ → Unlock Building (sawmill)
       → Show Notification ("Synergy unlocked: Sawmill!")

afterBoughtUpgrade (efficientWoodcutting)
  → Multiply Production (wood, 2.0)

onPrestige
  → Loop (prestigeLevel)
    → Multiply Production (all, 1.05)
```

---

### Example 3: Incremental RPG

**Game Structure:**
- Resources: XP, Gold, Gems
- Buildings: Training Ground, Quest Board, Dungeon
- Upgrades: Stat boosts, skill unlocks
- Achievements: Level milestones, boss defeats
- Logarithmic prestige (rebirth)

**Key Logic:**
```
onClick (xp)
  → Add Resource (xp, clickPower)
  → Random (5%)
    ✓ → Add Resource (gold, 1)
       → Show Notification ("Found 1 gold!")

afterXResources (xp, 100)
  → Branch
    → Set Resource (xp, 0)
    → Add Resource (level, 1)
    → Multiply Click Power (1.1)
    → Show Notification ("LEVEL UP! Click power increased!")

afterXResources (level, 10)
  → Unlock Building (questBoard)

afterBoughtBuilding (questBoard)
  → onTick → If Building Owned (questBoard)
    ✓ → Random (1%)
      ✓ → Branch
        → Add Resource (gold, 10)
        → Add Resource (gems, 1)
        → Show Notification ("Quest completed!")

onPrestige  // Rebirth
  → Branch
    → Add Resource (rebirthTokens, prestigePoints)
    → Set Resource (xp, 0)
    → Set Resource (gold, 0)
    → Set Resource (level, 1)
    → Loop (rebirthTokens)
      → Multiply Production (all, 1.02)
```

---

## Design Tips

### Balancing

**Early game (0-5 minutes):**
- Fast progression
- Frequent unlocks
- Clear goals

**Mid game (5-30 minutes):**
- Slower progression
- Strategic choices
- Upgrade trees

**Late game (30+ minutes):**
- Prestige incentive
- Long-term goals
- Achievement hunting

### Pacing

**Content unlocks:**
- Every 1-2 minutes early game
- Every 5-10 minutes mid game
- Every 15-30 minutes late game

**Resource scaling:**
```
Resource cost = baseAmount * (1.15 ^ owned)
```
Adjust 1.15 scaling factor based on testing.

### Feedback

**Always provide:**
- Visual notifications for milestones
- Progress indicators
- Clear unlock conditions
- Tooltips with explanations

### Testing

**Playtest checklist:**
- [ ] Can reach first building in <1 minute
- [ ] Prestige available within 20-30 minutes
- [ ] All achievements unlockable
- [ ] No dead-end progression paths
- [ ] Costs scale reasonably
- [ ] Notifications aren't spammy

---

## Next Steps

- **[Troubleshooting](07-troubleshooting.md)** - Fix issues in your logic
- **[API Reference](08-api-reference.md)** - Technical documentation
- **[Getting Started](01-getting-started.md)** - Return to basics
