import { useState, useCallback } from 'react';
import { BlockLibrary } from './BlockLibrary';
import { BlockProperties } from './BlockProperties';
import GamePlayer from '../Player/GamePlayer';
import '../../styles/layout-editor.css';

export function LayoutEditor({ gameData, onLayoutChange }) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  const handleBlockSelect = useCallback((blockId) => {
    const block = gameData.layout.blocks.find(b => b.id === blockId);
    setSelectedBlock(block);
    setIsEditMode(true);
  }, [gameData.layout.blocks]);

  const handleBlockUpdate = useCallback((blockId, updates) => {
    const updatedBlocks = gameData.layout.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
  }, [gameData.layout, onLayoutChange]);

  const handleBlockAdd = useCallback((blockType) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      order: gameData.layout.blocks.length,
      style: getDefaultStyleForType(blockType)
    };
    onLayoutChange({
      ...gameData.layout,
      blocks: [...gameData.layout.blocks, newBlock]
    });
  }, [gameData.layout, onLayoutChange]);

  const handleBlockDelete = useCallback((blockId) => {
    const updatedBlocks = gameData.layout.blocks.filter(b => b.id !== blockId);
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [gameData.layout, onLayoutChange, selectedBlock]);

  const handleTemplateChange = useCallback((template) => {
    const templateBlocks = getTemplateBlocks(template);
    onLayoutChange({ template, blocks: templateBlocks });
    setSelectedBlock(null);
  }, [onLayoutChange]);

  return (
    <div className={`layout-editor-v2 ${selectedBlock && isEditMode ? 'has-properties' : ''}`}>
      {/* Left Sidebar - Block Library */}
      <div className="layout-sidebar layout-sidebar-left">
        <BlockLibrary
          onBlockAdd={handleBlockAdd}
          currentTemplate={gameData.layout.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>

      {/* Center - 1:1 Game Preview */}
      <div className="layout-preview-container">
        <div className="preview-header">
          <h3>Live Preview</h3>
          <div className="preview-controls">
            <button
              className={`preview-mode-btn ${isEditMode ? 'active' : ''}`}
              onClick={() => setIsEditMode(true)}
            >
              Edit Mode
            </button>
            <button
              className={`preview-mode-btn ${!isEditMode ? 'active' : ''}`}
              onClick={() => setIsEditMode(false)}
            >
              Play Mode
            </button>
          </div>
        </div>

        <div className="preview-content" style={{ position: 'relative' }}>
          {/* Render actual GamePlayer for 1:1 preview */}
          <GamePlayer gameData={gameData} />

          {/* Overlay for edit mode - allows selecting blocks */}
          {isEditMode && (
            <div className="edit-overlay">
              <div className="overlay-info">
                Click on elements to edit their layout properties
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Block Properties */}
      {selectedBlock && isEditMode && (
        <div className="layout-sidebar layout-sidebar-right">
          <BlockProperties
            block={selectedBlock}
            onUpdate={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
            onClose={() => setSelectedBlock(null)}
          />
        </div>
      )}
    </div>
  );
}

function getDefaultStyleForType(type) {
  const defaults = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
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
      borderRadius: '8px'
    },
    buildings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px'
    }
  };
  return defaults[type] || defaults.container;
}

function getTemplateBlocks(template) {
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
      },
      {
        id: 'left-sidebar',
        type: 'resources',
        parentId: 'root',
        order: 0,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      },
      {
        id: 'center',
        type: 'click',
        parentId: 'root',
        order: 1,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      },
      {
        id: 'right-sidebar',
        type: 'tabs',
        parentId: 'root',
        order: 2,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      }
    ],
    dashboard: [
      {
        id: 'root',
        type: 'container',
        order: 0,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto 1fr auto',
          gap: '1rem',
          padding: '1rem',
          minHeight: '100vh',
          backgroundColor: '#000000'
        }
      },
      {
        id: 'header',
        type: 'header',
        parentId: 'root',
        order: 0,
        style: {
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      },
      {
        id: 'click-area',
        type: 'click',
        parentId: 'root',
        order: 1,
        style: {
          gridColumn: '1 / 7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      },
      {
        id: 'stats',
        type: 'stats',
        parentId: 'root',
        order: 2,
        style: {
          gridColumn: '7 / -1',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      },
      {
        id: 'buildings',
        type: 'buildings',
        parentId: 'root',
        order: 3,
        style: {
          gridColumn: '1 / -1',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }
      }
    ],
    minimalist: [
      {
        id: 'root',
        type: 'container',
        order: 0,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          minHeight: '100vh',
          backgroundColor: '#000000',
          maxWidth: '600px',
          margin: '0 auto'
        }
      },
      {
        id: 'resources',
        type: 'resources',
        parentId: 'root',
        order: 0,
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: '2rem',
          padding: '1.5rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          width: '100%'
        }
      },
      {
        id: 'click',
        type: 'click',
        parentId: 'root',
        order: 1,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          width: '100%'
        }
      },
      {
        id: 'buildings',
        type: 'buildings',
        parentId: 'root',
        order: 2,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          width: '100%'
        }
      }
    ]
  };
  return templates[template] || templates.classic;
}
