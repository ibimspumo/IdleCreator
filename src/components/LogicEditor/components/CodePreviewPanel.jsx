import React from 'react';

/**
 * CodePreviewPanel - Displays the code preview with syntax highlighting
 */
export function CodePreviewPanel({ codePreview, onClose }) {
  return (
    <div className="code-preview-panel">
      <div className="code-preview-header">
        <h3>Code Preview</h3>
        <button
          className="code-preview-close"
          onClick={onClose}
          title="Close preview"
        >
          ✕
        </button>
      </div>
      <pre className="code-preview-content">
        <code dangerouslySetInnerHTML={{ __html: codePreview }} />
      </pre>
    </div>
  );
}
