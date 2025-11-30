# Getting Started

Welcome to **Idle Game Creator** - a powerful no-code framework for building incremental games!

## What is Idle Game Creator?

Idle Game Creator allows you to create complete idle/incremental games without writing a single line of code. Using visual editors and a node-based logic system, you can design complex game mechanics, progression systems, and custom behaviors.

## Quick Start Guide

### 1. Launch the Application

```bash
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to access the editor.

### 2. Understanding the Interface

The application has 4 main tabs:

- **📝 Editor** - Define game elements (resources, buildings, upgrades, achievements)
- **🎮 Player** - Test and play your game in real-time
- **🔧 Logic** - Create custom game behaviors with visual programming
- **⚙️ Settings** - Configure theme, export/import game data

### 3. Create Your First Resource

1. Go to the **Editor** tab
2. In the left sidebar, find the **Resources** section
3. Click **+ Add Resource**
4. Configure your resource:
   - **ID**: `gold` (unique identifier)
   - **Name**: `Gold`
   - **Description**: `The main currency`
   - **Icon**: Click to open pixel art editor
   - **Click Power**: `1` (amount per click)
   - **Start Amount**: `0`

### 4. Test in Player Mode

1. Switch to the **Player** tab
2. Click the resource to earn it
3. Watch your gold increase!

### 5. Add Your First Building

1. Return to the **Editor** tab
2. In the **Buildings** section, click **+ Add Building**
3. Configure:
   - **ID**: `goldMine`
   - **Name**: `Gold Mine`
   - **Description**: `Automatically produces gold`
   - **Costs**: Set initial cost (e.g., 10 gold)
   - **Production**: Select gold resource, set amount per second

### 6. Create Logic with Visual Programming

1. Go to the **Logic** tab
2. You'll see a node graph with an `onGameStart` event
3. Drag nodes from the toolbox on the left
4. Connect nodes to create game behaviors

**Example - Welcome Bonus:**
1. Drag `onGameStart` event (already present)
2. Drag `Add Resource` action node
3. Connect them
4. Configure the action to add 100 gold
5. Test in Player mode!

## Key Concepts

### Resources
What the player collects (coins, gems, points, etc.). Resources can be earned by:
- Clicking
- Passive production from buildings
- Logic node actions

### Buildings
Production units that generate resources automatically. Features:
- Exponential cost scaling
- Multiple resource production
- Unlock requirements
- Maximum ownership limits

### Upgrades
One-time purchases that provide permanent bonuses:
- Multiply resource production
- Multiply click power
- Add flat production bonuses

### Achievements
Milestone tracking system with requirements:
- Resource thresholds
- Building counts
- Upgrade counts
- Playtime milestones

### Logic System
Visual programming with node-based flow:
- **Events** - Triggers (onGameStart, onTick, onClick, etc.)
- **Actions** - State changes (add resource, unlock building, etc.)
- **Conditions** - Branching logic (if resource >= X, if building owned, etc.)
- **Logic Nodes** - Flow control (delay, random, loop, branch)

## Next Steps

- **[Game Elements](02-game-elements.md)** - Detailed guide to resources, buildings, upgrades
- **[Logic System](03-logic-system.md)** - Master the visual programming system
- **[Advanced Features](04-advanced-features.md)** - Prestige, custom formulas, optimization
- **[Export & Share](05-export-share.md)** - Save and share your games

## Tips for Beginners

1. **Start Simple** - Begin with one resource and one building
2. **Test Frequently** - Switch to Player tab often to test changes
3. **Use Logic Gradually** - Master basic nodes before complex flows
4. **Study Examples** - Check the code preview to understand logic behavior
5. **Iterate** - Games evolve through testing and refinement

Happy creating! 🎮
