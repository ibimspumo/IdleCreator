# Idle Clicker - Projekt Struktur

## Verzeichnisstruktur

```
src/
├── core/           # Kern-Engine des Spiels
│   ├── IdleGame.js    # Haupt-Game-Loop, State-Management, Events
│   └── Upgrade.js     # Upgrade-System, Unlock-Logik
│
├── ui/             # UI-Komponenten und Display-Funktionen
│   ├── display.js     # Display-Updates (Points, Stats)
│   ├── upgradeCard.js # Upgrade-Karten erstellen/updaten
│   └── notifications.js # Benachrichtigungen (Unlock-Popups)
│
├── upgrades/       # Upgrade-Definitionen
│   └── upgradeDefinitions.js # Alle Upgrade-Configs
│
├── utils/          # Hilfsfunktionen
│   └── formatters.js # Zahlen-Formatierung (K, M, etc.)
│
└── app.js          # Main Entry Point - initialisiert alles
```

## Module-Beschreibung

### Core (Kern-Engine)

#### `IdleGame.js`
- **Zweck**: Haupt-Game-Engine
- **Verantwortlich für**:
  - Game Loop (Tick-System)
  - State Management (Punkte, Stats)
  - Event System (on/emit)
  - Save/Load System
  - Upgrade-Management
  - Unlock-System

#### `Upgrade.js`
- **Zweck**: Upgrade-Klasse
- **Verantwortlich für**:
  - Upgrade-Eigenschaften (Level, Kosten, Effekte)
  - Unlock-Conditions
  - Kosten-Berechnung
  - Effekt-Anwendung

### UI (User Interface)

#### `display.js`
- **Zweck**: Display-Updates
- **Funktionen**:
  - `updatePointsDisplay()` - Aktualisiert Punkte-Anzeige
  - `updateStatsDisplay()` - Aktualisiert Stats (PPS, Click Power)
  - `updateUpgradesDisplay()` - Aktualisiert alle Upgrade-Karten

#### `upgradeCard.js`
- **Zweck**: Upgrade-Karten UI
- **Funktionen**:
  - `createUpgradeCard()` - Erstellt HTML für Upgrade-Karte
  - `updateUpgradeCard()` - Aktualisiert einzelne Karte

#### `notifications.js`
- **Zweck**: Benachrichtigungen
- **Funktionen**:
  - `showUnlockNotification()` - Zeigt Unlock-Popup

### Upgrades

#### `upgradeDefinitions.js`
- **Zweck**: Zentrale Upgrade-Definitionen
- **Enthält**: Alle Upgrade-Configs (Basis + Locked)

### Utils

#### `formatters.js`
- **Zweck**: Hilfsfunktionen
- **Funktionen**:
  - `formatNumber()` - Formatiert Zahlen (1000 → 1.00K)

### App

#### `app.js`
- **Zweck**: Main Entry Point
- **Verantwortlich für**:
  - Initialisierung der Game-Instanz
  - Setup von Event Listeners
  - Verbindung zwischen Game-Engine und UI
  - Debug-Funktionen

## Wie man neue Features hinzufügt

### Neues Upgrade hinzufügen
→ `src/upgrades/upgradeDefinitions.js` bearbeiten

### Neue UI-Komponente
→ Neue Datei in `src/ui/` erstellen, in `game.html` einbinden

### Neue Game-Mechanik
→ `src/core/IdleGame.js` erweitern

### Neue Unlock-Bedingung
→ `unlockCondition` in `upgradeDefinitions.js` definieren

## Vorteile dieser Struktur

✅ **Modular**: Jede Datei hat eine klare Verantwortung
✅ **Wartbar**: Leicht zu finden, wo Änderungen gemacht werden müssen
✅ **Erweiterbar**: Neue Features können einfach hinzugefügt werden
✅ **Testbar**: Module können einzeln getestet werden
✅ **Lesbar**: Klare Struktur, schnell zu verstehen

## Load-Reihenfolge (wichtig!)

Die Scripts müssen in dieser Reihenfolge geladen werden:

1. **Core** (Upgrade.js → IdleGame.js)
2. **Utils** (formatters.js)
3. **Upgrade Definitions** (upgradeDefinitions.js)
4. **UI Components** (notifications.js → upgradeCard.js → display.js)
5. **App** (app.js)

Diese Reihenfolge ist in `game.html` definiert.
