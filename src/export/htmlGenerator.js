/**
 * HTML Generator - Creates standalone HTML file from game data and layout
 */

export function generateHTML(gameData, layoutBlocks) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameData.meta.title}</title>
  <style>
${generateCSS(gameData, layoutBlocks)}
  </style>
</head>
<body>
  <div id="game-root">
${generateLayoutHTML(gameData, layoutBlocks)}
  </div>

  <!-- Game Data -->
  <script>
  const GAME_DATA = ${JSON.stringify(gameData, null, 2)};
  </script>

  <!-- Game Engine -->
  <script>
${getVanillaEngineCode()}
  </script>

  <!-- Game Renderer -->
  <script>
${generateRendererCode(layoutBlocks)}
  </script>

  <!-- Game Initialization -->
  <script>
  let gameEngine;

  function initGame() {
    gameEngine = new GameEngine(GAME_DATA);

    // Override render method to update UI
    gameEngine.render = function() {
      renderGame(this);
    };

    gameEngine.start();
    renderGame(gameEngine);
  }

  // Start game when page loads
  window.addEventListener('DOMContentLoaded', initGame);
  </script>
</body>
</html>`;

  return html;
}

function generateCSS(gameData, layoutBlocks) {
  return `/* Game Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #000000;
  color: #ffffff;
  line-height: 1.5;
}

#game-root {
  width: 100%;
  min-height: 100vh;
}

/* Block Styles */
${layoutBlocks.map(block => generateBlockCSS(block)).join('\n')}

/* UI Components */
.resource-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #111;
  border-radius: 8px;
  border: 1px solid #333;
}

.resource-icon {
  font-size: 2rem;
}

.resource-info {
  flex: 1;
}

.resource-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
}

.resource-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.resource-per-second {
  font-size: 0.75rem;
  color: #888;
}

.click-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #333, #555);
  border: 4px solid #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  user-select: none;
}

.click-button:hover {
  transform: scale(1.05);
  border-color: #888;
}

.click-button:active {
  transform: scale(0.95);
}

.click-info {
  text-align: center;
  color: #888;
  font-size: 0.875rem;
}

.building-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  transition: all 0.2s;
}

.building-card:hover {
  border-color: #666;
}

.building-card.affordable {
  border-color: #4ade80;
}

.building-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.building-info {
  flex: 1;
  min-width: 0;
}

.building-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.building-description {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.building-owned {
  font-size: 0.75rem;
  color: #4ade80;
}

.building-buy {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.buy-button {
  padding: 0.5rem 1rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.buy-button:hover {
  background: #444;
  border-color: #666;
}

.buy-button.affordable {
  background: #4ade80;
  border-color: #4ade80;
  color: #000;
}

.buy-button.affordable:hover {
  background: #22c55e;
}

.buy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cost-display {
  font-size: 0.75rem;
  color: #888;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  background: #333;
  border: 2px solid #555;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #4ade80;
  border-color: #4ade80;
  color: #000;
}

.notification.achievement {
  background: #fbbf24;
  border-color: #fbbf24;
  color: #000;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.tab-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #888;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
}

.tab-button:hover {
  background: #222;
  color: #fff;
}

.tab-button.active {
  background: #333;
  color: #fff;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}`;
}

function generateBlockCSS(block) {
  const styleString = Object.entries(block.style)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssKey}: ${value};`;
    })
    .join('\n');

  return `#${block.id} {
${styleString}
}`;
}

function generateLayoutHTML(gameData, layoutBlocks) {
  const rootBlocks = layoutBlocks.filter(b => !b.parentId).sort((a, b) => a.order - b.order);
  return rootBlocks.map(block => generateBlockHTML(block, layoutBlocks, gameData)).join('\n');
}

function generateBlockHTML(block, allBlocks, gameData) {
  const children = allBlocks
    .filter(b => b.parentId === block.id)
    .sort((a, b) => a.order - b.order);

  let content = '';

  switch (block.type) {
    case 'header':
      content = `
        <h1>${gameData.meta.title}</h1>
        ${gameData.meta.author ? `<p>by ${gameData.meta.author}</p>` : ''}
      `;
      break;

    case 'resources':
      content = '<div id="resources-container"></div>';
      break;

    case 'click':
      content = `
        <div class="click-button" id="click-button" onclick="gameEngine.click()"></div>
        <div class="click-info" id="click-info"></div>
      `;
      break;

    case 'buildings':
      content = '<div id="buildings-container"></div>';
      break;

    case 'tabs':
      content = `
        <div class="tab-buttons">
          <button class="tab-button active" onclick="switchTab('buildings')">Buildings</button>
          <button class="tab-button" onclick="switchTab('upgrades')">Upgrades</button>
          <button class="tab-button" onclick="switchTab('achievements')">Achievements</button>
        </div>
        <div id="tab-buildings" class="tab-content active"></div>
        <div id="tab-upgrades" class="tab-content"></div>
        <div id="tab-achievements" class="tab-content"></div>
      `;
      break;

    case 'stats':
      content = '<div id="stats-container"></div>';
      break;

    case 'container':
    default:
      // Empty container or render children
      break;
  }

  const childrenHTML = children.length > 0
    ? children.map(child => generateBlockHTML(child, allBlocks, gameData)).join('\n')
    : '';

  return `<div id="${block.id}">${content}${childrenHTML}</div>`;
}

function getVanillaEngineCode() {
  // Returns the complete vanilla JS game engine
  return `class GameEngine {
  constructor(gameData) {
    this.gameData = gameData;
    this.gameState = this.createInitialState();
    this.tickInterval = null;
  }

  createInitialState() {
    const state = {
      resources: {},
      buildings: {},
      upgrades: {},
      achievements: {},
      totalClicks: 0,
      notifications: []
    };

    this.gameData.resources.forEach(resource => {
      state.resources[resource.id] = {
        amount: resource.startAmount || 0,
        total: 0,
        perSecond: 0,
        totalProduced: 0,
        totalSpent: 0
      };
    });

    this.gameData.buildings.forEach(building => {
      state.buildings[building.id] = {
        owned: 0,
        totalBought: 0,
        unlocked: true
      };
    });

    this.gameData.upgrades.forEach(upgrade => {
      state.upgrades[upgrade.id] = {
        purchased: false,
        unlocked: true
      };
    });

    this.gameData.achievements.forEach(achievement => {
      state.achievements[achievement.id] = {
        unlocked: false,
        progress: 0
      };
    });

    return state;
  }

  start() {
    this.tick();
    this.tickInterval = setInterval(() => this.tick(), 100);
    this.render();
  }

  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }

  tick() {
    this.calculateProduction();
    this.checkAchievements();
    this.render();
  }

  calculateProduction() {
    this.gameData.resources.forEach(resource => {
      let perSecond = 0;

      this.gameData.buildings.forEach(building => {
        const owned = this.gameState.buildings[building.id].owned;
        if (owned > 0 && building.produces) {
          building.produces.forEach(prod => {
            if (prod.resourceId === resource.id) {
              perSecond += prod.amount * owned;
            }
          });
        }
      });

      this.gameData.upgrades.forEach(upgrade => {
        if (this.gameState.upgrades[upgrade.id].purchased && upgrade.effects) {
          upgrade.effects.forEach(effect => {
            if (effect.type === 'multiply' && effect.target === 'production') {
              perSecond *= effect.value;
            }
          });
        }
      });

      this.gameState.resources[resource.id].perSecond = perSecond;

      const amount = perSecond * 0.1;
      if (amount > 0) {
        this.addResource(resource.id, amount);
      }
    });
  }

  click() {
    const clickResource = this.gameData.resources.find(r => r.clickable);
    if (!clickResource) return;

    let amount = clickResource.clickAmount || 1;

    this.gameData.upgrades.forEach(upgrade => {
      if (this.gameState.upgrades[upgrade.id].purchased && upgrade.effects) {
        upgrade.effects.forEach(effect => {
          if (effect.type === 'multiply' && effect.target === 'click') {
            amount *= effect.value;
          }
        });
      }
    });

    this.addResource(clickResource.id, amount);
    this.gameState.totalClicks++;
    this.render();
  }

  addResource(resourceId, amount) {
    const resourceState = this.gameState.resources[resourceId];
    resourceState.amount += amount;
    resourceState.total += amount;
    resourceState.totalProduced += amount;
  }

  buyBuilding(buildingId, amount = 1) {
    const building = this.gameData.buildings.find(b => b.id === buildingId);
    if (!building) return false;

    const owned = this.gameState.buildings[buildingId].owned;
    const cost = this.calculateBuildingCost(building, owned, amount);

    if (!this.canAfford(cost)) return false;

    cost.forEach(({ resourceId, amount }) => {
      this.gameState.resources[resourceId].amount -= amount;
      this.gameState.resources[resourceId].totalSpent += amount;
    });

    this.gameState.buildings[buildingId].owned += amount;
    this.gameState.buildings[buildingId].totalBought += amount;

    this.render();
    return true;
  }

  calculateBuildingCost(building, owned, amount = 1) {
    return building.cost.map(costItem => {
      let totalCost = 0;
      for (let i = 0; i < amount; i++) {
        totalCost += costItem.baseAmount * Math.pow(building.costScaling, owned + i);
      }
      return {
        resourceId: costItem.resourceId,
        amount: totalCost
      };
    });
  }

  canAfford(cost) {
    return cost.every(({ resourceId, amount }) => {
      return this.gameState.resources[resourceId].amount >= amount;
    });
  }

  buyUpgrade(upgradeId) {
    const upgrade = this.gameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const upgradeState = this.gameState.upgrades[upgradeId];
    if (upgradeState.purchased) return false;

    if (!this.canAfford(upgrade.cost)) return false;

    upgrade.cost.forEach(({ resourceId, amount }) => {
      this.gameState.resources[resourceId].amount -= amount;
      this.gameState.resources[resourceId].totalSpent += amount;
    });

    upgradeState.purchased = true;
    this.showNotification('Upgrade purchased: ' + upgrade.name, 'success');
    this.render();
    return true;
  }

  checkAchievements() {
    this.gameData.achievements.forEach(achievement => {
      const state = this.gameState.achievements[achievement.id];
      if (state.unlocked) return;

      let unlocked = false;
      if (achievement.requirements) {
        achievement.requirements.forEach(req => {
          if (req.type === 'resource') {
            const resourceState = this.gameState.resources[req.resourceId];
            unlocked = resourceState && resourceState.amount >= req.amount;
          } else if (req.type === 'totalClicks') {
            unlocked = this.gameState.totalClicks >= req.amount;
          } else if (req.type === 'building') {
            const buildingState = this.gameState.buildings[req.buildingId];
            unlocked = buildingState && buildingState.owned >= req.amount;
          }
        });
      }

      if (unlocked) {
        state.unlocked = true;
        this.showNotification('Achievement unlocked: ' + achievement.name, 'achievement');
      }
    });
  }

  showNotification(message, type) {
    const notification = { message: message, type: type || 'info', id: Date.now() };
    this.gameState.notifications.push(notification);

    const self = this;
    setTimeout(function() {
      const index = self.gameState.notifications.findIndex(function(n) { return n.id === notification.id; });
      if (index >= 0) {
        self.gameState.notifications.splice(index, 1);
        self.render();
      }
    }, 3000);

    this.render();
  }

  formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
  }

  render() {
    // Overridden during initialization
  }
}`;
}

function generateRendererCode(layoutBlocks) {
  return `
let currentTab = 'buildings';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');

  renderGame(gameEngine);
}

function renderGame(engine) {
  renderResources(engine);
  renderClickButton(engine);
  renderBuildings(engine);
  renderTabs(engine);
  renderNotifications(engine);
}

function renderResources(engine) {
  const container = document.getElementById('resources-container');
  if (!container) return;

  container.innerHTML = engine.gameData.resources.map(resource => {
    const state = engine.gameState.resources[resource.id];
    return \`
      <div class="resource-display">
        <div class="resource-icon">\${resource.icon}</div>
        <div class="resource-info">
          <div class="resource-name">\${resource.name}</div>
          <div class="resource-amount">\${engine.formatNumber(state.amount)}</div>
          <div class="resource-per-second">\${engine.formatNumber(state.perSecond)}/sec</div>
        </div>
      </div>
    \`;
  }).join('');
}

function renderClickButton(engine) {
  const button = document.getElementById('click-button');
  const info = document.getElementById('click-info');
  if (!button || !info) return;

  const clickResource = engine.gameData.resources.find(r => r.clickable);
  if (!clickResource) return;

  button.textContent = clickResource.icon;

  let clickValue = clickResource.clickAmount || 1;
  engine.gameData.upgrades.forEach(upgrade => {
    if (engine.gameState.upgrades[upgrade.id].purchased) {
      upgrade.effects.forEach(effect => {
        if (effect.type === 'multiply' && effect.target === 'click') {
          clickValue *= effect.value;
        }
      });
    }
  });

  info.textContent = \`+\${engine.formatNumber(clickValue)} per click\`;
}

function renderBuildings(engine) {
  const container = document.getElementById('buildings-container');
  const tabContainer = document.getElementById('tab-buildings');
  const target = tabContainer || container;
  if (!target) return;

  target.innerHTML = engine.gameData.buildings.map(building => {
    const state = engine.gameState.buildings[building.id];
    const cost = engine.calculateBuildingCost(building, state.owned, 1);
    const canAfford = engine.canAfford(cost);

    return \`
      <div class="building-card \${canAfford ? 'affordable' : ''}">
        <div class="building-icon">\${building.icon}</div>
        <div class="building-info">
          <div class="building-name">\${building.name}</div>
          <div class="building-description">\${building.description}</div>
          <div class="building-owned">Owned: \${state.owned}</div>
        </div>
        <div class="building-buy">
          <button class="buy-button \${canAfford ? 'affordable' : ''}"
                  onclick="gameEngine.buyBuilding('\${building.id}')">
            Buy
          </button>
          <div class="cost-display">
            \${cost.map(c => {
              const resource = engine.gameData.resources.find(r => r.id === c.resourceId);
              return \`\${engine.formatNumber(c.amount)} \${resource.icon}\`;
            }).join(' ')}
          </div>
        </div>
      </div>
    \`;
  }).join('');
}

function renderTabs(engine) {
  if (currentTab === 'upgrades') {
    renderUpgrades(engine);
  } else if (currentTab === 'achievements') {
    renderAchievements(engine);
  }
}

function renderUpgrades(engine) {
  const container = document.getElementById('tab-upgrades');
  if (!container) return;

  container.innerHTML = engine.gameData.upgrades
    .filter(upgrade => engine.gameState.upgrades[upgrade.id].unlocked)
    .map(upgrade => {
      const state = engine.gameState.upgrades[upgrade.id];
      const canAfford = !state.purchased && engine.canAfford(upgrade.cost);

      return \`
        <div class="building-card \${canAfford ? 'affordable' : ''} \${state.purchased ? 'purchased' : ''}">
          <div class="building-icon">\${upgrade.icon}</div>
          <div class="building-info">
            <div class="building-name">\${upgrade.name}</div>
            <div class="building-description">\${upgrade.description}</div>
          </div>
          <div class="building-buy">
            \${state.purchased ? '<span>Purchased</span>' : \`
              <button class="buy-button \${canAfford ? 'affordable' : ''}"
                      onclick="gameEngine.buyUpgrade('\${upgrade.id}')">
                Buy
              </button>
              <div class="cost-display">
                \${upgrade.cost.map(c => {
                  const resource = engine.gameData.resources.find(r => r.id === c.resourceId);
                  return \`\${engine.formatNumber(c.amount)} \${resource.icon}\`;
                }).join(' ')}
              </div>
            \`}
          </div>
        </div>
      \`;
    }).join('');
}

function renderAchievements(engine) {
  const container = document.getElementById('tab-achievements');
  if (!container) return;

  container.innerHTML = engine.gameData.achievements.map(achievement => {
    const state = engine.gameState.achievements[achievement.id];

    return \`
      <div class="building-card \${state.unlocked ? 'unlocked' : 'locked'}">
        <div class="building-icon">\${achievement.icon}</div>
        <div class="building-info">
          <div class="building-name">\${achievement.name}</div>
          <div class="building-description">\${achievement.description}</div>
        </div>
        <div class="building-buy">
          \${state.unlocked ? '<span>✓ Unlocked</span>' : '<span>🔒 Locked</span>'}
        </div>
      </div>
    \`;
  }).join('');
}

function renderNotifications(engine) {
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());

  engine.gameState.notifications.forEach(notification => {
    const div = document.createElement('div');
    div.className = \`notification \${notification.type}\`;
    div.textContent = notification.message;
    document.body.appendChild(div);
  });
}
`;
}
