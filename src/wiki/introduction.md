# Willkommen im Wiki!

Hier finden Sie Informationen und Anleitungen zur Nutzung des Idle Creator.

## Grundlegende Konzepte

Der Idle Creator ermöglicht es Ihnen, eigene Idle Games zu entwickeln, ohne eine einzige Zeile Code schreiben zu müssen. Alles basiert auf einem visuellen Editor und einem Logik-Editor.

### Der Game Editor

Im Game Editor definieren Sie die grundlegenden Elemente Ihres Spiels:

*   **Ressourcen:** Was sammelt der Spieler? (z.B. Gold, Holz, XP)
*   **Gebäude:** Was produziert Ressourcen oder schaltet Funktionen frei?
*   **Upgrades:** Verbesserungen für Gebäude, Ressourcen oder den Spieler selbst.
*   **Errungenschaften:** Ziele, die der Spieler erreichen kann.
*   **Themen:** Visuelle Anpassungen für Ihr Spiel.

### Der Logik Editor

Der Logik Editor ist das Herzstück Ihres Spiels. Hier definieren Sie *wann* und *was* im Spiel passiert. Er basiert auf einem Flussdiagramm-Ansatz mit:

*   **Events:** Auslöser (z.B. "Beim Klick", "Nach X Sekunden", "Wenn Gebäude gekauft")
*   **Conditions:** Bedingungen, die erfüllt sein müssen (z.B. "Wenn Spieler genug Gold hat", "Wenn Gebäude Level Y erreicht")
*   **Actions:** Was passiert, wenn ein Event ausgelöst und die Conditions erfüllt sind (z.B. "Ressource hinzufügen", "Produktion multiplizieren", "Errungenschaft freischalten")

## Code Beispiele

Hier ist ein kleines Beispiel, wie Sie eine Aktion im Logik Editor definieren könnten:

```javascript
// Beispiel: Event "On Click" -> Condition "If Resource 'Gold' >= 10" -> Action "Add Resource 'Gold' -10"
// Dies würde bedeuten: Bei jedem Klick, wenn der Spieler mindestens 10 Gold hat, verliert er 10 Gold.
// Das ist natürlich ein vereinfachtes Beispiel und würde normalerweise dazu dienen, etwas zu kaufen.
function processClick() {
  if (player.resources.gold >= 10) {
    player.resources.gold -= 10;
    console.log("10 Gold ausgegeben!");
  } else {
    console.log("Nicht genug Gold!");
  }
}
```

```css
/* Beispiel für CSS */
.my-class {
  color: #f0f0f0;
  background-color: #333;
  padding: 10px;
}
```

## Nützliche Links

*   [Offizielle Dokumentation (Placeholder)](https://example.com/docs)
*   [Community Forum (Placeholder)](https://example.com/forum)

Bald folgen mehr Details und Anleitungen!
