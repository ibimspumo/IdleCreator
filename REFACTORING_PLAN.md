# Refactoring Plan - Idle Game Creator

**Erstellt:** 2025-11-30
**Status:** Planung
**Ziel:** Modularisierung und Verbesserung der Code-Struktur nach Node-System Vorbild

---

## 📊 Analyse der größten Dateien

| Datei | Zeilen | Problem | Priorität |
|-------|--------|---------|-----------|
| `LogicEditor.jsx` | 445 | Zu viele Verantwortlichkeiten | 🔴 Hoch |
| `GameEngine.js` | 435 | Monolithische Engine | 🔴 Sehr Hoch |
| `GamePlayer.jsx` | 434 | Zu viel UI in einer Komponente | 🟡 Mittel |
| `PixelArtEditor.jsx` | 403 | Komplex aber spezialisiert | 🟢 Niedrig |
| `codePreviewGenerator.js` | 386 | Alle Generatoren in einer Datei | 🟡 Mittel |
| `LogicExecutor.js` | 355 | Große Executor-Logik | 🔴 Hoch |
| `GameEditor.jsx` | 357 | Viele Dependencies | 🟢 Niedrig (bereits Hooks) |
| `BuildingProperties.jsx` | 156 | Code-Duplikation | 🟡 Mittel |
| `UpgradeProperties.jsx` | 197 | Code-Duplikation | 🟡 Mittel |
| `AchievementProperties.jsx` | 99 | Code-Duplikation | 🟡 Mittel |

---

## 🎯 Refactoring-Strategie

### Phase 1: GameEngine Modularisierung (Höchste Priorität)
**Ziel:** Template-basiertes System ähnlich wie bei Logic Nodes

#### Vorher:
```
engine/
├── GameEngine.js (435 Zeilen - alles in einer Datei)
└── LogicExecutor.js (355 Zeilen - alles in einer Datei)
```

#### Nachher:
```
engine/
├── GameEngine.js (Hauptklasse, orchestriert Manager)
├── managers/
│   ├── ResourceManager.js (Resource-Logik)
│   ├── BuildingManager.js (Building-Logik)
│   ├── UpgradeManager.js (Upgrade-Logik)
│   ├── AchievementManager.js (Achievement-Logik)
│   ├── ProductionManager.js (Production-Berechnung)
│   └── index.js (Auto-Loader)
├── LogicExecutor.js (Hauptklasse, orchestriert Executors)
└── executors/
    ├── EventExecutor.js (Event-Ausführung)
    ├── ActionExecutor.js (Action-Ausführung)
    ├── ConditionExecutor.js (Condition-Ausführung)
    ├── LogicExecutor.js (Logic-Ausführung)
    └── index.js (Auto-Loader)
```

#### Vorteile:
- ✅ Bessere Wartbarkeit
- ✅ Einzelne Verantwortlichkeiten (SRP)
- ✅ Einfacher zu testen
- ✅ Erweiterbar wie Node-System
- ✅ Reduziert Komplexität pro Datei

#### Betroffene Dateien:
- `src/engine/GameEngine.js` (Refactoring)
- `src/engine/LogicExecutor.js` (Refactoring)
- Neue Manager-Dateien (7 neue Dateien)

---

### Phase 2: LogicEditor Hooks-Extraktion (Hohe Priorität)
**Ziel:** LogicEditor.jsx aufteilen in wiederverwendbare Hooks

#### Vorher:
```jsx
// LogicEditor.jsx (445 Zeilen)
// - State Management
// - Auto-save Logik
// - Node Operations
// - UI Rendering
// - Code Preview
```

#### Nachher:
```
components/LogicEditor/
├── LogicEditor.jsx (Hauptkomponente, ~150 Zeilen)
├── hooks/
│   ├── useLogicEditorState.js (nodes, edges, selection)
│   ├── useAutoSave.js (5s debounce, save status)
│   ├── useNodeOperations.js (add, delete, group, drag)
│   └── useCodePreview.js (code generation, memoization)
├── components/
│   ├── CodePreviewPanel.jsx (Code Preview UI)
│   ├── NodeActionsPanel.jsx (Delete, Group buttons)
│   └── SaveStatusIndicator.jsx (Save status dot)
└── LogicEditor.jsx
```

#### Vorteile:
- ✅ Wiederverwendbare Hooks
- ✅ Bessere Testbarkeit
- ✅ Klarere Separation of Concerns
- ✅ Einfacheres Debugging

#### Betroffene Dateien:
- `src/components/LogicEditor/LogicEditor.jsx` (Refactoring)
- 4 neue Hook-Dateien
- 3 neue Komponenten

---

### Phase 3: Code Preview Generator Modularisierung (Mittlere Priorität)
**Ziel:** Template-basierte Generatoren wie Node-System

#### Vorher:
```
utils/
└── codePreviewGenerator.js (386 Zeilen - alle Generatoren)
```

#### Nachher:
```
utils/codePreview/
├── CodePreviewGenerator.js (Hauptklasse)
├── generators/
│   ├── EventGenerator.js
│   ├── ActionGenerator.js
│   ├── ConditionGenerator.js
│   ├── LogicGenerator.js
│   └── index.js
├── formatters/
│   ├── SyntaxHighlighter.js
│   └── Indentation.js
└── index.js
```

#### Vorteile:
- ✅ Jeder Generator isoliert
- ✅ Einfacher zu erweitern
- ✅ Bessere Code-Organisation
- ✅ Wiederverwendbare Formatter

#### Betroffene Dateien:
- `src/utils/codePreviewGenerator.js` (Refactoring)
- 7 neue Dateien

---

### Phase 4: GamePlayer Komponenten-Aufteilung (Mittlere Priorität)
**Ziel:** UI-Panels in separate Komponenten auslagern

#### Vorher:
```jsx
// GamePlayer.jsx (434 Zeilen)
// - Buildings Rendering
// - Upgrades Rendering
// - Achievements Rendering
// - Stats Rendering
// - Prestige Rendering
```

#### Nachher:
```
components/Player/
├── GamePlayer.jsx (Hauptkomponente, ~100 Zeilen)
├── panels/
│   ├── BuildingsPanel.jsx
│   ├── UpgradesPanel.jsx
│   ├── AchievementsPanel.jsx
│   ├── StatsPanel.jsx
│   └── PrestigePanel.jsx
├── components/
│   ├── BuildingCard.jsx
│   ├── UpgradeCard.jsx
│   ├── AchievementCard.jsx
│   └── ResourceDisplay.jsx
└── hooks/
    ├── useNotification.js (bereits vorhanden)
    └── useGameLifecycle.js (bereits vorhanden)
```

#### Vorteile:
- ✅ Kleinere, fokussierte Komponenten
- ✅ Bessere Performance (weniger Re-Renders)
- ✅ Einfacher zu stylen
- ✅ Wiederverwendbare UI-Komponenten

#### Betroffene Dateien:
- `src/components/Player/GamePlayer.jsx` (Refactoring)
- 9 neue Komponenten

---

### Phase 5: Properties Shared Components (Mittlere Priorität)
**Ziel:** Duplikation in Properties-Komponenten reduzieren

#### Vorher:
```
components/Editor/properties/
├── BuildingProperties.jsx (156 Zeilen, viel Duplikation)
├── UpgradeProperties.jsx (197 Zeilen, viel Duplikation)
└── AchievementProperties.jsx (99 Zeilen, viel Duplikation)
```

#### Nachher:
```
components/Editor/properties/
├── BuildingProperties.jsx (nutzt shared components)
├── UpgradeProperties.jsx (nutzt shared components)
├── AchievementProperties.jsx (nutzt shared components)
├── ResourceProperties.jsx (bereits vorhanden)
├── ThemeProperties.jsx (bereits vorhanden)
└── shared/
    ├── BasePropertiesPanel.jsx
    ├── CostBuilder.jsx (für costs array)
    ├── EffectBuilder.jsx (für effects array)
    ├── RequirementBuilder.jsx (bereits vorhanden)
    ├── ColorPickerField.jsx (bereits vorhanden)
    ├── IconField.jsx (bereits vorhanden)
    └── FormField.jsx (generisches Input-Feld)
```

#### Vorteile:
- ✅ Weniger Code-Duplikation
- ✅ Einheitliche UI
- ✅ Einfachere Wartung
- ✅ Wiederverwendbare Form-Builder

#### Betroffene Dateien:
- `src/components/Editor/properties/BuildingProperties.jsx` (Refactoring)
- `src/components/Editor/properties/UpgradeProperties.jsx` (Refactoring)
- `src/components/Editor/properties/AchievementProperties.jsx` (Refactoring)
- 3 neue Shared Components

---

## 📋 Implementierungs-Reihenfolge

### Sprint 1: GameEngine & LogicExecutor (3-4 Tage)
1. ✅ Analyse: GameEngine.js dependencies
2. ✅ Erstelle Manager-Struktur
3. ✅ Migriere ResourceManager
4. ✅ Migriere BuildingManager
5. ✅ Migriere UpgradeManager
6. ✅ Migriere AchievementManager
7. ✅ Migriere ProductionManager
8. ✅ Refactor GameEngine.js
9. ✅ Erstelle Executor-Struktur
10. ✅ Migriere EventExecutor
11. ✅ Migriere ActionExecutor
12. ✅ Migriere ConditionExecutor
13. ✅ Migriere LogicExecutor
14. ✅ Tests durchführen
15. ✅ Commit

### Sprint 2: LogicEditor Hooks (2 Tage)
1. ✅ Extrahiere useLogicEditorState
2. ✅ Extrahiere useAutoSave
3. ✅ Extrahiere useNodeOperations
4. ✅ Extrahiere useCodePreview
5. ✅ Erstelle CodePreviewPanel
6. ✅ Erstelle NodeActionsPanel
7. ✅ Erstelle SaveStatusIndicator
8. ✅ Refactor LogicEditor.jsx
9. ✅ Tests durchführen
10. ✅ Commit

### Sprint 3: Code Preview Generator (1-2 Tage)
1. ✅ Erstelle Generator-Struktur
2. ✅ Migriere EventGenerator
3. ✅ Migriere ActionGenerator
4. ✅ Migriere ConditionGenerator
5. ✅ Migriere LogicGenerator
6. ✅ Erstelle SyntaxHighlighter
7. ✅ Refactor CodePreviewGenerator
8. ✅ Tests durchführen
9. ✅ Commit

### Sprint 4: GamePlayer Komponenten (2 Tage)
1. ✅ Erstelle BuildingsPanel
2. ✅ Erstelle UpgradesPanel
3. ✅ Erstelle AchievementsPanel
4. ✅ Erstelle StatsPanel
5. ✅ Erstelle PrestigePanel
6. ✅ Erstelle UI-Komponenten
7. ✅ Refactor GamePlayer.jsx
8. ✅ Tests durchführen
9. ✅ Commit

### Sprint 5: Properties Shared Components (1-2 Tage)
1. ✅ Erstelle BasePropertiesPanel
2. ✅ Erstelle CostBuilder
3. ✅ Erstelle EffectBuilder
4. ✅ Erstelle FormField
5. ✅ Refactor BuildingProperties
6. ✅ Refactor UpgradeProperties
7. ✅ Refactor AchievementProperties
8. ✅ Tests durchführen
9. ✅ Commit

---

## 🎯 Erfolgs-Metriken

### Code-Qualität
- ✅ Keine Datei über 300 Zeilen
- ✅ Durchschnittliche Dateigröße < 150 Zeilen
- ✅ Maximale Verschachtelungstiefe: 3
- ✅ Zyklomatische Komplexität < 10 pro Funktion

### Wartbarkeit
- ✅ Jede Datei hat eine klare Verantwortlichkeit
- ✅ Keine Code-Duplikation
- ✅ Wiederverwendbare Komponenten/Hooks
- ✅ Template-basiertes System für Erweiterbarkeit

### Performance
- ✅ Keine Performance-Regression
- ✅ Besseres Code-Splitting möglich
- ✅ Lazy-Loading für große Komponenten

---

## 📝 Notizen

### Design-Prinzipien
1. **Template-basiert**: Wie bei Logic Nodes - einfach duplizieren und anpassen
2. **Auto-Loading**: Vite's `import.meta.glob` für automatische Imports
3. **Single Responsibility**: Jede Datei/Klasse hat genau eine Aufgabe
4. **DRY (Don't Repeat Yourself)**: Shared Components statt Duplikation
5. **Composition over Inheritance**: Hooks und Komponenten kombinieren

### Technologie-Stack
- **React Hooks**: State Management und Side Effects
- **Vite**: Build Tool mit HMR und `import.meta.glob`
- **ReactFlow**: Logic Flow Editor (bereits vorhanden)
- **Context API**: GameDataContext (bereits vorhanden)

### Rückwärts-Kompatibilität
- ✅ Alle Refactorings müssen rückwärtskompatibel sein
- ✅ Bestehende gameData-Struktur bleibt unverändert
- ✅ Bestehende Features müssen weiterhin funktionieren
- ✅ Tests vor und nach jedem Refactoring

---

## 🚀 Nächste Schritte

1. **Zustimmung einholen**: User-Feedback zu diesem Plan
2. **Sprint 1 starten**: GameEngine Modularisierung
3. **Iterativ arbeiten**: Commit nach jedem Sprint
4. **Tests durchführen**: Nach jeder Phase testen
5. **Dokumentation**: README-Updates nach jedem Sprint

---

## ✅ Checkliste vor Start

- [ ] Plan reviewed und approved
- [ ] Backup des aktuellen Codes (Git commit)
- [ ] Dev-Server läuft
- [ ] Tests durchführbar
- [ ] User ist informiert über Änderungen

---

**Erstellt von:** Claude Code
**Letzte Aktualisierung:** 2025-11-30
**Version:** 1.0
