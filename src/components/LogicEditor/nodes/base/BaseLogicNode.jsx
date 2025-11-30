import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

/**
 * Base Logic Node Component
 * All logic nodes extend from this base
 */
export function BaseLogicNode({ id, data, isConnectable, updateNodeData, selected, config }) {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
  const PropertiesComponent = config.component;

  return (
    <div className={`custom-node logic-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Logic</div>
      <div className="node-content">
        <label>Logic Type:</label>
        <select
          className="nodrag"
          name="logicType"
          value={data.logicType || config.id}
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
 * Template for creating new logic node definitions
 * Copy this template and customize the values
 */
export const LogicNodeTemplate = {
  // Unique identifier (use camelCase)
  id: 'logicName',

  // Display name in toolbox and dropdowns
  label: 'Logic Display Name',

  // Icon for toolbox (emoji or icon)
  icon: '🔀',

  // Short description for toolbox
  description: 'Brief description of what this logic does',

  // Category (always 'logic')
  category: 'logic',

  // Node type (always 'logic')
  type: 'logic',

  // Default data when node is created
  defaultData: {
    logicType: 'logicName',
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
