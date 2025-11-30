import React from 'react';
import { NodeResizer } from 'reactflow';

// Group Node - For visually grouping flows
export function GroupNode({ id, data, isConnectable, updateNodeData, selected }) {
  const borderColor = data.color || 'rgb(79, 70, 229)';
  const backgroundColor = data.colorBg || 'rgba(79, 70, 229, 0.05)';

  return (
    <div
      className={`custom-node group-node ${selected ? 'selected' : ''}`}
      style={{
        width: data.width || 400,
        height: data.height || 300,
        background: backgroundColor,
        borderColor: borderColor,
      }}
    >
      <NodeResizer minWidth={200} minHeight={150} />
      <div className="group-header" style={{
        background: backgroundColor.replace('0.05', '0.15'),
      }}>
        <span className="group-title" style={{ color: borderColor }}>
          {data.groupName || 'Flow Group'}
        </span>
      </div>
      {data.description && (
        <div className="group-description-hint">
          {data.description.substring(0, 50)}{data.description.length > 50 ? '...' : ''}
        </div>
      )}
    </div>
  );
}
