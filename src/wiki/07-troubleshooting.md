# Troubleshooting

Common issues and how to fix them.

## Editor Issues

### Editor Won't Load

**Symptoms:**
- Blank screen
- "Loading..." never completes
- Console errors

**Solutions:**

1. **Check browser console** (F12)
   - Look for JavaScript errors
   - Check for localStorage permission errors

2. **Clear localStorage**
   ```javascript
   // In console:
   localStorage.clear()
   // Then refresh page (Ctrl+F5)
   ```

3. **Try different browser**
   - Chrome/Edge recommended
   - Firefox supported
   - Safari may have issues

4. **Disable browser extensions**
   - Ad blockers can interfere
   - Privacy tools may block localStorage
   - Try incognito/private mode

---

### Can't Add Resources/Buildings

**Symptoms:**
- "Add Resource" button doesn't work
- Properties panel doesn't appear
- Changes don't save

**Solutions:**

1. **Check if ID is unique**
   - Each element needs unique ID
   - No spaces in IDs
   - Use lowercase (convention)

2. **Verify localStorage isn't full**
   ```javascript
   // Check usage (console):
   console.log(JSON.stringify(localStorage).length)
   // Should be < 5MB
   ```

3. **Check browser console for errors**
   - React errors indicate code issues
   - Validation errors show invalid data

4. **Try hard refresh** (Ctrl+F5)
   - Clears cached code
   - Reloads application

---

### Properties Panel Not Updating

**Symptoms:**
- Changes made but not reflected
- Old values shown after edit
- Properties reset on refresh

**Solutions:**

1. **Wait for auto-save** (5 seconds)
   - Look for green "Saved" indicator
   - Don't navigate away immediately

2. **Check field validation**
   - Numbers must be valid numbers
   - IDs must be alphanumeric
   - Required fields must be filled

3. **Manually trigger save**
   - Make any small change
   - Wait for save indicator
   - Then make real changes

---

### Icons Not Displaying

**Symptoms:**
- Icon shows as blank square
- Icon editor doesn't open
- Icons lost after import

**Solutions:**

1. **Check icon data format**
   - Should be base64 string
   - Starts with `data:image/png;base64,`
   - If empty, recreate icon

2. **Recreate icon**
   - Click icon field
   - Use pixel editor
   - Save (automatically encodes)

3. **Check browser console**
   - Look for image loading errors
   - May indicate corrupted data

---

## Logic Editor Issues

### Logic Nodes Not Triggering

**Symptoms:**
- Events don't execute
- Actions don't run
- No visible effect in Player mode

**Solutions:**

1. **Check node connections**
   - Edges must be properly connected
   - Green dots = valid connection
   - Red = invalid connection

2. **Verify event conditions**
   - `afterXResources` - requires exact amount
   - `onClick` - must click correct resource
   - `onTick` - may execute too fast to notice

3. **Check node configuration**
   - Resource IDs must match exactly
   - Building IDs case-sensitive
   - Amounts must be valid numbers

4. **Use notifications for debugging**
   ```
   Event → Show Notification ("Event triggered!")
     → Your actual logic
   ```

5. **Check code preview**
   - Verify logic is as expected
   - Look for syntax issues
   - Confirm connections

---

### Nodes Won't Connect

**Symptoms:**
- Can't drag edge between nodes
- Connection appears then disappears
- Red connection indicator

**Solutions:**

1. **Check handle compatibility**
   - Events → Actions, Conditions, Logic
   - Conditions → Actions (true/false paths)
   - Logic → Actions, Conditions
   - Can't connect incompatible types

2. **Check for circular dependencies**
   - Node can't connect to itself
   - Can't create infinite loops (A → B → A)

3. **Zoom level issues**
   - Try zooming to 100%
   - Reset view (fit to screen)

4. **Delete and recreate nodes**
   - Sometimes node state becomes corrupted
   - Delete problematic node
   - Create new one

---

### Logic Running Too Fast/Slow

**Symptoms:**
- `onTick` events spam notifications
- Delays don't seem to work
- Production seems wrong

**Solutions:**

1. **Understand tick rate**
   - 1 tick = 100ms
   - 10 ticks per second
   - `onTick` runs 10 times/second!

2. **Use appropriate events**
   - Don't use `onTick` for one-time events
   - Use `afterXSeconds` for timed events
   - Use counters for thresholds

3. **Check delay values**
   - Delays are in seconds, not milliseconds
   - `Delay (5)` = 5 seconds
   - `Delay (0.1)` = 100ms

4. **Verify production calculations**
   - Check building production values
   - Verify upgrade multipliers
   - Test in isolation

---

### Code Preview Not Updating

**Symptoms:**
- Shows old code
- Doesn't reflect new nodes
- Blank preview

**Solutions:**

1. **Toggle preview off/on**
   - Click "Hide Code"
   - Click "Show Code"
   - Forces regeneration

2. **Refresh page**
   - Hard refresh (Ctrl+F5)
   - Re-open logic editor

3. **Check browser console**
   - Look for generator errors
   - May indicate node data issues

---

## Player Mode Issues

### Resources Not Increasing

**Symptoms:**
- Clicking does nothing
- Production shows 0/sec
- Buildings don't produce

**Solutions:**

1. **Check click power**
   - Verify resource has clickPower > 0
   - Check if click logic overrides power
   - Test in isolation (disable logic)

2. **Check building production**
   - Verify building owned > 0
   - Check production values set
   - Confirm resources match

3. **Check for negative production**
   - Logic may be removing resources
   - Check for subtract actions
   - Verify multipliers aren't < 1

4. **Restart game engine**
   - Switch to Editor tab
   - Switch back to Player tab
   - Reinitializes engine

---

### Buildings Can't Be Purchased

**Symptoms:**
- "Buy" button disabled
- Have enough resources but can't buy
- Building shows as locked

**Solutions:**

1. **Check building costs**
   - Verify costs configured correctly
   - Ensure resources exist
   - Check cost amounts

2. **Check unlock requirements**
   - Review requirement conditions
   - May need achievement/upgrade first
   - Check resource thresholds

3. **Check resource amounts**
   - Ensure you actually have enough
   - Account for cost scaling
   - Check for negative resources

4. **Check max owned**
   - Building may be at max ownership
   - Increase or remove max limit

---

### Upgrades Not Working

**Symptoms:**
- Purchase succeeds but no effect
- Multipliers don't apply
- Production doesn't increase

**Solutions:**

1. **Check upgrade effects**
   - Verify effect type (multiply/add)
   - Confirm target (production/click)
   - Check resource ID matches

2. **Check effect values**
   - Multipliers should be > 1 for boosts
   - Multipliers < 1 reduce production
   - Add effects are flat bonuses

3. **Verify upgrade purchased**
   - Check in gameState
   - Console: `engine.gameState.upgrades`
   - Should show `purchased: true`

4. **Check for conflicting logic**
   - Logic nodes may override upgrades
   - Check for production modifications
   - Disable logic temporarily to test

---

### Achievements Not Unlocking

**Symptoms:**
- Requirements met but locked
- Progress stuck at 99%
- Achievement checking not working

**Solutions:**

1. **Check requirement thresholds**
   - Must meet or exceed amount
   - >= not > for most checks
   - Exact values for specific checks

2. **Check requirement types**
   - Resource requirements use current amount
   - Building requirements use owned count
   - Upgrade requirements check purchased status

3. **Wait for tick**
   - Achievements checked every tick (100ms)
   - May need to wait briefly
   - Try triggering tick (click resource)

4. **Check multiple requirements**
   - ALL requirements must be met
   - AND logic, not OR
   - Verify each condition individually

---

### Prestige Not Working

**Symptoms:**
- Prestige button disabled
- No prestige currency gained
- Game doesn't reset

**Solutions:**

1. **Check prestige configuration**
   - Verify formula selected
   - Check base value
   - Ensure prestige system enabled

2. **Check resource amounts**
   - Need sufficient resources for currency
   - Formula calculates from total resources
   - May need more resources

3. **Check prestige logic**
   - `onPrestige` event configured?
   - Bonuses applied correctly?
   - Check for errors in logic

4. **Manual prestige trigger**
   - Use `forcePrestige` action in logic
   - Test prestige mechanics
   - Debug prestige flow

---

## Import/Export Issues

### Export Produces Empty String

**Symptoms:**
- Export button works but string is short
- Exported data missing elements
- Can't import exported data

**Solutions:**

1. **Check gameData populated**
   - Verify resources exist
   - Check buildings created
   - Ensure data not empty

2. **Check browser console**
   - Look for compression errors
   - Check for serialization issues
   - Verify LZString library loaded

3. **Try manual export**
   ```javascript
   // In console:
   console.log(localStorage.getItem('idleGameData'))
   ```

---

### Import Fails with Error

**Symptoms:**
- "Invalid compressed data"
- "JSON parse error"
- Import button doesn't work

**Solutions:**

1. **Verify complete copy**
   - Ensure entire string copied
   - No truncation at start/end
   - No extra whitespace

2. **Check data format**
   - Should be long base64 string
   - Starts with random characters
   - No line breaks or formatting

3. **Try different method**
   - Copy to text editor first
   - Save as .txt file
   - Copy from file

4. **Validate compression**
   ```javascript
   // In console:
   const data = "your_compressed_string";
   const decompressed = LZString.decompressFromBase64(data);
   console.log(decompressed);
   ```

---

### Imported Game Missing Elements

**Symptoms:**
- Some resources missing
- Buildings don't appear
- Logic graph incomplete

**Solutions:**

1. **Check export version**
   - May be from older version
   - Check version compatibility
   - Try exporting again

2. **Check for corruption**
   - Export again from source
   - Compare file sizes
   - Try different browser

3. **Manually verify data**
   ```javascript
   // After import:
   const data = localStorage.getItem('idleGameData');
   const parsed = JSON.parse(data);
   console.log(parsed.resources);
   console.log(parsed.buildings);
   ```

---

## Performance Issues

### Game Runs Slowly

**Symptoms:**
- Laggy interactions
- Delayed updates
- Browser tab freezes

**Solutions:**

1. **Reduce onTick usage**
   - Each onTick runs 10 times/second
   - Use counter events instead
   - Optimize logic chains

2. **Simplify logic**
   - Remove complex nested conditions
   - Reduce total node count
   - Optimize frequently-run paths

3. **Check browser resources**
   - Close other tabs
   - Check memory usage (Task Manager)
   - Restart browser

4. **Optimize node graph**
   - Delete unused nodes
   - Combine similar logic
   - Use groups to organize

---

### Browser Crashes

**Symptoms:**
- Tab becomes unresponsive
- "Out of memory" errors
- Entire browser freezes

**Solutions:**

1. **Check for infinite loops**
   - Loop nodes with high iterations
   - Circular logic dependencies
   - Unbounded onTick operations

2. **Reduce data size**
   - Clear old event counters
   - Reset game state periodically
   - Export and reimport to compact

3. **Check localStorage size**
   ```javascript
   // In console:
   const size = JSON.stringify(localStorage).length;
   console.log(`${(size / 1024).toFixed(2)} KB`);
   // Should be < 5MB
   ```

4. **Use production build**
   - `npm run build`
   - Better optimized than dev mode

---

## Common Mistakes

### Resource IDs Don't Match

**Problem:**
```javascript
// Resource created as "gold"
// Logic references "Gold" (capitalized)
```

**Solution:** IDs are case-sensitive. Use exact match.

---

### Negative Production

**Problem:**
```javascript
// Accidentally subtract instead of add
multiplyProduction (gold, -1)  // WRONG
multiplyProduction (gold, 0.5) // Correct for halving
```

**Solution:** Use values < 1 to reduce, never negative.

---

### onTick Overuse

**Problem:**
```javascript
onTick → Show Notification ("Tick!")
// Shows 10 notifications per second!
```

**Solution:** Use `afterXSeconds` or other events.

---

### Circular Dependencies

**Problem:**
```
Node A → Node B → Node A
```

**Solution:** Break the cycle or use delay.

---

### Missing Handles

**Problem:**
- Trying to connect incompatible nodes
- Event to Event
- Action to Event

**Solution:** Follow proper flow: Event → Action/Condition/Logic

---

### Wrong Operator

**Problem:**
```javascript
ifResource (gold, ==, 1000)  // Needs EXACT 1000
// Better:
ifResource (gold, >=, 1000)  // 1000 or more
```

**Solution:** Use >= for thresholds, == for exact values.

---

## Debug Tools

### Browser Console Commands

**View gameState:**
```javascript
console.log(engine.gameState)
```

**View gameData:**
```javascript
const data = localStorage.getItem('idleGameData');
console.log(JSON.parse(data));
```

**Manually trigger event:**
```javascript
engine.logicExecutor.triggerEvent('onGameStart');
```

**Check resource:**
```javascript
console.log(engine.gameState.resources.gold);
```

**Force save:**
```javascript
localStorage.setItem('idleGameData', JSON.stringify(gameData));
```

### Debugging Workflow

1. **Identify problem area**
   - Editor, Logic, or Player?
   - Specific element or general?

2. **Check browser console**
   - Look for errors (red text)
   - Check warnings (yellow text)
   - Read error messages carefully

3. **Isolate issue**
   - Test in isolation
   - Disable logic temporarily
   - Test one element at a time

4. **Add debug notifications**
   ```
   Event → Show Notification ("Debug: Event triggered")
     → Action
     → Show Notification ("Debug: Action completed")
   ```

5. **Verify data structure**
   - Export game
   - Check JSON structure
   - Look for missing fields

6. **Test in fresh environment**
   - Incognito mode
   - Different browser
   - Clear all data and reimport

---

## Getting Help

### Before Asking for Help

**Provide:**
1. Browser and version
2. Error messages from console
3. Steps to reproduce
4. Expected vs actual behavior
5. Export of your game (if relevant)

### Community Resources

- **GitHub Issues** - Bug reports and feature requests
- **Discord/Forum** - Community help and discussion
- **Wiki** - This documentation

### Reporting Bugs

**Include:**
- Clear description
- Steps to reproduce
- Browser console output
- System information
- Game export (if needed)

**Format:**
```
**Bug:** Can't import games with large logic graphs

**Steps:**
1. Create game with 50+ logic nodes
2. Export game
3. Import in new browser tab
4. Error: "Invalid JSON"

**Expected:** Game imports successfully
**Actual:** Error message appears

**Console output:**
SyntaxError: Unexpected token...

**Browser:** Chrome 120.0.0
**Export:** [attached]
```

---

## Next Steps

- **[Getting Started](01-getting-started.md)** - Return to basics
- **[Examples & Patterns](06-examples-patterns.md)** - Learn from examples
- **[API Reference](08-api-reference.md)** - Technical documentation
