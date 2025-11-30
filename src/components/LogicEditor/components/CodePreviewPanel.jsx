import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * CodePreviewPanel - Displays the code preview with syntax highlighting
 */
export function CodePreviewPanel({ codePreview, codeMode = 'readable', onClose }) {
  const isExecutable = codeMode === 'executable';

  return (
    <div className="code-preview-panel">
      <div className="code-preview-header">
        <h3>
          {isExecutable ? '⚙️ Executable JavaScript' : '📖 Human-Readable Code'}
        </h3>
        <button
          className="code-preview-close"
          onClick={onClose}
          title="Close preview"
        >
          ✕
        </button>
      </div>
      <div className="code-preview-content">
        {isExecutable ? (
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '13px',
              maxHeight: '600px'
            }}
          >
            {codePreview}
          </SyntaxHighlighter>
        ) : (
          <pre style={{ fontSize: '14px', margin: 0 }}>
            <code dangerouslySetInnerHTML={{ __html: codePreview }} />
          </pre>
        )}
      </div>
      {isExecutable && (
        <div style={{
          padding: '10px',
          backgroundColor: '#1e1e1e',
          borderTop: '1px solid #333',
          fontSize: '12px',
          color: '#888'
        }}>
          💡 This is the actual JavaScript code that runs in the game engine
        </div>
      )}
    </div>
  );
}
