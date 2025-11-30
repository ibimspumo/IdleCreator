# Idle Game Creator - Wiki Overview

Welcome to the complete documentation for **Idle Game Creator**!

## 📚 Documentation Structure

### Beginner Guides

**[01. Getting Started](01-getting-started.md)**
- Quick start guide
- Creating your first game
- Understanding the interface
- Key concepts overview

**[02. Game Elements](02-game-elements.md)**
- Resources (coins, gems, points)
- Buildings (production units)
- Upgrades (permanent bonuses)
- Achievements (milestones)
- Prestige system
- Theme customization

**[03. Logic System](03-logic-system.md)**
- Visual programming overview
- Event nodes (19 types)
- Action nodes (12 types)
- Condition nodes (8 types)
- Logic nodes (5 types)
- Building logic flows
- Code preview

### Advanced Topics

**[04. Advanced Features](04-advanced-features.md)**
- Prestige formulas explained
- Production mechanics
- Click power systems
- Cost scaling strategies
- Event counter system
- Unlock requirements
- State management
- Performance optimization

**[05. Export & Share](05-export-share.md)**
- Saving your game
- Export/import system
- Sharing methods
- Backup strategies
- Version control
- Publishing checklist

### Practical Resources

**[06. Examples & Patterns](06-examples-patterns.md)**
- Basic patterns (welcome bonus, progressive unlock)
- Intermediate patterns (combo systems, synergy)
- Advanced patterns (challenge modes, ascension)
- Complete game examples
- Design tips
- Balancing guide

**[07. Troubleshooting](07-troubleshooting.md)**
- Editor issues
- Logic problems
- Player mode bugs
- Import/export errors
- Performance issues
- Common mistakes
- Debug tools

### Technical Reference

**[08. API Reference](08-api-reference.md)**
- GameEngine API
- LogicExecutor API
- Manager APIs
- React Hooks
- Data structures
- Node definition format
- Utility functions
- Event types reference

---

## 🚀 Quick Navigation

### I want to...

**Create my first game**
→ Start with [Getting Started](01-getting-started.md)

**Understand resources and buildings**
→ Read [Game Elements](02-game-elements.md)

**Learn visual programming**
→ Study [Logic System](03-logic-system.md)

**Add prestige to my game**
→ Check [Advanced Features](04-advanced-features.md) - Prestige section

**Share my game with others**
→ Follow [Export & Share](05-export-share.md)

**See example logic flows**
→ Browse [Examples & Patterns](06-examples-patterns.md)

**Fix a bug or error**
→ Search [Troubleshooting](07-troubleshooting.md)

**Modify the codebase**
→ Reference [API Reference](08-api-reference.md)

---

## 🎯 Learning Path

### Beginner Path (0-2 hours)
1. **[Getting Started](01-getting-started.md)** - Create first resource and building (30 min)
2. **[Game Elements](02-game-elements.md)** - Learn all element types (45 min)
3. **[Logic System](03-logic-system.md)** - Basic events and actions (45 min)

### Intermediate Path (2-5 hours)
4. **[Examples & Patterns](06-examples-patterns.md)** - Copy proven patterns (1 hour)
5. **[Logic System](03-logic-system.md)** - Advanced nodes (conditions, logic) (1 hour)
6. **[Advanced Features](04-advanced-features.md)** - Prestige, optimization (1 hour)

### Advanced Path (5+ hours)
7. **[Advanced Features](04-advanced-features.md)** - Complex mechanics (2 hours)
8. **[API Reference](08-api-reference.md)** - Code-level understanding (2 hours)
9. Create complete original game (ongoing)

---

## 💡 Key Concepts

### Template-Based Architecture
All logic nodes auto-load via `import.meta.glob`. Just create a new `.jsx` file in the correct folder, and it appears in the toolbox automatically.

### Manager Pattern
The game engine delegates to specialized managers (ResourceManager, BuildingManager, etc.) for clean separation of concerns.

### Hooks-First React
Complex components use custom hooks to extract logic, keeping files under 300 lines.

### Visual Programming
No coding required - connect nodes to create game behaviors. Events trigger actions through conditions and logic nodes.

### Real-Time Testing
Switch to Player tab instantly to test changes. Auto-save keeps your work safe.

---

## 🔧 System Requirements

**Browser:**
- Chrome/Edge (recommended)
- Firefox (supported)
- Safari (limited support)

**Development:**
- Node.js 18+
- npm 9+

**Storage:**
- LocalStorage enabled
- ~5MB available space

---

## 📖 Documentation Conventions

### Code Blocks

**JavaScript:**
```javascript
const example = 'code';
```

**Logic Flows:**
```
Event → Action → Condition
  ✓ → Action if true
  ✗ → Action if false
```

### Notation

- `resourceId` - Variable/parameter names in code style
- **Bold** - Important concepts
- *Italic* - Emphasis
- ✅ - Recommended
- ❌ - Not recommended
- 🔴 - Critical warning

### Links

Internal links connect to other wiki pages:
- [Getting Started](01-getting-started.md)
- [Logic System](03-logic-system.md)

---

## 🆘 Getting Help

**Within Documentation:**
1. Check [Troubleshooting](07-troubleshooting.md) first
2. Search for specific errors
3. Review [Examples & Patterns](06-examples-patterns.md)

**Community:**
- GitHub Issues for bugs
- Discussions for questions
- Discord/Forum for community help

**Before Asking:**
- Check browser console (F12)
- Export your game for sharing
- Note exact steps to reproduce
- Include error messages

---

## 📝 Contributing to Wiki

**Found an error?**
- Report via GitHub Issues
- Tag as 'documentation'

**Want to add content?**
- Submit PR with new sections
- Follow existing format
- Include code examples
- Test all examples

**Improving examples?**
- Add to [Examples & Patterns](06-examples-patterns.md)
- Include full logic flows
- Explain use cases
- Note potential issues

---

## 🎮 Example Games

### Starter Templates

**Simple Clicker**
- 1 resource
- 3 buildings
- 5 upgrades
- Linear prestige

**Multi-Resource Empire**
- 3 resources
- 6 buildings
- Resource conversion
- Synergy bonuses

**Incremental RPG**
- XP and leveling
- Quest system
- Random loot
- Stat progression

See [Examples & Patterns](06-examples-patterns.md) for complete implementations.

---

## 🗺️ Wiki Roadmap

**Current Version:** 1.0

**Planned Additions:**
- Video tutorials
- Interactive examples
- Community game gallery
- Advanced scripting guide
- Mobile optimization guide

---

## 📄 License

This documentation is provided under the same license as Idle Game Creator.

**You may:**
- Use for learning
- Share with others
- Reference in your projects

**Please:**
- Credit Idle Game Creator
- Link back to documentation
- Report errors and improvements

---

## ⭐ Quick Tips

1. **Save frequently** - Auto-save works, but manual exports are safer
2. **Test incrementally** - Test each change before adding more
3. **Use code preview** - Verify logic before testing
4. **Start simple** - Master basics before advanced features
5. **Study examples** - Learn from working patterns
6. **Read error messages** - Browser console has helpful info
7. **Keep backups** - Export before major changes
8. **Join community** - Learn from other creators

---

## 🚀 Ready to Start?

**Begin your journey here:**
[Getting Started →](01-getting-started.md)

**Or jump to a specific topic:**
- [Game Elements](02-game-elements.md)
- [Logic System](03-logic-system.md)
- [Examples & Patterns](06-examples-patterns.md)

Happy creating! 🎮
