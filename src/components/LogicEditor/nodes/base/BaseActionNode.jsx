import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

/**
 * Base Action Node Component
 * All action nodes extend from this base
 */
export function BaseActionNode({ id, data, isConnectable, updateNodeData, selected, config }) {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
  const PropertiesComponent = config.component;

  return (
    <div className={`custom-node action-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Action</div>
      <div className="node-content">
        <label>Action Type:</label>
        <select
          className="nodrag"
          name="actionType"
          value={data.actionType || config.id}
          onChange={handleChange}
          disabled
        >
          <option value={config.id}>{config.label}</option>
        </select>
        {PropertiesComponent && (
          <PropertiesComponent id={id} data={data} updateNodeData={updateNodeData} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}

/**
 * Template for creating new action node definitions
 * Copy this template and customize the values
 */
export const ActionNodeTemplate = {
  // Unique identifier (use camelCase)
  id: 'actionName',

  // Display name in toolbox and dropdowns
  label: 'Action Display Name',

  // Icon for toolbox (emoji or icon)
  icon: '⚙️',

  // Short description for toolbox
  description: 'Brief description of what this action does',

  // Category (always 'actions')
  category: 'actions',

  // Node type (always 'action')
  type: 'action',

  // Default data when node is created
  defaultData: {
    actionType: 'actionName',
    // Add any default properties here
  },

  // Optional: Properties component for node configuration
  // If not provided, node will have no additional properties
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Example Property:</label>
        <input
          className="nodrag"
          type="text"
          name="exampleProperty"
          value={data.exampleProperty || ''}
          onChange={handleChange}
        />
      </>
    );
  }
};
