import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';

/**
 * useLogicEditorState - Manages nodes, edges, and selection state
 */
export function useLogicEditorState(initialNodes, initialEdges) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  /**
   * Update a node's data
   */
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  /**
   * Delete node
   */
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setSelectedNodeId(null);
  }, [setNodes]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    selectedNodeId,
    setSelectedNodeId,
    updateNodeData,
    clearSelection,
    deleteNode
  };
}
