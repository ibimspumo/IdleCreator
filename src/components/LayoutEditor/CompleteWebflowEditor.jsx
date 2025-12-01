import { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavigatorTree } from './NavigatorTree';
import { AddBlockPanel } from './AddBlockPanel';
import { WebflowPropertiesPanel } from './WebflowPropertiesPanel';
import '../../styles/complete-webflow.css';

export function LayoutEditor({ gameData, onLayoutChange }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [leftPanelTab, setLeftPanelTab] = useState('navigator'); // 'navigator' or 'add'
  const [breakpoint, setBreakpoint] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [history, setHistory] = useState([gameData.layout.blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [clipboard, setClipboard] = useState(null);
  const canvasRef = useRef(null);

  const selectedBlock = gameData.layout.blocks.find(b => b.id === selectedBlockId);

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Save to history
  const saveToHistory = useCallback((blocks) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(blocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onLayoutChange({ ...gameData.layout, blocks: history[historyIndex - 1] });
    }
  }, [historyIndex, history, gameData.layout, onLayoutChange]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onLayoutChange({ ...gameData.layout, blocks: history[historyIndex + 1] });
    }
  }, [historyIndex, history, gameData.layout, onLayoutChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Cmd/Ctrl + Shift + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
      // Copy: Cmd/Ctrl + C
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && selectedBlockId) {
        e.preventDefault();
        const block = gameData.layout.blocks.find(b => b.id === selectedBlockId);
        setClipboard(block);
      }
      // Paste: Cmd/Ctrl + V
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard) {
        e.preventDefault();
        handleDuplicateBlock(clipboard);
      }
      // Delete: Backspace/Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedBlockId) {
        e.preventDefault();
        handleBlockDelete(selectedBlockId);
      }
      // Deselect: Escape
      if (e.key === 'Escape') {
        setSelectedBlockId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, clipboard, handleUndo, handleRedo, gameData.layout.blocks]);

  const handleBlockClick = useCallback((e, blockId) => {
    e.stopPropagation();
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockUpdate = useCallback((blockId, updates) => {
    const updatedBlocks = gameData.layout.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    saveToHistory(updatedBlocks);
  }, [gameData.layout, onLayoutChange, saveToHistory]);

  const handleBlockAdd = useCallback((blockType, parentId = null) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      parentId: parentId,
      order: gameData.layout.blocks.filter(b => b.parentId === parentId).length,
      style: getDefaultStyleForType(blockType)
    };
    const updatedBlocks = [...gameData.layout.blocks, newBlock];
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    saveToHistory(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  }, [gameData.layout, onLayoutChange, saveToHistory]);

  const handleBlockDelete = useCallback((blockId) => {
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
    saveToHistory(updatedBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [gameData.layout, onLayoutChange, saveToHistory, selectedBlockId]);

  const handleDuplicateBlock = useCallback((block) => {
    const newBlock = {
      ...block,
      id: `block_${Date.now()}`,
      order: gameData.layout.blocks.filter(b => b.parentId === block.parentId).length
    };
    const updatedBlocks = [...gameData.layout.blocks, newBlock];
    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    saveToHistory(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  }, [gameData.layout, onLayoutChange, saveToHistory]);

  const handleBlockMove = useCallback((blockId, direction) => {
    const block = gameData.layout.blocks.find(b => b.id === blockId);
    const siblings = gameData.layout.blocks
      .filter(b => b.parentId === block.parentId)
      .sort((a, b) => a.order - b.order);

    const currentIndex = siblings.findIndex(b => b.id === blockId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= siblings.length) return;

    const updatedBlocks = gameData.layout.blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, order: siblings[newIndex].order };
      }
      if (b.id === siblings[newIndex].id) {
        return { ...b, order: siblings[currentIndex].order };
      }
      return b;
    });

    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    saveToHistory(updatedBlocks);
  }, [gameData.layout, onLayoutChange, saveToHistory]);

  const handleTemplateChange = useCallback((template) => {
    const templateBlocks = getTemplateBlocks(template);
    onLayoutChange({ template, blocks: templateBlocks });
    saveToHistory(templateBlocks);
    setSelectedBlockId(null);
  }, [onLayoutChange, saveToHistory]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-frame')) {
      setSelectedBlockId(null);
    }
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = gameData.layout.blocks.findIndex(b => b.id === active.id);
    const newIndex = gameData.layout.blocks.findIndex(b => b.id === over.id);

    const updatedBlocks = [...gameData.layout.blocks];
    const [movedBlock] = updatedBlocks.splice(oldIndex, 1);
    updatedBlocks.splice(newIndex, 0, movedBlock);

    // Update orders
    const parentId = movedBlock.parentId;
    updatedBlocks
      .filter(b => b.parentId === parentId)
      .forEach((block, index) => {
        block.order = index;
      });

    onLayoutChange({ ...gameData.layout, blocks: updatedBlocks });
    saveToHistory(updatedBlocks);
  };

  const getBreakpointStyle = () => {
    switch (breakpoint) {
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      default:
        return {};
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="complete-webflow-editor">
        {/* Left Sidebar */}
        <div className="webflow-sidebar webflow-sidebar-left">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${leftPanelTab === 'navigator' ? 'active' : ''}`}
              onClick={() => setLeftPanelTab('navigator')}
            >
              Navigator
            </button>
            <button
              className={`sidebar-tab ${leftPanelTab === 'add' ? 'active' : ''}`}
              onClick={() => setLeftPanelTab('add')}
            >
              Add
            </button>
          </div>

          <div className="sidebar-content">
            {leftPanelTab === 'navigator' ? (
              <NavigatorTree
                blocks={gameData.layout.blocks}
                selectedBlockId={selectedBlockId}
                onBlockSelect={setSelectedBlockId}
                onBlockDelete={handleBlockDelete}
                onBlockDuplicate={handleDuplicateBlock}
                onTemplateChange={handleTemplateChange}
                currentTemplate={gameData.layout.template}
              />
            ) : (
              <AddBlockPanel onBlockAdd={handleBlockAdd} />
            )}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="webflow-canvas-container">
          <div className="canvas-toolbar">
            <div className="toolbar-left">
              <button
                className={`toolbar-btn ${breakpoint === 'desktop' ? 'active' : ''}`}
                onClick={() => setBreakpoint('desktop')}
                title="Desktop View"
              >
                🖥️
              </button>
              <button
                className={`toolbar-btn ${breakpoint === 'tablet' ? 'active' : ''}`}
                onClick={() => setBreakpoint('tablet')}
                title="Tablet View"
              >
                📱
              </button>
              <button
                className={`toolbar-btn ${breakpoint === 'mobile' ? 'active' : ''}`}
                onClick={() => setBreakpoint('mobile')}
                title="Mobile View"
              >
                📱
              </button>
            </div>

            <div className="toolbar-center">
              <span className="canvas-title">Canvas - {breakpoint}</span>
            </div>

            <div className="toolbar-right">
              <button
                className="toolbar-btn"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo (Cmd/Ctrl+Z)"
              >
                ↶
              </button>
              <button
                className="toolbar-btn"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="Redo (Cmd/Ctrl+Shift+Z)"
              >
                ↷
              </button>
            </div>
          </div>

          <div
            ref={canvasRef}
            className="webflow-canvas"
            onClick={handleCanvasClick}
          >
            <div className="canvas-frame" style={getBreakpointStyle()}>
              <SortableContext
                items={gameData.layout.blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {gameData.layout.blocks
                  .filter(b => !b.parentId)
                  .sort((a, b) => a.order - b.order)
                  .map(block => (
                    <EditableBlock
                      key={block.id}
                      block={block}
                      allBlocks={gameData.layout.blocks}
                      gameData={gameData}
                      selectedBlockId={selectedBlockId}
                      hoveredBlockId={hoveredBlockId}
                      onBlockClick={handleBlockClick}
                      onHover={setHoveredBlockId}
                      onBlockUpdate={handleBlockUpdate}
                      onBlockDelete={handleBlockDelete}
                      onBlockAdd={handleBlockAdd}
                      onBlockMove={handleBlockMove}
                      onDuplicate={handleDuplicateBlock}
                    />
                  ))}
              </SortableContext>

              {gameData.layout.blocks.filter(b => !b.parentId).length === 0 && (
                <div className="canvas-empty">
                  <h3>Start Building Your Game Layout</h3>
                  <p>Choose a template or add blocks from the left sidebar</p>
                  <button
                    className="btn-primary"
                    onClick={() => setLeftPanelTab('add')}
                  >
                    Add Your First Block
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="webflow-sidebar webflow-sidebar-right">
          {selectedBlock ? (
            <WebflowPropertiesPanel
              block={selectedBlock}
              onUpdate={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
              onClose={() => setSelectedBlockId(null)}
            />
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🎯</div>
              <h3>No Element Selected</h3>
              <p>Click on any element in the canvas to edit its properties</p>
              <div className="shortcuts">
                <h4>Keyboard Shortcuts</h4>
                <div className="shortcut-list">
                  <div className="shortcut-item">
                    <kbd>Cmd/Ctrl</kbd> + <kbd>Z</kbd>
                    <span>Undo</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Cmd/Ctrl</kbd> + <kbd>C</kbd>
                    <span>Copy</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Cmd/Ctrl</kbd> + <kbd>V</kbd>
                    <span>Paste</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Delete</kbd>
                    <span>Delete</span>
                  </div>
                  <div className="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Deselect</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

// Editable Block Component with Drag & Drop
function EditableBlock({
  block,
  allBlocks,
  gameData,
  selectedBlockId,
  hoveredBlockId,
  onBlockClick,
  onHover,
  onBlockUpdate,
  onBlockDelete,
  onBlockAdd,
  onBlockMove,
  onDuplicate
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    ...block.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const children = allBlocks
    .filter(b => b.parentId === block.id)
    .sort((a, b) => a.order - b.order);

  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id && !isSelected;

  return (
    <div
      ref={setNodeRef}
      data-block-id={block.id}
      className={`webflow-block ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      style={style}
      onClick={(e) => onBlockClick(e, block.id)}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onHover(block.id);
      }}
      onMouseLeave={() => onHover(null)}
    >
      {/* Block Label & Controls */}
      <div className="block-label" {...attributes} {...listeners}>
        <span className="block-type">
          <span className="drag-handle">⋮⋮</span>
          {getBlockIcon(block.type)} {getBlockName(block.type)}
        </span>
        <div className="block-controls">
          <button
            className="control-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBlockMove(block.id, 'up');
            }}
            title="Move Up"
          >
            ↑
          </button>
          <button
            className="control-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBlockMove(block.id, 'down');
            }}
            title="Move Down"
          >
            ↓
          </button>
          <button
            className="control-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block);
            }}
            title="Duplicate (Cmd/Ctrl+C, Cmd/Ctrl+V)"
          >
            📋
          </button>
          <button
            className="control-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this block and all its children?')) {
                onBlockDelete(block.id);
              }
            }}
            title="Delete (Backspace)"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className="block-content">
        {renderBlockContent(block, gameData)}

        {/* Render Children */}
        {children.length > 0 && (
          <div className="block-children">
            {children.map(child => (
              <EditableBlock
                key={child.id}
                block={child}
                allBlocks={allBlocks}
                gameData={gameData}
                selectedBlockId={selectedBlockId}
                hoveredBlockId={hoveredBlockId}
                onBlockClick={onBlockClick}
                onHover={onHover}
                onBlockUpdate={onBlockUpdate}
                onBlockDelete={onBlockDelete}
                onBlockAdd={onBlockAdd}
                onBlockMove={onBlockMove}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        )}

        {/* Add Block Button */}
        {(block.type === 'container' || children.length === 0) && (
          <button
            className="add-block-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBlockAdd('container', block.id);
            }}
          >
            + Add Block Inside
          </button>
        )}
      </div>
    </div>
  );
}

// Helper functions (same as before, moved to separate file would be cleaner)
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
  // Same rendering logic as before
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
    // ... other cases same as before
    default:
      return null;
  }
}

function getDefaultStyleForType(type) {
  // Same defaults as before
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
    // ... other defaults
  };
  return defaults[type] || defaults.container;
}

function getTemplateBlocks(template) {
  // Return template blocks based on template name
  return [];
}
