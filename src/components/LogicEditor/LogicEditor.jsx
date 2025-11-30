import React, { useState, useRef, useCallback, useContext, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  ReactFlowProvider,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/logic-editor.css';
import '../../styles/custom-nodes.css'; // Import for generic node styling

import { nodeTypes, EVENT_TYPES, ACTION_TYPES } from './CustomNodes';
import { GameDataContext } from '../Editor/GameDataContext'; // Global game data context
import { generateCodePreview } from '../../utils/codePreviewGenerator';

const getId = (type) => `${type}_${Date.now()}`;

const defaultEdgeOptions = {
  style: { stroke: 'var(--text-tertiary)', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'var(--text-tertiary)',
  },
};

function LogicEditorInner({
  exposeSetNodes,
  exposeUpdateNodeData,
  exposeOnSave,
  onNodeSelect,
  gameData,
  onGameDataChange,
}) {
  const reactFlowInstance = useReactFlow();

  const initialNodes = gameData.logic?.nodes || [
    { id: getId('event'), type: 'event', position: { x: 250, y: 50 }, data: { eventType: 'onGameStart' } },
  ];
  const initialEdges = gameData.logic?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null); // Internal state for selected node
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'unsaved', 'saving'
  const [showCodePreview, setShowCodePreview] = useState(false); // Code preview toggle
  const saveTimeoutRef = useRef(null);

  // Function to update a node's data (e.g., dropdown selection, input change)
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

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

  const onNodeDragStop = useCallback((event, node) => {
    // Update node position in state after drag ends
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
    );
  }, [setNodes]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) => nds.filter((node) => !deleted.includes(node)));
      setEdges((eds) => eds.filter((edge) => !deleted.some((node) => node.id === edge.source || node.id === edge.target)));
      setSelectedNodeId(null); // Clear selection after deletion
    },
    [setNodes, setEdges, setSelectedNodeId]
  );

  const onSave = useCallback(() => {
    onGameDataChange({
      ...gameData,
      logic: { nodes, edges }
    });
    console.log('Logic saved:', { nodes, edges });
  }, [nodes, edges, gameData, onGameDataChange]);

  // Auto-save logic when nodes or edges change (5 second debounce)
  useEffect(() => {
    const currentLogic = gameData.logic || { nodes: [], edges: [] };
    const hasChanges = JSON.stringify(currentLogic.nodes) !== JSON.stringify(nodes) ||
                       JSON.stringify(currentLogic.edges) !== JSON.stringify(edges);

    if (hasChanges) {
      setSaveStatus('unsaved');

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save after 5 seconds
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saving');
        onGameDataChange({
          ...gameData,
          logic: { nodes, edges }
        });

        // Show saved status briefly
        setTimeout(() => {
          setSaveStatus('saved');
        }, 500);
      }, 5000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, gameData, onGameDataChange]);
  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [setSelectedNodeId, onNodeSelect]);

  // Update selected node in parent when nodes change
  useEffect(() => {
    if (selectedNodeId && onNodeSelect) {
      const updatedNode = nodes.find(n => n.id === selectedNodeId);
      if (updatedNode) {
        onNodeSelect(updatedNode);
      }
    }
  }, [nodes, selectedNodeId, onNodeSelect]);

  // Helper function to add selected node to a group
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

  // Helper function to remove node from group
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

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null); // Clear selection when clicking on pane
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [setSelectedNodeId, onNodeSelect]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('application/reactflow');

    if (!data) return;

    const { nodeType, defaultData } = JSON.parse(data);

    // Use ReactFlow's project method to convert screen coordinates to flow coordinates
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
        zIndex: -1, // Groups should be in background
      };
    }

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  // Expose internal state and functions to parent via refs/props
  useEffect(() => {
    if (exposeSetNodes) exposeSetNodes.current = setNodes;
    if (exposeUpdateNodeData) exposeUpdateNodeData.current = updateNodeData;
    if (exposeOnSave) exposeOnSave.current = onSave;
  }, [exposeSetNodes, exposeUpdateNodeData, exposeOnSave, updateNodeData, onSave]);

  // Sync local state with gameData.logic when gameData changes (e.g., on load)
  useEffect(() => {
    if (gameData.logic?.nodes) {
      setNodes(gameData.logic.nodes);
    }
    if (gameData.logic?.edges) {
      setEdges(gameData.logic.edges);
    }
  }, [gameData.logic, setNodes, setEdges]);

  // Extend nodeTypes to inject updateNodeData prop
  const nodeTypesWithUpdate = useMemo(() => {
    const types = {};
    for (const type in nodeTypes) {
      types[type] = (nodeProps) =>
        React.createElement(nodeTypes[type], { ...nodeProps, updateNodeData });
    }
    return types;
  }, [updateNodeData]);

  // Generate code preview
  const codePreview = useMemo(() => {
    return generateCodePreview(nodes, edges, gameData);
  }, [nodes, edges, gameData]);

  return (
    <div
      className="logic-editor-wrapper"
      style={{ background: '#1a1a1a', width: '100%', height: '100%', position: 'relative' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Save Status Indicator */}
      <div className="save-status-indicator" data-status={saveStatus}>
        <div className="save-status-dot"></div>
        <span className="save-status-text">
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'unsaved' && 'Unsaved changes'}
          {saveStatus === 'saving' && 'Saving...'}
        </span>
      </div>

      {/* Code Preview Toggle Button */}
      <button
        className="code-preview-toggle"
        onClick={() => setShowCodePreview(!showCodePreview)}
        title="Toggle code preview"
      >
        {showCodePreview ? '📊 Hide Code' : '💻 Show Code'}
      </button>

      {/* Code Preview Panel */}
      {showCodePreview && (
        <div className="code-preview-panel">
          <div className="code-preview-header">
            <h3>Code Preview</h3>
            <button
              className="code-preview-close"
              onClick={() => setShowCodePreview(false)}
              title="Close preview"
            >
              ✕
            </button>
          </div>
          <pre className="code-preview-content">
            <code dangerouslySetInnerHTML={{ __html: codePreview }} />
          </pre>
        </div>
      )}

      {/* Node Actions for Selected Node */}
      {selectedNodeId && (() => {
        const selectedNode = nodes.find(n => n.id === selectedNodeId);
        const groupNodes = nodes.filter(n => n.type === 'group');
        const isInGroup = selectedNode?.parentNode;

        return (
          <div className="node-actions-panel">
            <button
              className="node-delete-button"
              onClick={() => {
                setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
                setSelectedNodeId(null);
                if (onNodeSelect) {
                  onNodeSelect(null);
                }
              }}
              title="Delete node (or press Delete key)"
            >
              <span className="delete-icon">🗑️</span>
              Delete
            </button>

            {/* Add to Group or Remove from Group */}
            {selectedNode?.type !== 'group' && (
              <>
                {isInGroup ? (
                  <button
                    className="node-action-button remove-from-group"
                    onClick={() => removeNodeFromGroup(selectedNodeId)}
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
                          addNodeToGroup(selectedNodeId, e.target.value);
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
      })()}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypesWithUpdate}
        noDragClassName="nodrag"
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={defaultEdgeOptions}
        nodeExtent={undefined}
        elevateNodesOnSelect={true}
        selectNodesOnDrag={false}
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}

function LogicEditor(props) {
  const { gameData, onGameDataChange } = useContext(GameDataContext);

  return (
    <ReactFlowProvider>
      <LogicEditorInner {...props} gameData={gameData} onGameDataChange={onGameDataChange} />
    </ReactFlowProvider>
  );
}

export default LogicEditor;
