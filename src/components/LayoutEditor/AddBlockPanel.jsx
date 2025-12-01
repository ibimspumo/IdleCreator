export function AddBlockPanel({ onBlockAdd }) {
  const blockTypes = [
    { type: 'container', name: 'Container', icon: '📦', description: 'Empty flex/grid container' },
    { type: 'header', name: 'Header', icon: '🏷️', description: 'Game title and info' },
    { type: 'resources', name: 'Resources', icon: '💎', description: 'Resource display panel' },
    { type: 'click', name: 'Click Area', icon: '👆', description: 'Main click button' },
    { type: 'buildings', name: 'Buildings', icon: '🏠', description: 'Building grid' },
    { type: 'tabs', name: 'Tabs Panel', icon: '📑', description: 'Tabbed content' },
    { type: 'stats', name: 'Stats', icon: '📈', description: 'Statistics dashboard' }
  ];

  return (
    <div className="add-block-panel">
      <div className="panel-section">
        <h3 className="panel-heading">Add Elements</h3>
        <p className="panel-description">Drag or click to add elements to your canvas</p>
      </div>

      <div className="block-type-list">
        {blockTypes.map(block => (
          <button
            key={block.type}
            className="block-type-item"
            onClick={() => onBlockAdd(block.type)}
          >
            <span className="block-type-icon">{block.icon}</span>
            <div className="block-type-info">
              <div className="block-type-name">{block.name}</div>
              <div className="block-type-description">{block.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="panel-section">
        <h4 className="panel-subheading">Tips</h4>
        <ul className="tips-list">
          <li>Click a block to add it to the canvas</li>
          <li>Select blocks to edit their properties</li>
          <li>Use keyboard shortcuts for faster editing</li>
        </ul>
      </div>
    </div>
  );
}
