import React, { useContext, useState, useMemo } from 'react';
import { GameDataContext } from '../../components/Editor/GameDataContext';
import '../../styles/logic-toolbox.css';

// Node Library - All available nodes organized by category
const NODE_LIBRARY = {
  events: {
    label: 'Events',
    icon: '⚡',
    nodes: [
      { id: 'onGameStart', label: 'Game Start', icon: '🎮', description: 'When game starts', type: 'event', defaultData: { eventType: 'onGameStart' } },
      { id: 'onTick', label: 'Every Second', icon: '⏱️', description: 'Every game tick', type: 'event', defaultData: { eventType: 'onTick' } },
      { id: 'onClick', label: 'On Click', icon: '👆', description: 'On resource click', type: 'event', defaultData: { eventType: 'onClick' } },
      { id: 'afterXClicks', label: 'After X Clicks', icon: '🖱️', description: 'After X clicks', type: 'event', defaultData: { eventType: 'afterXClicks' } },
      { id: 'afterXSeconds', label: 'After X Seconds', icon: '⏰', description: 'After X seconds', type: 'event', defaultData: { eventType: 'afterXSeconds' } },
      { id: 'afterXResources', label: 'After X Resources', icon: '💰', description: 'After reaching amount', type: 'event', defaultData: { eventType: 'afterXResources' } },
      { id: 'afterBoughtUpgrade', label: 'Bought Upgrade', icon: '🎁', description: 'After buying upgrade', type: 'event', defaultData: { eventType: 'afterBoughtUpgrade' } },
      { id: 'afterXBoughtUpgrades', label: 'After X Upgrades', icon: '📦', description: 'After buying X upgrades', type: 'event', defaultData: { eventType: 'afterXBoughtUpgrades' } },
      { id: 'afterXResourcesSpent', label: 'After X Spent', icon: '💸', description: 'After spending resources', type: 'event', defaultData: { eventType: 'afterXResourcesSpent' } },
      { id: 'onPrestige', label: 'On Prestige', icon: '⭐', description: 'When player prestiges', type: 'event', defaultData: { eventType: 'onPrestige' } },
      { id: 'afterXBuildings', label: 'After X Buildings', icon: '🏘️', description: 'After owning X buildings', type: 'event', defaultData: { eventType: 'afterXBuildings' } },
      { id: 'afterBoughtBuilding', label: 'Bought Building', icon: '🏠', description: 'After buying building', type: 'event', defaultData: { eventType: 'afterBoughtBuilding' } },
      { id: 'onAchievementUnlock', label: 'Achievement Unlock', icon: '🏆', description: 'When achievement unlocks', type: 'event', defaultData: { eventType: 'onAchievementUnlock' } },
      { id: 'afterXAchievements', label: 'After X Achievements', icon: '🎖️', description: 'After unlocking X achievements', type: 'event', defaultData: { eventType: 'afterXAchievements' } },
      { id: 'onResourceFull', label: 'Resource Full', icon: '📊', description: 'When resource reaches max', type: 'event', defaultData: { eventType: 'onResourceFull' } },
      { id: 'onResourceEmpty', label: 'Resource Empty', icon: '📉', description: 'When resource reaches 0', type: 'event', defaultData: { eventType: 'onResourceEmpty' } },
      { id: 'afterXProduction', label: 'After X Production', icon: '🏭', description: 'After producing X total', type: 'event', defaultData: { eventType: 'afterXProduction' } },
      { id: 'onBuildingMaxed', label: 'Building Maxed', icon: '🔝', description: 'When building maxed', type: 'event', defaultData: { eventType: 'onBuildingMaxed' } },
      { id: 'afterPlaytime', label: 'After Playtime', icon: '🕐', description: 'After X minutes played', type: 'event', defaultData: { eventType: 'afterPlaytime' } },
    ]
  },
  actions: {
    label: 'Actions',
    icon: '⚙️',
    nodes: [
      { id: 'addResource', label: 'Add Resource', icon: '➕', description: 'Add resource amount', type: 'action', defaultData: { actionType: 'addResource' } },
      { id: 'removeResource', label: 'Remove Resource', icon: '➖', description: 'Remove resource amount', type: 'action', defaultData: { actionType: 'removeResource' } },
      { id: 'setResource', label: 'Set Resource', icon: '🔢', description: 'Set resource to value', type: 'action', defaultData: { actionType: 'setResource' } },
      { id: 'multiplyResource', label: 'Multiply Resource', icon: '✖️', description: 'Multiply resource by factor', type: 'action', defaultData: { actionType: 'multiplyResource' } },
      { id: 'unlockUpgrade', label: 'Unlock Upgrade', icon: '🔓', description: 'Unlock an upgrade', type: 'action', defaultData: { actionType: 'unlockUpgrade' } },
      { id: 'unlockBuilding', label: 'Unlock Building', icon: '🔑', description: 'Unlock a building', type: 'action', defaultData: { actionType: 'unlockBuilding' } },
      { id: 'showNotification', label: 'Show Notification', icon: '💬', description: 'Show popup message', type: 'action', defaultData: { actionType: 'showNotification' } },
      { id: 'addProduction', label: 'Add Production', icon: '📈', description: 'Add production per second', type: 'action', defaultData: { actionType: 'addProduction' } },
      { id: 'multiplyProduction', label: 'Multiply Production', icon: '🚀', description: 'Multiply production rate', type: 'action', defaultData: { actionType: 'multiplyProduction' } },
      { id: 'forcePrestige', label: 'Force Prestige', icon: '💫', description: 'Force player to prestige', type: 'action', defaultData: { actionType: 'forcePrestige' } },
      { id: 'unlockAchievement', label: 'Unlock Achievement', icon: '🎯', description: 'Unlock achievement', type: 'action', defaultData: { actionType: 'unlockAchievement' } },
      { id: 'setClickPower', label: 'Set Click Power', icon: '👊', description: 'Change click power', type: 'action', defaultData: { actionType: 'setClickPower' } },
    ]
  },
  conditions: {
    label: 'Conditions',
    icon: '❓',
    nodes: [
      { id: 'ifResource', label: 'If Resource', icon: '💎', description: 'Check resource amount', type: 'condition', defaultData: { conditionType: 'ifResource' } },
      { id: 'ifBuilding', label: 'If Building', icon: '🏗️', description: 'Check building count', type: 'condition', defaultData: { conditionType: 'ifBuilding' } },
      { id: 'ifUpgradeOwned', label: 'If Upgrade Owned', icon: '🎁', description: 'Check if upgrade owned', type: 'condition', defaultData: { conditionType: 'ifUpgradeOwned' } },
      { id: 'ifAchievementUnlocked', label: 'If Achievement', icon: '🏆', description: 'Check if achievement unlocked', type: 'condition', defaultData: { conditionType: 'ifAchievementUnlocked' } },
      { id: 'ifProductionRate', label: 'If Production Rate', icon: '📊', description: 'Check production per second', type: 'condition', defaultData: { conditionType: 'ifProductionRate' } },
      { id: 'ifPrestigeLevel', label: 'If Prestige Level', icon: '⭐', description: 'Check prestige level', type: 'condition', defaultData: { conditionType: 'ifPrestigeLevel' } },
      { id: 'ifPlaytime', label: 'If Playtime', icon: '⏲️', description: 'Check total playtime', type: 'condition', defaultData: { conditionType: 'ifPlaytime' } },
      { id: 'ifBuildingOwned', label: 'If Building Owned', icon: '🏠', description: 'Check if owns building', type: 'condition', defaultData: { conditionType: 'ifBuildingOwned' } },
    ]
  },
  logic: {
    label: 'Logic',
    icon: '🔀',
    nodes: [
      { id: 'delay', label: 'Delay', icon: '⏳', description: 'Wait before continuing', type: 'logic', defaultData: { logicType: 'delay' } },
      { id: 'random', label: 'Random', icon: '🎲', description: 'Random chance branch', type: 'logic', defaultData: { logicType: 'random' } },
      { id: 'loop', label: 'Loop', icon: '🔄', description: 'Repeat actions X times', type: 'logic', defaultData: { logicType: 'loop' } },
      { id: 'branch', label: 'Branch', icon: '🌳', description: 'Multiple output paths', type: 'logic', defaultData: { logicType: 'branch' } },
      { id: 'sequence', label: 'Sequence', icon: '📝', description: 'Execute in order', type: 'logic', defaultData: { logicType: 'sequence' } },
    ]
  },
  organization: {
    label: 'Organization',
    icon: '📦',
    nodes: [
      { id: 'group', label: 'Flow Group', icon: '📁', description: 'Group nodes visually', type: 'group', defaultData: { groupName: 'Flow Group', width: 400, height: 300 } },
    ]
  }
};

const LogicToolbox = ({ setNodesRef, updateNodeDataRef }) => {
  const { gameData } = useContext(GameDataContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['events', 'actions']));

  const onDragStart = (event, nodeConfig) => {
    // Prevent drag from starting on interactive elements
    if (event.target.tagName === 'SELECT' || event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      nodeType: nodeConfig.type,
      defaultData: nodeConfig.defaultData
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Filter nodes based on search query
  const filteredLibrary = useMemo(() => {
    if (!searchQuery.trim()) return NODE_LIBRARY;

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(NODE_LIBRARY).forEach(([categoryId, category]) => {
      const matchingNodes = category.nodes.filter(node =>
        node.label.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query)
      );

      if (matchingNodes.length > 0) {
        filtered[categoryId] = {
          ...category,
          nodes: matchingNodes
        };
      }
    });

    return filtered;
  }, [searchQuery]);

  return (
    <div className="logic-toolbox">
      <div className="toolbox-header">
        <h3>Node Library</h3>
        <input
          type="text"
          className="toolbox-search nodrag"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="toolbox-categories">
        {Object.entries(filteredLibrary).map(([categoryId, category]) => (
          <div key={categoryId} className="toolbox-category">
            <div
              className="category-header"
              onClick={() => toggleCategory(categoryId)}
            >
              <div className="category-header-left">
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
                <span className="category-count">{category.nodes.length}</span>
              </div>
              <span className={`category-toggle ${expandedCategories.has(categoryId) ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>

            {expandedCategories.has(categoryId) && (
              <div className="category-nodes">
                {category.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="toolbox-node"
                    draggable
                    onDragStart={(e) => onDragStart(e, node)}
                  >
                    <div className="toolbox-node-icon">{node.icon}</div>
                    <div className="toolbox-node-info">
                      <div className="toolbox-node-label">{node.label}</div>
                      <div className="toolbox-node-description">{node.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(filteredLibrary).length === 0 && (
        <div className="toolbox-empty">
          <div className="toolbox-empty-icon">🔍</div>
          <div className="toolbox-empty-text">No nodes found</div>
        </div>
      )}
    </div>
  );
};

export default LogicToolbox;
