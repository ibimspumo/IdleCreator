import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

/**
 * Base Condition Node Component
 * All condition nodes extend from this base
 */
export function BaseConditionNode({ id, data, isConnectable, updateNodeData, selected, config }) {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
  const PropertiesComponent = config.component;

  return (
    <div className={`custom-node condition-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Condition</div>
      <div className="node-content">
        <label>Condition Type:</label>
        <select
          className="nodrag"
          name="conditionType"
          value={data.conditionType || config.id}
          onChange={handleChange}
          disabled
        >
          <option value={config.id}>{config.label}</option>
        </select>
        {PropertiesComponent && (
          <PropertiesComponent id={id} data={data} updateNodeData={updateNodeData} />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        isConnectable={isConnectable}
        style={{ left: '30%', background: '#10b981', borderColor: '#059669' }}
      />
      <div className="handle-label handle-label-true">True</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        isConnectable={isConnectable}
        style={{ left: '70%', background: '#ef4444', borderColor: '#dc2626' }}
      />
      <div className="handle-label handle-label-false">False</div>
    </div>
  );
}

/**
 * Template for creating new condition node definitions
 * Copy this template and customize the values
 */
export const ConditionNodeTemplate = {
  // Unique identifier (use camelCase)
  id: 'conditionName',

  // Display name in toolbox and dropdowns
  label: 'Condition Display Name',

  // Icon for toolbox (emoji or icon)
  icon: '❓',

  // Short description for toolbox
  description: 'Brief description of what this condition checks',

  // Category (always 'conditions')
  category: 'conditions',

  // Node type (always 'condition')
  type: 'condition',

  // Default data when node is created
  defaultData: {
    conditionType: 'conditionName',
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
