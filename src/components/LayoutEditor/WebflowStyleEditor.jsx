import { useState, useCallback, useRef } from 'react';
import { BlockLibrary } from './BlockLibrary';
import { BlockProperties } from './BlockProperties';
import '../../styles/webflow-editor.css';

export function LayoutEditor({ gameData, onLayoutChange }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const canvasRef = useRef(null);

  const selectedBlock = gameData.layout.blocks.find(b => b.id === selectedBlockId);

  const handleBlockClick = useCallback((e, blockId) => {
    e.stopPropagation();
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockUpdate = useCallback((blockId, updates) => {
    const updatedBlocks = gameData.layout.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
  }, [gameData.layout, onLayoutChange]);

  const handleBlockAdd = useCallback((blockType, parentId = null) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      parentId: parentId,
      order: gameData.layout.blocks.filter(b => b.parentId === parentId).length,
      style: getDefaultStyleForType(blockType)
    };
    onLayoutChange({
      ...gameData.layout,
      blocks: [...gameData.layout.blocks, newBlock]
    });
    setSelectedBlockId(newBlock.id);
  }, [gameData.layout, onLayoutChange]);

  const handleBlockDelete = useCallback((blockId) => {
    if (!confirm('Delete this block and all its children?')) return;

    // Delete block and all children recursively
    const toDelete = [blockId];
    const findChildren = (id) => {
      gameData.layout.blocks.forEach(b => {
        if (b.parentId === id) {
          toDelete.push(b.id);
          findChildren(b.id);
        }
      });
    };
    findChildren(blockId);

    const updatedBlocks = gameData.layout.blocks.filter(b => !toDelete.includes(b.id));
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    setSelectedBlockId(null);
  }, [gameData.layout, onLayoutChange]);

  const handleTemplateChange = useCallback((template) => {
    const templateBlocks = getTemplateBlocks(template);
    onLayoutChange({ template, blocks: templateBlocks });
    setSelectedBlockId(null);
  }, [onLayoutChange]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setSelectedBlockId(null);
    }
  }, []);

  const renderBlock = (block) => {
    const children = gameData.layout.blocks
      .filter(b => b.parentId === block.id)
      .sort((a, b) => a.order - b.order);

    const isSelected = selectedBlockId === block.id;
    const isHovered = hoveredBlockId === block.id && !isSelected;

    return (
      <div
        key={block.id}
        data-block-id={block.id}
        className={`webflow-block ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
        style={block.style}
        onClick={(e) => handleBlockClick(e, block.id)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHoveredBlockId(block.id);
        }}
        onMouseLeave={() => setHoveredBlockId(null)}
      >
        {/* Block Label & Controls */}
        <div className="block-label">
          <span className="block-type">{getBlockIcon(block.type)} {getBlockName(block.type)}</span>
          <div className="block-controls">
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBlockDelete(block.id);
              }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Block Content */}
        <div className="block-content">
          {renderBlockContent(block, gameData)}

          {/* Render Children */}
          {children.map(child => renderBlock(child))}

          {/* Add Block Button */}
          {(block.type === 'container' || children.length === 0) && (
            <button
              className="add-block-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBlockAdd('container', block.id);
              }}
            >
              + Add Block
            </button>
          )}
        </div>
      </div>
    );
  };

  const rootBlocks = gameData.layout.blocks
    .filter(b => !b.parentId)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="webflow-editor">
      {/* Left Sidebar - Navigator & Add */}
      <div className="webflow-sidebar webflow-sidebar-left">
        <div className="sidebar-tabs">
          <button className="sidebar-tab active">Navigator</button>
          <button className="sidebar-tab">Add</button>
        </div>

        <BlockLibrary
          onBlockAdd={handleBlockAdd}
          currentTemplate={gameData.layout.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>

      {/* Center Canvas */}
      <div className="webflow-canvas-container">
        <div className="canvas-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-btn active">Desktop</button>
            <button className="toolbar-btn">Tablet</button>
            <button className="toolbar-btn">Mobile</button>
          </div>
          <div className="toolbar-center">
            <span className="canvas-title">Canvas</span>
          </div>
          <div className="toolbar-right">
            <button className="toolbar-btn">Preview</button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="webflow-canvas"
          onClick={handleCanvasClick}
        >
          <div className="canvas-frame">
            {rootBlocks.map(block => renderBlock(block))}

            {rootBlocks.length === 0 && (
              <div className="canvas-empty">
                <h3>Start Building</h3>
                <p>Choose a template or add blocks from the left sidebar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="webflow-sidebar webflow-sidebar-right">
        {selectedBlock ? (
          <BlockProperties
            block={selectedBlock}
            onUpdate={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
            onClose={() => setSelectedBlockId(null)}
          />
        ) : (
          <div className="no-selection">
            <p>Select an element to edit its properties</p>
          </div>
        )}
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

function renderBlockContent(block, gameData) {
  switch (block.type) {
    case 'header':
      return (
        <div className="block-preview">
          <h1 className="preview-title">{gameData.meta.title}</h1>
          {gameData.meta.author && <p className="preview-subtitle">by {gameData.meta.author}</p>}
        </div>
      );

    case 'resources':
      return (
        <div className="block-preview resources-preview">
          {gameData.resources.slice(0, 2).map(resource => (
            <div key={resource.id} className="preview-resource">
              <span className="preview-icon">{resource.icon}</span>
              <div>
                <div className="preview-name">{resource.name}</div>
                <div className="preview-value">0 / sec</div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'click':
      const clickResource = gameData.resources.find(r => r.clickable);
      return (
        <div className="block-preview click-preview">
          {clickResource && (
            <>
              <div className="preview-click-button">{clickResource.icon}</div>
              <div className="preview-text">Click to gain {clickResource.name}</div>
            </>
          )}
        </div>
      );

    case 'buildings':
      return (
        <div className="block-preview buildings-preview">
          {gameData.buildings.slice(0, 3).map(building => (
            <div key={building.id} className="preview-card">
              <span className="preview-icon">{building.icon}</span>
              <span className="preview-name">{building.name}</span>
            </div>
          ))}
        </div>
      );

    case 'tabs':
      return (
        <div className="block-preview tabs-preview">
          <div className="preview-tabs">
            <span className="preview-tab active">Buildings</span>
            <span className="preview-tab">Upgrades</span>
            <span className="preview-tab">Achievements</span>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="block-preview stats-preview">
          <div className="preview-stat">
            <div className="stat-value">0</div>
            <div className="stat-label">Clicks</div>
          </div>
          <div className="preview-stat">
            <div className="stat-value">0</div>
            <div className="stat-label">Buildings</div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function getDefaultStyleForType(type) {
  const defaults = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      minHeight: '100px'
    },
    header: {
      padding: '1.5rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    },
    resources: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    },
    click: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      minHeight: '200px'
    },
    buildings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    },
    tabs: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    }
  };
  return defaults[type] || defaults.container;
}

function getTemplateBlocks(template) {
  // Same as before - Classic, Dashboard, Minimalist templates
  const templates = {
    classic: [
      {
        id: 'root',
        type: 'container',
        order: 0,
        style: {
          display: 'grid',
          gridTemplateColumns: '250px 1fr 300px',
          gap: '1rem',
          padding: '1rem',
          minHeight: '100vh',
          backgroundColor: '#000000'
        }
      }
    ],
    dashboard: [],
    minimalist: []
  };
  return templates[template] || templates.classic;
}
