export function BlockLibrary({ onBlockAdd, currentTemplate, onTemplateChange }) {
  const templates = [
    { id: 'classic', name: '3-Column Classic', icon: '📱', description: 'Resources | Click | Buildings' },
    { id: 'dashboard', name: 'Dashboard Grid', icon: '📊', description: 'Stats-focused grid layout' },
    { id: 'minimalist', name: 'Minimalist', icon: '✨', description: 'Simple vertical layout' }
  ];

  const blockTypes = [
    { type: 'container', name: 'Container', icon: '📦', description: 'Empty flex/grid container' },
    { type: 'header', name: 'Header', icon: '🏷️', description: 'Game title and info' },
    { type: 'resources', name: 'Resources', icon: '💎', description: 'Resource display panel' },
    { type: 'click', name: 'Click Area', icon: '👆', description: 'Main click button' },
    { type: 'buildings', name: 'Buildings', icon: '🏠', description: 'Building grid' },
    { type: 'tabs', name: 'Tabs Panel', icon: '📑', description: 'Tabbed content (Buildings/Upgrades/Achievements)' },
    { type: 'stats', name: 'Stats', icon: '📈', description: 'Statistics dashboard' }
  ];

  return (
    <div className="block-library">
      <div className="library-header">
        <h2>Layout Builder</h2>
      </div>

      {/* Templates Section */}
      <div className="library-section">
        <h3>Templates</h3>
        <div className="template-grid">
          {templates.map(template => (
            <button
              key={template.id}
              className={`template-card ${currentTemplate === template.id ? 'active' : ''}`}
              onClick={() => onTemplateChange(template.id)}
              title={template.description}
            >
              <span className="template-icon">{template.icon}</span>
              <span className="template-name">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Block Types Section */}
      <div className="library-section">
        <h3>Add Blocks</h3>
        <div className="block-type-list">
          {blockTypes.map(block => (
            <button
              key={block.type}
              className="block-type-item"
              onClick={() => onBlockAdd(block.type)}
              title={block.description}
            >
              <span className="block-icon">{block.icon}</span>
              <div className="block-info">
                <div className="block-name">{block.name}</div>
                <div className="block-description">{block.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="library-section">
        <div className="instructions">
          <h4>How to use:</h4>
          <ol>
            <li>Select a template or add blocks</li>
            <li>Click a block to edit its properties</li>
            <li>Use arrows to reorder blocks</li>
            <li>Customize styles in the right panel</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
