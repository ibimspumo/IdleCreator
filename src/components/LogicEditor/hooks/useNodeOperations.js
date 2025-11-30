import { useCallback } from 'react';
import { addEdge, MarkerType } from 'reactflow';

/**
 * useNodeOperations - Handles node drag, connect, delete, and group operations
 */
export function useNodeOperations(setNodes, setEdges, setSelectedNodeId, onNodeSelect) {
  /**
   * Handle connection between nodes
   */
  const onConnect = useCallback(
    (connection) => {
      // Color-code edges based on source handle (for condition nodes)
      let edgeStyle = { stroke: 'var(--text-tertiary)', strokeWidth: 2 };

      if (connection.sourceHandle === 'true') {
        edgeStyle = { stroke: '#10b981', strokeWidth: 2.5 };
      } else if (connection.sourceHandle === 'false') {
        edgeStyle = { stroke: '#ef4444', strokeWidth: 2.5 };
      }

      const newEdge = {
        ...connection,
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStyle.stroke,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  /**
   * Handle node drag stop
   */
  const onNodeDragStop = useCallback((event, node) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
    );
  }, [setNodes]);

  /**
   * Handle nodes delete
   */
  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) => nds.filter((node) => !deleted.includes(node)));
      setEdges((eds) => eds.filter((edge) => !deleted.some((node) => node.id === edge.source || node.id === edge.target)));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges, setSelectedNodeId]
  );

  /**
   * Add node to group
   */
  const addNodeToGroup = useCallback((nodeId, groupId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId && n.type !== 'group') {
          // Calculate position relative to group
          const groupNode = nds.find((gn) => gn.id === groupId);
          if (groupNode) {
            const relativePosition = {
              x: n.position.x - groupNode.position.x,
              y: n.position.y - groupNode.position.y,
            };
            return {
              ...n,
              position: relativePosition,
              parentNode: groupId,
              extent: 'parent',
            };
          }
        }
        return n;
      })
    );
  }, [setNodes]);

  /**
   * Remove node from group
   */
  const removeNodeFromGroup = useCallback((nodeId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId && n.parentNode) {
          // Calculate absolute position
          const parentNode = nds.find((pn) => pn.id === n.parentNode);
          if (parentNode) {
            const absolutePosition = {
              x: n.position.x + parentNode.position.x,
              y: n.position.y + parentNode.position.y,
            };
            return {
              ...n,
              position: absolutePosition,
              parentNode: undefined,
              extent: undefined,
            };
          }
        }
        return n;
      })
    );
  }, [setNodes]);

  /**
   * Handle pane click
   */
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [setSelectedNodeId, onNodeSelect]);

  /**
   * Handle node click
   */
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [setSelectedNodeId, onNodeSelect]);

  /**
   * Handle drag over
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop
   */
  const onDrop = useCallback((event, reactFlowInstance) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('application/reactflow');

    if (!data) return;

    const { nodeType, defaultData } = JSON.parse(data);

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${nodeType}_${Date.now()}`,
      type: nodeType,
      position,
      data: defaultData,
    };

    // For group nodes, set additional properties
    if (nodeType === 'group') {
      newNode.style = {
        width: defaultData.width || 400,
        height: defaultData.height || 300,
        zIndex: -1,
      };
    }

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return {
    onConnect,
    onNodeDragStop,
    onNodesDelete,
    addNodeToGroup,
    removeNodeFromGroup,
    onPaneClick,
    onNodeClick,
    onDragOver,
    onDrop
  };
}
