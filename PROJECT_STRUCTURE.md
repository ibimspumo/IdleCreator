# Idle Clicker - Projekt Übersicht

## 📁 Projekt-Struktur

```
idlecreator/
├── index.html              # Startseite (Play / Create Buttons)
├── game.html               # Hauptspiel
├── create.html             # Platzhalter für Create-Mode
├── style.css               # Alle Styles für das Projekt
│
├── src/                    # Modular aufgeteilter Source Code
│   ├── README.md          # Detaillierte Modul-Dokumentation
│   │
│   ├── core/              # 🎮 Kern-Engine
│   │   ├── IdleGame.js       # Game Loop, State, Events, Save/Load
│   │   └── Upgrade.js        # Upgrade-System, Unlock-Logik
│   │
│   ├── ui/                # 🎨 UI-Komponenten
│   │   ├── display.js        # Points & Stats Display Updates
│   │   ├── upgradeCard.js    # Upgrade-Karten (erstellen/updaten)
│   │   └── notifications.js  # Unlock-Benachrichtigungen
│   │
│   ├── upgrades/          # ⚡ Upgrade-Definitionen
│   │   └── upgradeDefinitions.js  # Alle Upgrade-Configs
│   │
│   ├── utils/             # 🛠️ Hilfsfunktionen
│   │   └── formatters.js     # Zahlen-Formatierung
│   │
│   └── app.js             # 🚀 Main Entry Point
│
└── *.backup               # Backup der alten monolithischen Dateien
```

## 📊 Datei-Größen (nach Refactoring)

| Datei | Größe | Vorher | Gespart |
|-------|-------|--------|---------|
| **Core Engine** | | | |
| `src/core/IdleGame.js` | 11 KB | Teil von game.js (15 KB) | ✅ |
| `src/core/Upgrade.js` | 3 KB | Teil von game.js (15 KB) | ✅ |
| **UI Components** | | | |
| `src/ui/display.js` | 1 KB | Teil von main.js (13 KB) | ✅ |
| `src/ui/upgradeCard.js` | 3.8 KB | Teil von main.js (13 KB) | ✅ |
| `src/ui/notifications.js` | 1 KB | Teil von main.js (13 KB) | ✅ |
| **Configuration** | | | |
| `src/upgrades/upgradeDefinitions.js` | 4 KB | Teil von main.js (13 KB) | ✅ |
| **Utils** | | | |
| `src/utils/formatters.js` | 430 B | Teil von main.js (13 KB) | ✅ |
| **Main** | | | |
| `src/app.js` | 3.3 KB | Ersetzt main.js | ✅ |

**Vorher**: 2 Dateien (game.js + main.js) = ~28 KB
**Nachher**: 8 modulare Dateien = ~27.5 KB (besser strukturiert!)

## 🎯 Vorteile der neuen Struktur

### ✅ Wartbarkeit
- Klare Trennung von Verantwortlichkeiten
- Jede Datei < 400 Zeilen (vs. 486 und 410+ vorher)
- Schnell zu finden, wo Änderungen nötig sind

### ✅ Erweiterbarkeit
Neue Features hinzufügen:
- **Neues Upgrade** → `src/upgrades/upgradeDefinitions.js`
- **Neue UI** → Neue Datei in `src/ui/`
- **Neue Mechanik** → `src/core/IdleGame.js`

### ✅ Lesbarkeit
- Dateinamen beschreiben genau den Inhalt
- Kommentare und JSDoc in jedem Modul
- README in `src/` für schnellen Überblick

### ✅ Testbarkeit
- Module können einzeln getestet werden
- Keine zirkulären Abhängigkeiten
- Klare Schnittstellen

### ✅ Zusammenarbeit
- Mehrere Entwickler können parallel arbeiten
- Merge-Konflikte minimiert
- Code Reviews einfacher

## 🔄 Migration

Die alten Dateien wurden als Backup gespeichert:
- `game.js.backup` - alte monolithische Game-Engine
- `main.js.backup` - alte UI-Initialisierung

## 📝 Nächste Schritte zum Erweitern

### 1. Neue Upgrade-Kategorien
```javascript
// In src/upgrades/ neue Datei erstellen:
// clickerUpgrades.js, idleUpgrades.js, multiplierUpgrades.js
```

### 2. Achievement-System
```javascript
// Neue Module:
// src/core/Achievement.js
// src/ui/achievementCard.js
```

### 3. Prestige-System
```javascript
// Erweitern:
// src/core/IdleGame.js - prestige() Methode
// src/ui/ - prestige UI Komponenten
```

### 4. Settings/Config
```javascript
// Neu erstellen:
// src/config/gameConfig.js - Zentrale Konfig
// src/ui/settings.js - Settings-UI
```

## 🏗️ Architektur-Prinzipien

1. **Single Responsibility**: Jedes Modul hat genau eine Aufgabe
2. **DRY (Don't Repeat Yourself)**: Code-Duplikation vermieden
3. **Separation of Concerns**: UI, Logic, Data getrennt
4. **Open/Closed Principle**: Erweiterbar ohne Änderung bestehenden Codes

## 🚀 Performance

- Keine Änderung der Runtime-Performance
- Gleiche Anzahl Scripts (nur besser organisiert)
- Load-Zeit identisch
- Bessere Developer Experience!

## 📚 Weitere Dokumentation

Siehe `src/README.md` für detaillierte Modul-Beschreibungen und Load-Reihenfolge.
