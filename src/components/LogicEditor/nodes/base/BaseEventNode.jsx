import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

/**
 * Base Event Node Component
 * All event nodes extend from this base
 */
export function BaseEventNode({ id, data, isConnectable, updateNodeData, selected, config }) {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
  const PropertiesComponent = config.component;

  return (
    <div className={`custom-node event-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">Event Trigger</div>
      <div className="node-content">
        <label>Event Type:</label>
        <select
          className="nodrag"
          name="eventType"
          value={data.eventType || config.id}
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
 * Template for creating new event node definitions
 * Copy this template and customize the values
 */
export const EventNodeTemplate = {
  // Unique identifier (use camelCase)
  id: 'eventName',

  // Display name in toolbox and dropdowns
  label: 'Event Display Name',

  // Icon for toolbox (emoji or icon)
  icon: '⚡',

  // Short description for toolbox
  description: 'Brief description of what this event does',

  // Category (always 'events')
  category: 'events',

  // Node type (always 'event')
  type: 'event',

  // Default data when node is created
  defaultData: {
    eventType: 'eventName',
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
