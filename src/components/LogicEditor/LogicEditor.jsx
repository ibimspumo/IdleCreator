import React, { useEffect, useMemo, useContext } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/logic-editor.css';
import '../../styles/custom-nodes.css';

import { nodeTypes } from './CustomNodes';
import { GameDataContext } from '../Editor/GameDataContext';

// Import hooks
import { useLogicEditorState } from './hooks/useLogicEditorState';
import { useAutoSave } from './hooks/useAutoSave';
import { useNodeOperations } from './hooks/useNodeOperations';
import { useCodePreview } from './hooks/useCodePreview';

// Import components
import { SaveStatusIndicator } from './components/SaveStatusIndicator';
import { CodePreviewPanel } from './components/CodePreviewPanel';
import { NodeActionsPanel } from './components/NodeActionsPanel';

const getId = (type) => `${type}_${Date.now()}`;

const defaultEdgeOptions = {
  style: { stroke: 'var(--text-tertiary)', strokeWidth: 2 },
  markerEnd: {
    type: 'ArrowClosed',
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

  // Use custom hooks
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    selectedNodeId,
    setSelectedNodeId,
    updateNodeData,
    clearSelection
  } = useLogicEditorState(initialNodes, initialEdges);

  const { saveStatus } = useAutoSave(nodes, edges, gameData, onGameDataChange);

  const {
    onConnect,
    onNodeDragStop,
    onNodesDelete,
    addNodeToGroup,
    removeNodeFromGroup,
    onPaneClick,
    onNodeClick,
    onDragOver,
    onDrop
  } = useNodeOperations(setNodes, setEdges, setSelectedNodeId, onNodeSelect);

  const {
    showCodePreview,
    setShowCodePreview,
    toggleCodePreview,
    codePreview,
    codeMode,
    toggleCodeMode
  } = useCodePreview(nodes, edges, gameData);

  // Update selected node in parent when nodes change
  useEffect(() => {
    if (selectedNodeId && onNodeSelect) {
      const updatedNode = nodes.find(n => n.id === selectedNodeId);
      if (updatedNode) {
        onNodeSelect(updatedNode);
      }
    }
  }, [nodes, selectedNodeId, onNodeSelect]);

  // Expose internal state and functions to parent via refs/props
  useEffect(() => {
    if (exposeSetNodes) exposeSetNodes.current = setNodes;
    if (exposeUpdateNodeData) exposeUpdateNodeData.current = updateNodeData;
    if (exposeOnSave) {
      exposeOnSave.current = () => {
        onGameDataChange({
          ...gameData,
          logic: { nodes, edges }
        });
      };
    }
  }, [exposeSetNodes, exposeUpdateNodeData, exposeOnSave, updateNodeData, nodes, edges, gameData, onGameDataChange]);

  // Sync local state with gameData.logic when gameData changes
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

  // Get selected node and group nodes for NodeActionsPanel
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const groupNodes = nodes.filter(n => n.type === 'group');

  return (
    <div
      className="logic-editor-wrapper"
      style={{ background: '#1a1a1a', width: '100%', height: '100%', position: 'relative' }}
      onDrop={(e) => onDrop(e, reactFlowInstance)}
      onDragOver={onDragOver}
    >
      <SaveStatusIndicator saveStatus={saveStatus} />

      <button
        className="code-preview-toggle"
        onClick={toggleCodePreview}
        title="Toggle code preview"
      >
        {showCodePreview ? '📊 Hide Code' : '💻 Show Code'}
      </button>

      {showCodePreview && (
        <button
          className="code-mode-toggle"
          onClick={toggleCodeMode}
          title="Switch code mode"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '13rem',
            zIndex: 1000,
            padding: '0.625rem 1rem',
            background: codeMode === 'executable' ? '#4a9eff' : 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          {codeMode === 'executable' ? '⚙️ JS Code' : '📖 Readable'}
        </button>
      )}

      {showCodePreview && (
        <CodePreviewPanel
          codePreview={codePreview}
          codeMode={codeMode}
          onClose={() => setShowCodePreview(false)}
        />
      )}

      <NodeActionsPanel
        selectedNode={selectedNode}
        groupNodes={groupNodes}
        onDelete={() => {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
          setSelectedNodeId(null);
          if (onNodeSelect) {
            onNodeSelect(null);
          }
        }}
        onAddToGroup={(groupId) => addNodeToGroup(selectedNodeId, groupId)}
        onRemoveFromGroup={() => removeNodeFromGroup(selectedNodeId)}
      />

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
