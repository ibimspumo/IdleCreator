# Quick Start Guide 🚀

## Öffne das Projekt

### Lokal (Empfohlen)

```bash
cd /path/to/idlecreator
python3 -m http.server 8000
```

Dann öffne: `http://localhost:8000`

### Oder direkt:
Doppelklick auf `index.html` (funktioniert auch, aber URL-Sharing geht nur mit Server)

---

## 1. Spiel erstellen (create.html)

### Schritt 1: Game Info
```
✏️ Game Name: Cookie Clicker
📝 Description: Click cookies!
👤 Author: Dein Name

🍪 Resource: Cookie / Cookies / 🍪
👆 Click Verb: Bake
📊 Cost Multiplier: 1.15
```

**Klick "Next →"**

### Schritt 2: Theme
```
🎨 Wähle Preset: "Dark Mode" (oder custom colors)
```

**Live Preview** zeigt deine Farben sofort!

**Klick "Next →"**

### Schritt 3: Upgrades
```
➕ Add First Upgrade:
   Name: Grandma
   Icon: 👵
   Description: Grandmas bake cookies
   Cost: 10
   Effect Type: Add Per Second
   Effect Value: 1
   Unlock: (leer lassen = immer verfügbar)

✅ Klick "Add Upgrade"
```

```
➕ Add Second Upgrade:
   Name: Factory
   Icon: 🏭
   Cost: 100
   Effect: Add Per Second
   Value: 10
   Unlock: Points Total >= 50

✅ Klick "Add Upgrade"
```

**Tipp**: Klick "👁️ Preview" oben rechts um das Spiel zu testen!

**Klick "Next →"**

### Schritt 4: Export
```
📊 Summary prüfen
🚀 Klick "Export Game"

Im Dialog:
📋 Klick "Copy" bei "Share URL"
```

---

## 2. Spiel teilen

### Option A: URL teilen
```
Paste die kopierte URL und teile sie:
http://localhost:8000/game.html#game=eyJtZXRhIjp7...

Freund öffnet URL → Spiel lädt automatisch! ✨
```

### Option B: Code teilen
```
📋 Kopiere "Base64 Code"
Sende den Code
Friend öffnet game.html
📥 Klick "Import"
Paste Code
🎮 Klick "Load Game"
```

### Option C: Datei teilen
```
📁 Klick "Download as JSON"
Sende cookie-clicker.json
Friend öffnet game.html
📥 Klick "Import"
Upload Datei
🎮 Klick "Load Game"
```

---

## 3. Spiel spielen (game.html)

```
🎮 Klick auf "CLICK" Button
💰 Sammle Cookies
🛒 Kaufe Upgrades
🔓 Schalte neue Upgrades frei
📈 Idle Progress (automatisch)
```

### Features:
- ✅ **Auto-Save** (alle 5 Sekunden)
- ✅ **Offline Progress** (verdienst auch wenn geschlossen)
- ✅ **Unlock System** (neue Upgrades freischalten)
- ✅ **Exponential Growth** (wird immer mächtiger)

### Keyboard Shortcuts:
- `R` = Reset (mit Bestätigung)
- `S` = Manual Save
- `+` = +100 Punkte (Debug)

---

## Troubleshooting 🔧

### Preview öffnet nicht?
1. Popup Blocker deaktivieren
2. Mindestens 1 Upgrade erstellt?
3. Browser Console öffnen (F12) → Errors?

### Import funktioniert nicht?
1. Valid Base64 Code?
2. Vollständiger Code kopiert?
3. Korrekte URL mit `#game=...`?

### Upgrade erscheint nicht?
1. Unlock Condition erfüllt?
2. Genug Punkte?
3. Console checken: `game.upgrades`

### Spiel speichert nicht?
1. LocalStorage enabled?
2. Private/Incognito Mode?
3. Console: `game.saveGame()`

---

## Console Debugging 🐛

### create.html
```javascript
// Template ansehen
creator.template.getSummary()

// Upgrades liste
creator.template.upgrades

// Preview testen
creator.preview()

// Verfügbare Effects
effectEngine.getAvailableTypes()
```

### game.html
```javascript
// Game State
game.points
game.totalPoints
game.pointsPerSecond

// Upgrades
game.upgrades
game.buyUpgrade('upgradeId')

// Template
template.getSummary()

// Export
ImportExportUI.showExportDialog(template)
```

---

## Beispiel: Space Miner ⚡

```javascript
// Step 1
Name: Space Miner
Resource: Crystal / Crystals / 💎
Click Verb: Mine

// Step 2
Theme: Ocean (für Space!)

// Step 3
Upgrades:
1. Mining Laser (👾, Cost 10, +1 Click)
2. Auto Miner (🤖, Cost 50, +0.5/sec)
3. Quantum Drill (⚡, Cost 200, +5/sec, Unlock: 100 Crystals)
4. Asteroid Belt (☄️, Cost 1000, +20/sec, Unlock: Quantum Drill Level 5)

// Step 4
Export & Share!
```

---

## Effect Types Cheat Sheet 📚

```
add_click_power         → +X per click
add_per_second          → +X per second
multiply_click_power    → Click * X
multiply_per_second     → PPS * X
multiply_all            → Everything * X
double_everything       → Everything * 2
exponential_click_power → Click Power ^ X
click_power_from_pps    → Click += PPS * X
```

## Condition Types Cheat Sheet 🔓

```
always                  → Immer verfügbar
points_current          → Aktuelle Punkte >= X
points_total            → Total verdient >= X
total_clicks            → Anzahl Clicks >= X
points_per_second       → PPS >= X
click_power             → Click Power >= X
upgrade_level           → Upgrade Level >= X
total_upgrades_bought   → Gekaufte Upgrades >= X
playtime                → Spielzeit >= X (Sekunden)
```

---

## Weitere Ideen 💡

### Cookie Clicker
- Grandma, Farm, Factory, Bank, Temple
- Exponential scaling
- Golden Cookies (als hohe Unlock Condition)

### Space Miner
- Laser, Drone, Station, Fleet
- Sci-Fi Theme (Ocean colors!)
- Quantum upgrades

### Kingdom Builder
- Peasant, Knight, Castle, Empire
- Medieval Theme (Forest!)
- Prestige-like upgrades

### Magic Crystals
- Collect, Enchant, Summon
- Magical Theme (Sunset!)
- Spell-based multipliers

---

## Support & Feedback 🤝

- GitHub Issues: [Link zu deinem Repo]
- Dokumentation: `PHASE_1_COMPLETE.md`, `PHASE_2_COMPLETE.md`, `PHASE_3_COMPLETE.md`
- Architecture: `PROJECT_STRUCTURE.md`

---

**Das war's! Viel Spaß beim Erstellen deiner Idle Games! 🎮✨**
