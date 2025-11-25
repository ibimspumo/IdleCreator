# Idle Game Creator 🎮

**Create your own idle/incremental games without coding!**

A complete no-code platform for building, customizing, and sharing idle games. Built with vanilla JavaScript, HTML, and CSS - no frameworks, no build tools, no dependencies.

[Live Demo](#) | [Quick Start Guide](QUICK_START.md) | [Documentation](#documentation)

---

## ✨ Features

### 🎨 Visual Game Creator
- **No coding required** - Everything through intuitive UI
- **Multi-step wizard** - Guided creation process
- **Live preview** - See your game instantly
- **15+ effect types** - From simple additions to exponential growth
- **20+ unlock conditions** - Create progression systems
- **Custom themes** - 5 presets + full color customization

### 🎮 Full-Featured Game Engine
- **Auto-save system** - Never lose progress
- **Offline progression** - Earn while closed
- **Unlock system** - Progressive content discovery
- **Dynamic rendering** - Template-driven UI
- **Exponential scaling** - Classic idle game feel
- **Responsive design** - Works on desktop and mobile

### 🔗 Easy Sharing
- **Share URL** - One-click shareable links
- **Base64 export** - Copy & paste game code
- **JSON download** - Portable game files
- **Import system** - 3 import methods

---

## 🚀 Quick Start

### 1. Clone & Run

```bash
git clone https://github.com/yourusername/idlecreator.git
cd idlecreator
python3 -m http.server 8000
```

Open: `http://localhost:8000`

### 2. Create Your First Game

1. **Go to** `create.html`
2. **Fill in game info** (name, resources, settings)
3. **Choose theme** (colors and presets)
4. **Add upgrades** using dropdown menus
5. **Preview** your game instantly
6. **Export & share** via URL or code

### 3. Play & Share

- Open the exported URL → Game loads automatically
- Share with friends → They play instantly
- Import existing games → Modify and remix

See [QUICK_START.md](QUICK_START.md) for detailed walkthrough.

---

## 📦 What's Included

### Pages
- **index.html** - Landing page
- **game.html** - Game player
- **create.html** - Game creator

### Core Engine (`src/core/`)
- **GameTemplate.js** - Template system
- **IdleGame.js** - Game engine
- **Upgrade.js** - Upgrade class

### Engine Systems (`src/engine/`)
- **EffectEngine.js** - 15+ effect types
- **ConditionEngine.js** - 20+ condition types
- **DynamicRenderer.js** - Template-based rendering

### Creator Components (`src/creator/`)
- **CreatorApp.js** - Main creator logic
- **EffectBuilder.js** - Visual effect selector
- **ConditionBuilder.js** - Visual condition selector
- **UpgradeBuilder.js** - Upgrade form handler
- **ThemeBuilder.js** - Theme & color picker

### Utilities (`src/utils/`)
- **compression.js** - Base64 export/import
- **templateLoader.js** - Template loading system
- **formatters.js** - Number formatting

---

## 🎯 Example: Cookie Clicker

```javascript
// Step 1: Game Info
Name: Cookie Clicker
Resource: Cookie / Cookies / 🍪
Click Verb: Bake

// Step 2: Theme
Preset: Dark Mode

// Step 3: Upgrades
1. Grandma (👵, Cost: 10, +1/sec)
2. Farm (🌾, Cost: 100, +5/sec, Unlock: 50 cookies)
3. Factory (🏭, Cost: 1000, +50/sec, Unlock: 500 cookies)

// Step 4: Export
Share URL: http://localhost:8000/game.html#game=eyJtZXRh...
```

More examples in [QUICK_START.md](QUICK_START.md)

---

## 🛠️ Architecture

### Template-Based System
```javascript
{
  meta: { name, description, author, version },
  resources: { primary: { name, icon, clickVerb } },
  theme: { primaryColor, secondaryColor, ... },
  settings: { tickRate, saveInterval, costMultiplier },
  upgrades: [ { id, name, icon, baseCost, effect, unlockCondition } ]
}
```

### Effect Engine (Whitelisted Types)
```javascript
- add_click_power         // +X per click
- add_per_second          // +X per second
- multiply_click_power    // Click * X
- multiply_per_second     // PPS * X
- multiply_all            // Everything * X
- double_everything       // Everything * 2
- exponential_click_power // Click ^ X
// ... 8 more types
```

### Condition Engine (Whitelisted Types)
```javascript
- points_current          // Current points >= X
- points_total            // Total earned >= X
- total_clicks            // Click count >= X
- upgrade_level           // Upgrade level >= X
- points_per_second       // PPS >= X
- click_power             // Click power >= X
// ... 14 more types
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for details.

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Step-by-step guide
- **[PHASE_1_COMPLETE.md](PHASE_1_COMPLETE.md)** - Foundation system
- **[PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md)** - Import/Export system
- **[PHASE_3_COMPLETE.md](PHASE_3_COMPLETE.md)** - Creator MVP
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture overview

---

## 🎨 Effect Types Reference

| Effect Type | Description | Example |
|-------------|-------------|---------|
| `add_click_power` | Adds to click power | +1 per click |
| `add_per_second` | Adds to idle production | +5 per second |
| `multiply_click_power` | Multiplies click power | Click × 2 |
| `multiply_per_second` | Multiplies production | PPS × 1.5 |
| `multiply_all` | Multiplies everything | All × 2 |
| `double_everything` | Doubles all values | 2x multiplier |
| `exponential_click_power` | Exponential growth | Click^1.1 |
| `click_power_from_pps` | Click from production | Click += PPS × 0.1 |

[See all 15+ types →](PHASE_1_COMPLETE.md#effect-types)

---

## 🔓 Unlock Conditions Reference

| Condition Type | Description | Example |
|----------------|-------------|---------|
| `points_current` | Current points | >= 100 points |
| `points_total` | Total earned | >= 1000 total |
| `total_clicks` | Click count | >= 50 clicks |
| `upgrade_level` | Upgrade level | Grandma >= 5 |
| `click_power` | Click power | >= 10 power |
| `points_per_second` | Production rate | >= 20 PPS |
| `total_upgrades_bought` | Upgrades owned | >= 3 upgrades |
| `playtime` | Time played | >= 300 seconds |

[See all 20+ types →](PHASE_1_COMPLETE.md#condition-types)

---

## 🔧 Console Debugging

### In Creator (`create.html`)
```javascript
// View template
creator.template.getSummary()

// List upgrades
creator.template.upgrades

// Test preview
creator.preview()

// Available effects
effectEngine.getAvailableTypes()
```

### In Game (`game.html`)
```javascript
// Game state
game.points
game.totalPoints
game.pointsPerSecond

// Upgrades
game.upgrades
game.buyUpgrade('upgradeId')

// Manual save
game.saveGame()

// Export dialog
ImportExportUI.showExportDialog(template)
```

---

## 🌟 Use Cases

### Educational
- Teach game design concepts
- Learn progression systems
- Understand exponential growth
- Practice UI/UX design

### Game Development
- Prototype idle games quickly
- Test balance and progression
- Share concepts with team
- Create game templates

### Community
- Share custom games
- Remix existing games
- Create game challenges
- Build game collections

---

## 🚀 Deployment

### GitHub Pages
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages
# Settings → Pages → Source: main branch
```

Your game creator is now live at:
`https://yourusername.github.io/idlecreator/`

### Other Platforms
- **Netlify** - Drag & drop folder
- **Vercel** - Connect GitHub repo
- **Surge** - `surge .` in project directory

No build step required - it's pure static HTML/CSS/JS!

---

## 🔒 Security

- ✅ **No eval()** - No dynamic code execution
- ✅ **Whitelisted types** - Only predefined effects/conditions
- ✅ **Input validation** - All templates validated
- ✅ **Safe sharing** - Base64 encoded JSON only
- ✅ **No backend** - Fully client-side

Templates are pure data - no code execution from user input.

---

## 🎯 Roadmap

### Planned Features
- [ ] Achievement system
- [ ] Prestige/rebirth mechanics
- [ ] Visual upgrade tree editor
- [ ] Drag & drop upgrade ordering
- [ ] Template gallery/marketplace
- [ ] Sound effects support
- [ ] Animation customization
- [ ] Multiplayer/leaderboards

See [PHASE_3_COMPLETE.md](PHASE_3_COMPLETE.md#next-possible-enhancements) for full list.

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- Pure vanilla JavaScript (ES6+)
- CSS3 with custom properties
- HTML5
- No frameworks or dependencies

Inspired by classic idle games:
- Cookie Clicker
- Adventure Capitalist
- Realm Grinder

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/idlecreator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/idlecreator/discussions)
- **Documentation**: See `docs/` folder

---

## 📊 Stats

- **Files**: 21 JavaScript modules, 5 CSS modules, 3 HTML pages
- **Lines of Code**: ~3000+ JavaScript, ~1500+ CSS
- **Features**: 35+ major features
- **Effect Types**: 15+ predefined
- **Condition Types**: 20+ predefined
- **Dependencies**: 0 (zero!)

---

**Made with ❤️ for the idle game community**

[⭐ Star this repo](https://github.com/yourusername/idlecreator) if you find it useful!
