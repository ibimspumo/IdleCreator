# Export & Share

Learn how to save, export, and share your idle games.

## Saving Your Game

### Auto-Save System

The editor automatically saves your work:

**Frequency:** Every 5 seconds (debounced)

**Triggers:**
- Adding/removing game elements
- Modifying properties
- Changing logic graph
- Updating theme

**Storage:** Browser localStorage

**Key:** `idleGameData`

### Manual Save

To force an immediate save:
1. Make any change in the Editor
2. Wait for "Saved" indicator (green dot)
3. Or use **Export** to create a backup file

**Note:** Changes are saved to localStorage even without exporting.

## Exporting Your Game

### Export Game Configuration

**Steps:**
1. Go to **Settings** tab
2. Click **Export Game** button
3. Compressed text appears in text area
4. Click **Copy to Clipboard**
5. Save to a `.txt` file

### Export Format

The exported data contains:

```javascript
{
  version: '1.0',
  gameData: {
    resources: [...],
    buildings: [...],
    upgrades: [...],
    achievements: [...],
    prestige: {...},
    theme: {...},
    logic: {
      nodes: [...],
      edges: [...]
    }
  },
  timestamp: 1234567890123
}
```

**Compression:** LZString algorithm compresses to ~30% of original size.

**Encoding:** Base64 for easy copying/pasting.

### What's Included

**Game Configuration (gameData):**
- ✅ All resources
- ✅ All buildings
- ✅ All upgrades
- ✅ All achievements
- ✅ Prestige settings
- ✅ Theme customization
- ✅ Complete logic graph

**NOT Included:**
- ❌ Player progress (current resources, buildings owned)
- ❌ Save states
- ❌ Statistics

**Tip:** To share player progress, use "Export Player State" (see below).

## Importing Games

### Import Game Configuration

**Steps:**
1. Go to **Settings** tab
2. Paste exported data into text area
3. Click **Import Game**
4. Confirm replacement (warning shown)
5. Game loads immediately

**Warning:** Importing replaces your current game configuration!

### Import Validation

The system validates:
- ✅ Valid LZString compression
- ✅ Valid JSON structure
- ✅ Required fields present
- ✅ Compatible version

**Errors:**
- "Invalid compressed data" - Data is corrupted
- "Invalid JSON" - Decompression succeeded but JSON is malformed
- "Missing required fields" - Structure incomplete
- "Incompatible version" - Created with newer/older version

### Import Safety

**Before importing:**
1. **Export your current game** as backup
2. Save export to a `.txt` file
3. Test import in a fresh browser tab (incognito mode)
4. Verify it works before replacing your main project

## Exporting Player State

### Export Player Progress

**Use case:** Share your game progress with others.

**Steps:**
1. Go to **Settings** tab (in Player mode)
2. Click **Export Player State**
3. Copy the generated text
4. Share with others

### Player State Format

```javascript
{
  gameState: {
    resources: { gold: { amount: 10000, ... } },
    buildings: { goldMine: { owned: 25, ... } },
    upgrades: { betterClicks: { purchased: true, ... } },
    achievements: { firstMillion: { unlocked: true, ... } },
    prestige: { level: 3, currency: 150 },
    totalClicks: 5420,
    startTime: 1234567890123,
    eventCounters: {...}
  }
}
```

**Size:** Typically smaller than game configuration.

### Importing Player State

**Steps:**
1. Load the game configuration first (if needed)
2. Go to **Settings** tab
3. Paste player state data
4. Click **Import Player State**
5. Return to **Player** tab to see progress

**Note:** Player state must match the game configuration (same resource IDs, building IDs, etc.).

## Sharing Your Games

### Sharing Methods

#### 1. Share Export String

**Best for:** Quick sharing, updates

**Steps:**
1. Export game
2. Copy to clipboard
3. Share via:
   - Discord/Slack message
   - Pastebin/GitHub Gist
   - Email
   - Forum post

**Pros:**
- Instant sharing
- Easy updates (just share new export)
- No file hosting needed

**Cons:**
- Long strings (can be 10KB+)
- Not human-readable

#### 2. Share as File

**Best for:** Distribution, archiving

**Steps:**
1. Export game
2. Save to `my-game.txt`
3. Share file via:
   - File hosting (Dropbox, Google Drive)
   - GitHub repository
   - Discord attachment
   - Email attachment

**Pros:**
- Organized
- Version control friendly
- Easy to archive

**Cons:**
- Requires file hosting
- Slightly more steps

#### 3. Share as Playable Game (Future)

**Coming soon:** Export as standalone HTML file.

### Sharing Best Practices

**Include Documentation:**
```
Game: Awesome Clicker
Version: 1.2
Description: A fun clicker with prestige and achievements
How to play: Click gold to earn, buy buildings for passive income

[Export string here]
```

**Versioning:**
```
my-game-v1.0.txt
my-game-v1.1.txt
my-game-v1.2.txt
```

**Changelog:**
```
v1.2 - Added 5 new upgrades, rebalanced costs
v1.1 - Added prestige system
v1.0 - Initial release
```

## Backup Strategies

### Local Backups

**Recommended schedule:**
- Daily during active development
- Before major changes
- After completing features

**Method:**
1. Export game
2. Save to `backups/my-game-YYYY-MM-DD.txt`
3. Keep last 7 days

### Cloud Backups

**Options:**
- **GitHub** - Free, version controlled
- **Google Drive** - Easy access, shareable
- **Dropbox** - Automatic sync
- **Pastebin** - Quick and simple

**GitHub example:**
```bash
# Create repository
git init
git add my-game.txt
git commit -m "Initial game"

# Update backup
git add my-game.txt
git commit -m "Added prestige system"
git push
```

### Backup Automation (Advanced)

**Browser extension (future):**
Auto-export to file every N minutes.

**Manual script:**
```javascript
// Console command
const data = localStorage.getItem('idleGameData');
console.log(data);  // Copy and save
```

## Recovering Lost Data

### From localStorage

If the editor is blank but you didn't clear browser data:

**Steps:**
1. Open browser console (F12)
2. Type: `localStorage.getItem('idleGameData')`
3. Copy the output
4. Go to Settings → Import Game
5. Paste and import

### From Export File

If you have an export file:

**Steps:**
1. Open the `.txt` file
2. Copy entire contents
3. Go to Settings → Import Game
4. Paste and import

### From Browser History

If localStorage was cleared:

**Last resort:**
1. Check browser cache/history
2. Use "Restore Previous Session" if available
3. Check backup folders

**Prevention:** Always maintain external backups!

## Version Control

### Game Configuration Versioning

**Include in export:**
```javascript
{
  version: '1.0',
  gameData: {...}
}
```

**Check on import:**
```javascript
if (imported.version !== CURRENT_VERSION) {
  console.warn('Version mismatch - may need migration');
}
```

### Migration (Future Feature)

When format changes:
- Automatic migration from old versions
- Preserves all game data
- Warns about incompatibilities

### Current Version

**Format version:** 1.0

**Compatible with:**
- Idle Game Creator v1.0+

## Sharing Gallery (Community)

### Submit Your Game

**Planned:** Community gallery for sharing games.

**Requirements:**
- Working game export
- Description (100-500 words)
- Screenshots (optional)
- Gameplay instructions

**Categories:**
- 🎮 Complete Games
- 🧪 Experimental
- 📚 Tutorial Examples
- 🏆 Community Favorites

### Featured Games

**Criteria for featuring:**
- Unique mechanics
- Polished gameplay
- Good documentation
- Active updates

## Publishing Checklist

Before sharing your game publicly:

**Testing:**
- ✅ Test in fresh browser (incognito mode)
- ✅ Verify import works
- ✅ Playtest for 30+ minutes
- ✅ Check all unlocks work
- ✅ Test prestige (if used)

**Documentation:**
- ✅ Write clear description
- ✅ List key features
- ✅ Explain unique mechanics
- ✅ Provide quick-start guide
- ✅ Note any known issues

**Polish:**
- ✅ Custom theme applied
- ✅ All icons designed
- ✅ Descriptions written
- ✅ Notifications proofread
- ✅ Balance tested

**Metadata:**
- ✅ Game name/title
- ✅ Version number
- ✅ Creator name
- ✅ Creation date
- ✅ Last update date

## Legal & Licensing

### Your Game Rights

**You own:**
- Your game configuration
- Custom graphics (icons)
- Game design and mechanics
- Description and text content

**Idle Game Creator provides:**
- The framework/engine
- Base UI components
- Logic system

### Sharing License

**Recommended:** Include license in documentation.

**Options:**
- **Public Domain (CC0)** - Free for anyone to use/modify
- **Attribution (CC-BY)** - Free with credit
- **Non-commercial (CC-BY-NC)** - Free for non-profit use
- **All Rights Reserved** - Permission required

**Example:**
```
Game: Awesome Clicker v1.0
Created by: YourName
License: CC-BY 4.0 (Attribution required)
```

### Framework Attribution

When sharing games created with Idle Game Creator:

**Optional but appreciated:**
```
Created with Idle Game Creator
https://github.com/yourusername/idle-game-creator
```

## Troubleshooting Export/Import

### Export Issues

**"Export button does nothing":**
- Check browser console for errors
- Ensure gameData is not empty
- Try different browser

**"Exported string is too short":**
- Check if gameData populated
- Verify resources/buildings exist
- May indicate corruption

### Import Issues

**"Invalid compressed data":**
- Ensure entire string copied
- No extra spaces/newlines
- Copy from raw text (not formatted)

**"Game loads but missing elements":**
- Export may be from older version
- Check gameData structure
- Verify all required fields present

**"Import succeeds but editor blank":**
- Check browser console for errors
- Verify localStorage permissions
- Try hard refresh (Ctrl+F5)

### Data Corruption

**Symptoms:**
- Editor crashes on load
- Missing resources/buildings
- Logic graph won't render

**Solution:**
1. Open console: `localStorage.clear()`
2. Refresh page
3. Import from last known good backup

**Prevention:**
- Regular backups
- Test before major changes
- Keep version history

## Next Steps

- **[Examples & Patterns](06-examples-patterns.md)** - Inspiration and templates
- **[Troubleshooting](07-troubleshooting.md)** - Fix common issues
- **[API Reference](08-api-reference.md)** - Technical details
