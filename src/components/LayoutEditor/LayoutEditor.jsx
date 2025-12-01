import { useState, useCallback } from 'react';
import { BlockLibrary } from './BlockLibrary';
import { LayoutCanvas } from './LayoutCanvas';
import { BlockProperties } from './BlockProperties';
import '../../styles/layout-editor.css';

export function LayoutEditor({ gameData, onLayoutChange }) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBlockSelect = useCallback((blockId) => {
    const block = gameData.layout.blocks.find(b => b.id === blockId);
    setSelectedBlock(block);
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

  const handleBlockMove = useCallback((blockId, direction) => {
    const blocks = [...gameData.layout.blocks];
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    blocks.forEach((block, i) => block.order = i);

    onLayoutChange({ ...gameData.layout, blocks });
  }, [gameData.layout, onLayoutChange]);

  const handleTemplateChange = useCallback((template) => {
    const templateBlocks = getTemplateBlocks(template);
    onLayoutChange({ template, blocks: templateBlocks });
  }, [onLayoutChange]);

  return (
    <div className="layout-editor">
      {/* Left Sidebar - Block Library */}
      <div className="layout-sidebar layout-sidebar-left">
        <BlockLibrary
          onBlockAdd={handleBlockAdd}
          currentTemplate={gameData.layout.template}
          onTemplateChange={handleTemplateChange}
        />
      </div>

      {/* Center Canvas - Visual Layout */}
      <div className="layout-canvas-wrapper">
        <LayoutCanvas
          layout={gameData.layout}
          gameData={gameData}
          selectedBlock={selectedBlock}
          onBlockSelect={handleBlockSelect}
          onBlockMove={handleBlockMove}
          onBlockDelete={handleBlockDelete}
        />
      </div>

      {/* Right Sidebar - Block Properties */}
      {selectedBlock && (
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
