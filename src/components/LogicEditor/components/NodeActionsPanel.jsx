import React from 'react';

/**
 * NodeActionsPanel - Displays delete and group actions for selected node
 */
export function NodeActionsPanel({
  selectedNode,
  groupNodes,
  onDelete,
  onAddToGroup,
  onRemoveFromGroup
}) {
  if (!selectedNode) return null;

  const isInGroup = selectedNode.parentNode;

  return (
    <div className="node-actions-panel">
      <button
        className="node-delete-button"
        onClick={onDelete}
        title="Delete node (or press Delete key)"
      >
        <span className="delete-icon">🗑️</span>
        Delete
      </button>

      {selectedNode.type !== 'group' && (
        <>
          {isInGroup ? (
            <button
              className="node-action-button remove-from-group"
              onClick={onRemoveFromGroup}
              title="Remove from group"
            >
              <span>📤</span>
              Ungroup
            </button>
          ) : groupNodes.length > 0 && (
            <div className="add-to-group-dropdown">
              <select
                className="nodrag"
                onChange={(e) => {
                  if (e.target.value) {
                    onAddToGroup(e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="">Add to Group...</option>
                {groupNodes.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.data.groupName || 'Unnamed Group'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}
