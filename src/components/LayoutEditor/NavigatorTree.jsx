export function NavigatorTree({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockDelete,
  onBlockDuplicate,
  onTemplateChange,
  currentTemplate
}) {
  const renderTreeNode = (block, level = 0) => {
    const children = blocks
      .filter(b => b.parentId === block.id)
      .sort((a, b) => a.order - b.order);

    const isSelected = selectedBlockId === block.id;

    return (
      <div key={block.id} className="tree-node" style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`tree-node-content ${isSelected ? 'selected' : ''}`}
          onClick={() => onBlockSelect(block.id)}
        >
          <span className="tree-node-icon">{getBlockIcon(block.type)}</span>
          <span className="tree-node-label">{getBlockName(block.type)}</span>
          <div className="tree-node-actions">
            <button
              className="tree-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBlockDuplicate(block);
              }}
              title="Duplicate"
            >
              📋
            </button>
            <button
              className="tree-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this block?')) {
                  onBlockDelete(block.id);
                }
              }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
        {children.length > 0 && (
          <div className="tree-children">
            {children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootBlocks = blocks.filter(b => !b.parentId).sort((a, b) => a.order - b.order);

  const templates = [
    { id: 'classic', name: '3-Column Classic', icon: '📱' },
    { id: 'dashboard', name: 'Dashboard Grid', icon: '📊' },
    { id: 'minimalist', name: 'Minimalist', icon: '✨' }
  ];

  return (
    <div className="navigator-tree">
      <div className="navigator-section">
        <h3 className="navigator-heading">Templates</h3>
        <div className="template-list">
          {templates.map(template => (
            <button
              key={template.id}
              className={`template-item ${currentTemplate === template.id ? 'active' : ''}`}
              onClick={() => onTemplateChange(template.id)}
            >
              <span className="template-icon">{template.icon}</span>
              <span className="template-name">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="navigator-section">
        <h3 className="navigator-heading">Structure</h3>
        <div className="tree-list">
          {rootBlocks.map(block => renderTreeNode(block))}
          {rootBlocks.length === 0 && (
            <div className="tree-empty">
              <p>No blocks yet. Add blocks from the "Add" tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getBlockIcon(type) {
  const icons = {
    container: '📦',
    header: '🏷️',
    resources: '💎',
    click: '👆',
    buildings: '🏠',
    tabs: '📑',
    stats: '📈'
  };
  return icons[type] || '📦';
}

function getBlockName(type) {
  const names = {
    container: 'Container',
    header: 'Header',
    resources: 'Resources',
    click: 'Click Area',
    buildings: 'Buildings',
    tabs: 'Tabs Panel',
    stats: 'Stats'
  };
  return names[type] || 'Block';
}
