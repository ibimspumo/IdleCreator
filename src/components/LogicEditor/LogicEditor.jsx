import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/logic-editor.css';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Can you drag me?' } },
];

function LogicEditor() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState([]);

  return (
    <div className="logic-editor-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default LogicEditor;
