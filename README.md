# Idle Game Creator

A powerful web-based tool for creating and playing custom idle/clicker games without coding. Built with React and Vite.

## Features

### 🎮 Game Creation
- **Visual Editor** - Figma-style interface with sidebar navigation
- **No Coding Required** - Create complete idle games through an intuitive UI
- **Live Preview** - See your game elements in real-time as you build

### 🎨 Customization
- **Resources** - Define clickable and auto-generated currencies
- **Buildings** - Create generators with cost scaling and production rates
- **Upgrades** - One-time purchases with unlock requirements and multiplier effects
- **Achievements** - Goal-based rewards with custom requirements
- **Themes** - Full visual customization with color schemes and fonts
- **Pixel Art Editor** - Built-in 8x8 pixel art creator for custom icons

### 🔧 Game Mechanics
- **Cost Scaling** - Exponential building costs (e.g., x1.15 per purchase)
- **Production System** - Automatic resource generation per second
- **Multiplier Effects** - Stack upgrades for exponential growth
- **Prestige System** - Reset with permanent bonuses (sqrt/log/linear formulas)
- **Requirement System** - Complex unlock conditions (resources, buildings, clicks, etc.)

### 💾 Import/Export
- **Compressed Format** - Games export as compact text strings
- **Easy Sharing** - Share your games via simple copy-paste
- **No Account Needed** - Create and play without registration
- **Auto-Save** - Games auto-save to browser localStorage

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs on `http://localhost:5173`

## Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **LZ-String** - Data compression for export/import
- **CSS Variables** - Theming system
- **Canvas API** - Pixel art rendering

## Usage

### Creating a Game

1. **Start Editor** - Click "Create Game" on the home screen
2. **Add Resources** - Define your game's currencies
3. **Create Buildings** - Set up generators with costs and production
4. **Add Upgrades** - Create multipliers and enhancements
5. **Set Achievements** - Define goals and milestones
6. **Customize Theme** - Choose colors and styling
7. **Export** - Generate a shareable game code

### Playing a Game

1. Click "Import Game" on the home screen
2. Paste a game code
3. Click "Load Game"
4. Start playing!

### Custom Icons

The built-in pixel art editor allows you to create 8x8 custom icons:

- Click "Pixel Art" next to any icon field
- Use Draw, Erase, and Fill tools
- Choose from preset colors or add custom ones
- Apply transformations (Clear, Invert, Mirror)
- Icons are efficiently compressed and display at any size

## Editor Interface

```
┌─────────────────────────────────────────────────────────┐
│                       Toolbar                            │
│  Title  │  [Game] [Theme]  │  [Preview] [Export]       │
├────────┬────────────────────────────────────┬───────────┤
│        │                                    │           │
│  Left  │         Canvas Area                │  Right    │
│ Sidebar│      (Visual Workspace)            │ Sidebar   │
│        │                                    │           │
│ Layers │                                    │Properties │
│        │                                    │           │
└────────┴────────────────────────────────────┴───────────┘
```

## Project Structure

```
idlecreator/
├── src/
│   ├── components/
│   │   ├── Editor/          # Game creation interface
│   │   │   ├── GameEditor.jsx
│   │   │   ├── PropertyPanels.jsx
│   │   │   ├── PixelArtEditor.jsx
│   │   │   └── CustomSelect.jsx
│   │   ├── Player/          # Game runtime
│   │   │   └── GamePlayer.jsx
│   │   └── Preview/         # Live preview cards
│   │       └── PreviewCards.jsx
│   ├── engine/              # Game logic
│   │   ├── GameEngine.js
│   │   └── PrestigeEngine.js
│   ├── utils/               # Helpers
│   │   ├── compression.js
│   │   └── formatters.js
│   └── styles/              # CSS modules
├── public/
└── package.json
```

## Game Data Structure

Games are stored as JSON with the following structure:

```javascript
{
  meta: { title, author, description, version },
  resources: [{ id, name, icon, clickable, clickAmount, startAmount }],
  buildings: [{ id, name, icon, description, cost, costScaling, produces }],
  upgrades: [{ id, name, icon, description, cost, effects, unlockRequirements }],
  achievements: [{ id, name, icon, description, requirements }],
  prestige: { enabled, baseResource, formula, bonuses },
  theme: { colors, fonts, borderRadius }
}
```

## Game Engine

The core game engine (`GameEngine.js`) handles:

- **Tick System** - 10 updates per second (100ms intervals)
- **Resource Management** - Track amounts and per-second rates
- **Building Economics** - Calculate scaled costs and production
- **Upgrade Effects** - Apply multipliers to click/production
- **Achievement Tracking** - Monitor progress and unlock rewards
- **State Management** - Save/load game state

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Created with React, Vite, and passion for incremental games.

---

**Made with Claude Code** 🤖
