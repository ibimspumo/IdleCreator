import React, { useContext, useState, useMemo } from 'react';
import { GameDataContext } from '../../components/Editor/GameDataContext';
import '../../styles/logic-toolbox.css';

// Import all node types dynamically
import { EVENT_TYPES } from './nodes/events';
import { ACTION_TYPES } from './nodes/actions';
import { CONDITION_TYPES } from './nodes/conditions';
import { LOGIC_TYPES } from './nodes/logic';

// Build Node Library automatically from imported types
const NODE_LIBRARY = {
  events: {
    label: 'Events',
    icon: '⚡',
    nodes: Object.values(EVENT_TYPES)
  },
  actions: {
    label: 'Actions',
    icon: '⚙️',
    nodes: Object.values(ACTION_TYPES)
  },
  conditions: {
    label: 'Conditions',
    icon: '❓',
    nodes: Object.values(CONDITION_TYPES)
  },
  logic: {
    label: 'Logic',
    icon: '🔀',
    nodes: Object.values(LOGIC_TYPES)
  },
  organization: {
    label: 'Organization',
    icon: '📦',
    nodes: [
      {
        id: 'group',
        label: 'Flow Group',
        icon: '📁',
        description: 'Group nodes visually',
        type: 'group',
        defaultData: {
          groupName: 'Flow Group',
          width: 400,
          height: 300
        }
      }
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
