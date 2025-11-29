import React, { useCallback, useContext } from 'react';
import { GameDataContext } from '../../components/Editor/GameDataContext';
import { EVENT_TYPES, ACTION_TYPES } from './CustomNodes'; // For dropdown options
import '../../styles/logic-node-properties.css';

function LogicNodeProperties({ node, updateNodeData }) {
  const { gameData } = useContext(GameDataContext);

  const onInputChange = useCallback((event) => {
    const { name, value } = event.target;
    updateNodeData(node.id, { [name]: value });
  }, [node, updateNodeData]);

  if (!node) {
    return (
      <div className="logic-node-properties-panel">
        <p className="no-node-selected">Select a node to view properties</p>
      </div>
    );
  }

  // Render properties based on node type
  const renderGroupProperties = () => {
    const presetColors = [
      { name: 'Purple', value: 'rgba(79, 70, 229, 0.05)', border: 'rgb(79, 70, 229)' },
      { name: 'Blue', value: 'rgba(59, 130, 246, 0.05)', border: 'rgb(59, 130, 246)' },
      { name: 'Green', value: 'rgba(16, 185, 129, 0.05)', border: 'rgb(16, 185, 129)' },
      { name: 'Red', value: 'rgba(239, 68, 68, 0.05)', border: 'rgb(239, 68, 68)' },
      { name: 'Orange', value: 'rgba(245, 158, 11, 0.05)', border: 'rgb(245, 158, 11)' },
      { name: 'Pink', value: 'rgba(236, 72, 153, 0.05)', border: 'rgb(236, 72, 153)' },
      { name: 'Teal', value: 'rgba(20, 184, 166, 0.05)', border: 'rgb(20, 184, 166)' },
      { name: 'Yellow', value: 'rgba(234, 179, 8, 0.05)', border: 'rgb(234, 179, 8)' },
    ];

    return (
      <>
        <div className="property-field">
          <label className="property-label">Group Name</label>
          <input
            type="text"
            name="groupName"
            value={node.data.groupName || 'Flow Group'}
            onChange={onInputChange}
            className="property-input"
            placeholder="Enter group name..."
          />
        </div>

        <div className="property-field">
          <label className="property-label">Color Theme</label>
          <div className="color-preset-grid">
            {presetColors.map((color) => (
              <button
                key={color.name}
                className={`color-preset-button ${node.data.color === color.border ? 'active' : ''}`}
                style={{
                  background: color.value,
                  borderColor: color.border,
                }}
                onClick={() => {
                  updateNodeData(node.id, { color: color.border, colorBg: color.value });
                }}
                title={color.name}
              >
                <div className="color-preset-check" style={{ backgroundColor: color.border }}>
                  {node.data.color === color.border && '✓'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="property-field">
          <label className="property-label">Description</label>
          <textarea
            name="description"
            value={node.data.description || ''}
            onChange={onInputChange}
            className="property-textarea"
            placeholder="Optional description..."
            rows="4"
          />
        </div>
      </>
    );
  };

  const renderEventProperties = () => {
    return (
      <>
        <div className="property-field">
          <label className="property-label">Event Type</label>
          <select name="eventType" value={node.data.eventType || 'onGameStart'} onChange={onInputChange}>
            {Object.entries(EVENT_TYPES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </>
    );
  };

  const renderActionProperties = () => {
    const ActionComponent = ACTION_TYPES[node.data.actionType]?.component;
    return (
      <>
        <div className="property-field">
          <label className="property-label">Action Type</label>
          <select name="actionType" value={node.data.actionType || 'addResource'} onChange={onInputChange}>
            {Object.entries(ACTION_TYPES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        {ActionComponent && (
          // Pass the local node's data and a specific update function for the ActionComponent
          <ActionComponent 
            data={node.data} 
            updateNodeData={(field, value) => updateNodeData(node.id, { [field]: value })} 
          />
        )}
      </>
    );
  };

  // Only show properties panel for group nodes
  if (node.type !== 'group') {
    return (
      <div className="logic-node-properties-panel">
        <p className="no-node-selected">Select a Flow Group to edit properties</p>
      </div>
    );
  }

  return (
    <div className="logic-node-properties-panel">
      <div className="node-properties-header">
        <h3>Flow Group Settings</h3>
      </div>
      <div className="properties-content">
        {renderGroupProperties()}
      </div>
    </div>
  );
}

export default LogicNodeProperties;
