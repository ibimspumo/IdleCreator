import { RenderIcon } from '../Editor/shared/RenderIcon';

export function LayoutCanvas({
  layout,
  gameData,
  selectedBlock,
  onBlockSelect,
  onBlockMove,
  onBlockDelete
}) {
  const rootBlocks = layout.blocks.filter(b => !b.parentId).sort((a, b) => a.order - b.order);

  const renderBlock = (block, depth = 0) => {
    const children = layout.blocks
      .filter(b => b.parentId === block.id)
      .sort((a, b) => a.order - b.order);

    const isSelected = selectedBlock?.id === block.id;

    return (
      <div
        key={block.id}
        className={`canvas-block ${isSelected ? 'selected' : ''}`}
        style={{
          ...block.style,
          position: 'relative',
          minHeight: children.length > 0 ? 'auto' : '100px'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onBlockSelect(block.id);
        }}
      >
        {/* Block Controls */}
        <div className="block-controls">
          <span className="block-label">
            {getBlockIcon(block.type)} {getBlockName(block.type)}
          </span>
          <div className="block-actions">
            <button
              className="block-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBlockMove(block.id, 'up');
              }}
              title="Move Up"
            >
              ↑
            </button>
            <button
              className="block-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBlockMove(block.id, 'down');
              }}
              title="Move Down"
            >
              ↓
            </button>
            <button
              className="block-action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this block?')) {
                  onBlockDelete(block.id);
                }
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>

        {/* Block Content Preview */}
        <div className="block-content-preview">
          {renderBlockPreview(block, gameData)}
        </div>

        {/* Render Children */}
        {children.length > 0 && (
          <div className="block-children" style={{ display: 'contents' }}>
            {children.map(child => renderBlock(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="layout-canvas">
      <div className="canvas-header">
        <h3>Layout Preview</h3>
        <span className="canvas-hint">Click blocks to edit properties</span>
      </div>
      <div className="canvas-content">
        {rootBlocks.map(block => renderBlock(block))}
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
    tabs: 'Tabs',
    stats: 'Stats'
  };
  return names[type] || 'Block';
}

function renderBlockPreview(block, gameData) {
  switch (block.type) {
    case 'header':
      return (
        <div style={{ opacity: 0.6, fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{gameData.meta.title}</div>
          {gameData.meta.author && <div>{gameData.meta.author}</div>}
        </div>
      );

    case 'resources':
      return (
        <div style={{ opacity: 0.6, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {gameData.resources.slice(0, 3).map(resource => (
            <div key={resource.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{resource.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>{resource.name}</div>
                <div>0 / sec</div>
              </div>
            </div>
          ))}
          {gameData.resources.length > 3 && <div>+ {gameData.resources.length - 3} more...</div>}
        </div>
      );

    case 'click':
      const clickResource = gameData.resources.find(r => r.clickable);
      return (
        <div style={{ opacity: 0.6, textAlign: 'center' }}>
          {clickResource && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {clickResource.icon}
              </div>
              <div style={{ fontSize: '0.875rem' }}>Click to gain {clickResource.name}</div>
            </>
          )}
        </div>
      );

    case 'buildings':
      return (
        <div style={{ opacity: 0.6, fontSize: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
          {gameData.buildings.slice(0, 4).map(building => (
            <div key={building.id} style={{ padding: '0.5rem', border: '1px solid #333', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{building.icon}</div>
              <div style={{ fontSize: '0.75rem' }}>{building.name}</div>
            </div>
          ))}
          {gameData.buildings.length > 4 && (
            <div style={{ padding: '0.5rem', border: '1px dashed #333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              +{gameData.buildings.length - 4}
            </div>
          )}
        </div>
      );

    case 'tabs':
      return (
        <div style={{ opacity: 0.6, fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
            <div style={{ padding: '0.25rem 0.5rem', backgroundColor: '#333', borderRadius: '4px' }}>Buildings</div>
            <div style={{ padding: '0.25rem 0.5rem' }}>Upgrades</div>
            <div style={{ padding: '0.25rem 0.5rem' }}>Achievements</div>
          </div>
          <div>Tabbed content will appear here...</div>
        </div>
      );

    case 'stats':
      return (
        <div style={{ opacity: 0.6, fontSize: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#111', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>0</div>
            <div>Total Clicks</div>
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: '#111', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>0</div>
            <div>Buildings</div>
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: '#111', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>0</div>
            <div>Upgrades</div>
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: '#111', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>0/10</div>
            <div>Achievements</div>
          </div>
        </div>
      );

    case 'container':
      return (
        <div style={{ opacity: 0.4, fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
          Empty container - Add child blocks
        </div>
      );

    default:
      return null;
  }
}
