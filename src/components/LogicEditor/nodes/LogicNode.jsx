import React, { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeDataUpdater } from '../shared/NodeDataUpdater';

export const LOGIC_TYPES = {
  delay: {
    label: 'Delay',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Duration (seconds):</label>
          <input className="nodrag" type="number" name="duration" value={data.duration || 1} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  random: {
    label: 'Random',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Chance (%):</label>
          <input className="nodrag" type="number" name="chance" value={data.chance || 50} onChange={handleChange} min="0" max="100" />
        </>
      );
    }
  },
  loop: {
    label: 'Loop',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Repeat Count:</label>
          <input className="nodrag" type="number" name="repeatCount" value={data.repeatCount || 5} onChange={handleChange} min="1" max="100" />
        </>
      );
    }
  },
  branch: {
    label: 'Branch',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Outputs:</label>
          <input className="nodrag" type="number" name="outputCount" value={data.outputCount || 3} onChange={handleChange} min="2" max="5" />
        </>
      );
    }
  },
  sequence: {
    label: 'Sequence',
  },
};

export function LogicNode({ id, data, isConnectable, updateNodeData, selected }) {
  const LogicComponent = LOGIC_TYPES[data.logicType]?.component;
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <div className={`custom-node logic-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Logic</div>
      <div className="node-content">
        <label>Logic Type:</label>
        <select className="nodrag" name="logicType" value={data.logicType || 'delay'} onChange={handleChange}>
          {Object.entries(LOGIC_TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {LogicComponent && (
          <LogicComponent data={data} updateNodeData={(field, value) => updateNodeData(id, { ...data, [field]: value })} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
