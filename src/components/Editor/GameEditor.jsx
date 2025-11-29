import { useState } from 'react';
import { CompressionUtils } from '../../utils/compression';
import {
  BuildingProperties,
  UpgradeProperties,
  AchievementProperties,
  ThemeProperties,
  ThemeCanvas
} from './PropertyPanels';
import PixelArtEditor, { PixelArtUtils } from './PixelArtEditor';
import {
  BuildingCardPreview,
  UpgradeCardPreview,
  AchievementCardPreview,
  ResourcePreview
} from '../Preview/PreviewCards';
import LogicEditor from '../LogicEditor/LogicEditor';
import '../../styles/editor.css';

function GameEditor({ onPreview, onBackToHome }) {
  const [gameData, setGameData] = useState(CompressionUtils.createTemplate());
  const [selectedItem, setSelectedItem] = useState(null); // { type, id }
  const [selectedTab, setSelectedTab] = useState('game'); // 'game', 'theme', 'logic'
  const [exportString, setExportString] = useState('');

  const selectItem = (type, id) => {
    setSelectedItem({ type, id });
  };

  const addItem = (type) => {
    let newItem;
    const timestamp = Date.now();

    switch (type) {
      case 'resource':
        newItem = {
          id: `resource_${timestamp}`,
          name: 'New Resource',
          icon: '💎',
          clickable: false,
          clickAmount: 1,
          startAmount: 0
        };
        setGameData(prev => ({ ...prev, resources: [...prev.resources, newItem] }));
        selectItem('resource', newItem.id);
        break;

      case 'building':
        newItem = {
          id: `building_${timestamp}`,
          name: 'New Building',
          description: 'Description...',
          icon: '🏗️',
          cost: [{ resourceId: gameData.resources[0]?.id || 'coins', baseAmount: 10 }],
          costScaling: 1.15,
          produces: [{ resourceId: gameData.resources[0]?.id || 'coins', amount: 1 }]
        };
        setGameData(prev => ({ ...prev, buildings: [...prev.buildings, newItem] }));
        selectItem('building', newItem.id);
        break;

      case 'upgrade':
        newItem = {
          id: `upgrade_${timestamp}`,
          name: 'New Upgrade',
          description: 'Description...',
          icon: '⬆️',
          cost: [{ resourceId: gameData.resources[0]?.id || 'coins', amount: 100 }],
          unlockRequirements: [],
          effects: [{ type: 'multiply', target: 'production', value: 2 }]
        };
        setGameData(prev => ({ ...prev, upgrades: [...prev.upgrades, newItem] }));
        selectItem('upgrade', newItem.id);
        break;

      case 'achievement':
        newItem = {
          id: `achievement_${timestamp}`,
          name: 'New Achievement',
          description: 'Description...',
          icon: '🏆',
          requirements: [{ type: 'resource', resourceId: gameData.resources[0]?.id || 'coins', amount: 100 }]
        };
        setGameData(prev => ({ ...prev, achievements: [...prev.achievements, newItem] }));
        selectItem('achievement', newItem.id);
        break;
    }
  };

  const deleteItem = (type, id) => {
    if (!confirm('Delete this item?')) return;

    switch (type) {
      case 'resource':
        if (gameData.resources.length === 1) {
          alert('You must have at least one resource!');
          return;
        }
        setGameData(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
        break;
      case 'building':
        setGameData(prev => ({ ...prev, buildings: prev.buildings.filter(b => b.id !== id) }));
        break;
      case 'upgrade':
        setGameData(prev => ({ ...prev, upgrades: prev.upgrades.filter(u => u.id !== id) }));
        break;
      case 'achievement':
        setGameData(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));
        break;
    }

    if (selectedItem?.type === type && selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const updateMeta = (field, value) => {
    setGameData(prev => ({ ...prev, meta: { ...prev.meta, [field]: value } }));
  };

  const updateItem = (type, id, updates) => {
    switch (type) {
      case 'resource':
        setGameData(prev => ({
          ...prev,
          resources: prev.resources.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
        break;
      case 'building':
        setGameData(prev => ({
          ...prev,
          buildings: prev.buildings.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        break;
      case 'upgrade':
        setGameData(prev => ({
          ...prev,
          upgrades: prev.upgrades.map(u => u.id === id ? { ...u, ...updates } : u)
        }));
        break;
      case 'achievement':
        setGameData(prev => ({
          ...prev,
          achievements: prev.achievements.map(a => a.id === id ? { ...a, ...updates } : a)
        }));
        break;
    }
  };

  const handleExport = () => {
    console.log('Export clicked');
    const validation = CompressionUtils.validate(gameData);
    if (!validation.valid) {
      alert(`Export failed: ${validation.error}`);
      return;
    }

    const compressed = CompressionUtils.compress(gameData);
    console.log('Export string:', compressed?.substring(0, 50));
    setExportString(compressed);
  };

  const handlePreviewClick = () => {
    console.log('Preview clicked', gameData);
    onPreview(gameData);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportString);
    alert('Export code copied to clipboard!');
  };

  const getSelectedData = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'resource':
        return gameData.resources.find(r => r.id === selectedItem.id);
      case 'building':
        return gameData.buildings.find(b => b.id === selectedItem.id);
      case 'upgrade':
        return gameData.upgrades.find(u => u.id === selectedItem.id);
      case 'achievement':
        return gameData.achievements.find(a => a.id === selectedItem.id);
      default:
        return null;
    }
  };

  const selectedData = getSelectedData();

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <div>
            <div className="toolbar-title">{gameData.meta.title}</div>
            <div className="toolbar-subtitle">Idle Game Creator</div>
          </div>
        </div>

        <div className="toolbar-center">
          <button
            className={`toolbar-tab ${selectedTab === 'game' ? 'active' : ''}`}
            onClick={() => setSelectedTab('game')}
          >
            Game
          </button>
          <button
            className={`toolbar-tab ${selectedTab === 'theme' ? 'active' : ''}`}
            onClick={() => setSelectedTab('theme')}
          >
            Theme
          </button>
          <button
            className={`toolbar-tab ${selectedTab === 'logic' ? 'active' : ''}`}
            onClick={() => setSelectedTab('logic')}
          >
            Logic
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-button" onClick={handlePreviewClick}>
            Preview
          </button>
          <button className="toolbar-button primary" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Left Sidebar - Layers */}
      <div className="left-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Game Elements</span>
        </div>

        <div className="sidebar-content">
          {selectedTab === 'game' && (
            <>
              <LayerSection
                title="Resources"
                count={gameData.resources.length}
                items={gameData.resources}
                type="resource"
                selectedItem={selectedItem}
                onSelect={selectItem}
                onAdd={() => addItem('resource')}
                onDelete={deleteItem}
              />

              <LayerSection
                title="Buildings"
                count={gameData.buildings.length}
                items={gameData.buildings}
                type="building"
                selectedItem={selectedItem}
                onSelect={selectItem}
                onAdd={() => addItem('building')}
                onDelete={deleteItem}
              />

              <LayerSection
                title="Upgrades"
                count={gameData.upgrades.length}
                items={gameData.upgrades}
                type="upgrade"
                selectedItem={selectedItem}
                onSelect={selectItem}
                onAdd={() => addItem('upgrade')}
                onDelete={deleteItem}
              />

              <LayerSection
                title="Achievements"
                count={gameData.achievements.length}
                items={gameData.achievements}
                type="achievement"
                selectedItem={selectedItem}
                onSelect={selectItem}
                onAdd={() => addItem('achievement')}
                onDelete={deleteItem}
              />
            </>
          )}
        </div>

        {/* Back Button at bottom of sidebar */}
        <div style={{ padding: '1rem', marginTop: 'auto', borderTop: '1px solid var(--border-primary)' }}>
          <button
            onClick={onBackToHome}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
  
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'var(--bg-hover)';
              e.target.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'var(--bg-tertiary)';
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="editor-canvas">
        {selectedTab === 'logic' ? (
          <LogicEditor />
        ) : (
          <>
            {selectedTab === 'game' && !selectedItem && (
              <div className="canvas-empty">
                <div className="canvas-empty-icon">←</div>
                <div className="canvas-empty-text">Select an element to edit</div>
                <div className="canvas-empty-hint">Click on any item in the sidebar</div>
              </div>
            )}

            {selectedTab === 'game' && selectedItem && selectedData && (
              <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.125rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Live Preview
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    How this {selectedItem.type} will appear in the game
                  </p>
                </div>

                {selectedItem.type === 'resource' && (
                  <ResourcePreview resource={selectedData} />
                )}

                {selectedItem.type === 'building' && (
                  <BuildingCardPreview
                    building={selectedData}
                    resources={gameData.resources}
                  />
                )}

                {selectedItem.type === 'upgrade' && (
                  <UpgradeCardPreview
                    upgrade={selectedData}
                    resources={gameData.resources}
                  />
                )}

                {selectedItem.type === 'achievement' && (
                  <AchievementCardPreview
                    achievement={selectedData}
                    resources={gameData.resources}
                  />
                )}
              </div>
            )}

            {selectedTab === 'theme' && (
              <ThemeCanvas theme={gameData.theme} onChange={theme => setGameData(prev => ({ ...prev, theme }))} />
            )}
          </>
        )}
      </div>

      {/* Right Sidebar - Properties */}
      <div className="right-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Properties</span>
        </div>

        <div className="properties-panel">
          {selectedTab === 'game' && !selectedItem && (
            <GameMetaProperties meta={gameData.meta} onChange={updateMeta} prestige={gameData.prestige} onPrestigeChange={prestige => setGameData(prev => ({ ...prev, prestige }))} />
          )}

          {selectedTab === 'game' && selectedItem && selectedData && (
            <>
              {selectedItem.type === 'resource' && (
                <ResourceProperties data={selectedData} onChange={updates => updateItem('resource', selectedItem.id, updates)} />
              )}

              {selectedItem.type === 'building' && (
                <BuildingProperties data={selectedData} resources={gameData.resources} onChange={updates => updateItem('building', selectedItem.id, updates)} />
              )}

              {selectedItem.type === 'upgrade' && (
                <UpgradeProperties data={selectedData} resources={gameData.resources} buildings={gameData.buildings} onChange={updates => updateItem('upgrade', selectedItem.id, updates)} />
              )}

              {selectedItem.type === 'achievement' && (
                <AchievementProperties data={selectedData} resources={gameData.resources} buildings={gameData.buildings} onChange={updates => updateItem('achievement', selectedItem.id, updates)} />
              )}
            </>
          )}

          {selectedTab === 'theme' && (
            <ThemeProperties theme={gameData.theme} onChange={theme => setGameData(prev => ({ ...prev, theme }))} />
          )}
        </div>
      </div>

      {/* Export Modal */}
      {exportString && (
        <div className="export-modal" onClick={() => setExportString('')}>
          <div className="export-content" onClick={e => e.stopPropagation()}>
            <h2>Export Code</h2>
            <p>Copy this code and share it:</p>
            <textarea
              className="export-textarea"
              readOnly
              value={exportString}
              onClick={e => e.target.select()}
            />
            <div className="export-actions">
              <button onClick={() => setExportString('')} className="btn-secondary">
                Close
              </button>
              <button onClick={handleCopyToClipboard} className="btn-primary">
                Copy to Clipboard
              </button>
            </div>
            <div className="export-stats">
              Length: {exportString.length} characters
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: Render Icon (Pixel Art or Emoji)
function RenderIcon({ icon, size = 18 }) {
  if (icon && icon.startsWith('8x8:')) {
    const grid = PixelArtUtils.decompress(icon);
    return (
      <canvas
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated', display: 'block' }}
        ref={canvas => {
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const ps = size / 8;
            for (let y = 0; y < 8; y++) {
              for (let x = 0; x < 8; x++) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(x * ps, y * ps, ps, ps);
              }
            }
          }
        }}
      />
    );
  }
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>{icon || '🎨'}</span>;
}

// Layer Section Component
function LayerSection({ title, count, items, type, selectedItem, onSelect, onAdd, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="sidebar-section">
      <div className="section-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="section-header-left">
          <span className={`section-icon ${collapsed ? 'collapsed' : ''}`}>▼</span>
          <span className="section-label">{title}</span>
        </div>
        <div>
          <span className="section-count">{count}</span>
          <button className="sidebar-action" onClick={(e) => { e.stopPropagation(); onAdd(); }}>+</button>
        </div>
      </div>

      {!collapsed && (
        <div className="section-items">
          {items.map(item => (
            <div
              key={item.id}
              className={`layer-item ${selectedItem?.type === type && selectedItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(type, item.id)}
            >
              <span className="layer-icon">
                <RenderIcon icon={item.icon} size={18} />
              </span>
              <div className="layer-info">
                <div className="layer-name">{item.name}</div>
                <div className="layer-id">{item.id}</div>
              </div>
              <div className="layer-actions">
                <button className="layer-action" onClick={(e) => { e.stopPropagation(); onDelete(type, item.id); }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Game Meta Properties
function GameMetaProperties({ meta, onChange, prestige, onPrestigeChange }) {
  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Game Info</div>

        <div className="property-field">
          <label className="property-label">Title</label>
          <input
            type="text"
            className="property-input"
            value={meta.title}
            onChange={e => onChange('title', e.target.value)}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Description</label>
          <textarea
            className="property-textarea"
            value={meta.description}
            onChange={e => onChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Author</label>
          <input
            type="text"
            className="property-input"
            value={meta.author}
            onChange={e => onChange('author', e.target.value)}
          />
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Prestige System</div>

        <div className="property-checkbox">
          <input
            type="checkbox"
            checked={prestige.enabled}
            onChange={e => onPrestigeChange({ ...prestige, enabled: e.target.checked })}
          />
          <label className="property-label" style={{ marginBottom: 0 }}>Enable Prestige</label>
        </div>

        {prestige.enabled && (
          <>
            <div className="property-field">
              <label className="property-label">Formula</label>
              <select
                className="property-select"
                value={prestige.formula}
                onChange={e => onPrestigeChange({ ...prestige, formula: e.target.value })}
              >
                <option value="sqrt">Square Root</option>
                <option value="log">Logarithmic</option>
                <option value="linear">Linear</option>
              </select>
            </div>

            <div className="property-field">
              <label className="property-label">Divisor</label>
              <input
                type="number"
                className="property-input"
                value={prestige.divisor}
                onChange={e => onPrestigeChange({ ...prestige, divisor: parseFloat(e.target.value) })}
              />
              <div className="property-hint">Higher value = more resources needed</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Resource Properties
function ResourceProperties({ data, onChange }) {
  const [showPixelEditor, setShowPixelEditor] = useState(false);

  const renderIcon = () => {
    if (data.icon && data.icon.startsWith('8x8:')) {
      const grid = PixelArtUtils.decompress(data.icon);
      return (
        <canvas
          width={32}
          height={32}
          style={{ border: '1px solid var(--border-primary)', borderRadius: '4px', imageRendering: 'pixelated' }}
          ref={canvas => {
            if (canvas) {
              const ctx = canvas.getContext('2d');
              const ps = 4;
              for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                  ctx.fillStyle = grid[y][x];
                  ctx.fillRect(x * ps, y * ps, ps, ps);
                }
              }
            }
          }}
        />
      );
    }
    return <span style={{ fontSize: '2rem' }}>{data.icon || '💎'}</span>;
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Resource</div>

        <div className="property-field">
          <label className="property-label">ID</label>
          <input
            type="text"
            className="property-input"
            value={data.id}
            onChange={e => onChange({ id: e.target.value })}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Name</label>
          <input
            type="text"
            className="property-input"
            value={data.name}
            onChange={e => onChange({ name: e.target.value })}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Icon</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className="property-input"
              value={data.icon}
              onChange={e => onChange({ icon: e.target.value })}
              placeholder="💎 or use pixel art"
              style={{ flex: 1 }}
            />
            <button
              className="btn-secondary"
              onClick={() => setShowPixelEditor(true)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
            >
              Pixel Art
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Preview:</span>
            {renderIcon()}
          </div>
        </div>

        <div className="property-checkbox">
          <input
            type="checkbox"
            checked={data.clickable}
            onChange={e => onChange({ clickable: e.target.checked })}
          />
          <label className="property-label" style={{ marginBottom: 0 }}>Clickable (main resource)</label>
        </div>

        {data.clickable && (
          <div className="property-field">
            <label className="property-label">Click Amount</label>
            <input
              type="number"
              className="property-input"
              value={data.clickAmount}
              onChange={e => onChange({ clickAmount: parseFloat(e.target.value) })}
            />
          </div>
        )}

        <div className="property-field">
          <label className="property-label">Start Amount</label>
          <input
            type="number"
            className="property-input"
            value={data.startAmount}
            onChange={e => onChange({ startAmount: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      {showPixelEditor && (
        <PixelArtEditor
          value={data.icon}
          onChange={icon => {
            onChange({ icon });
            setShowPixelEditor(false);
          }}
          onClose={() => setShowPixelEditor(false)}
        />
      )}
    </>
  );
}

export default GameEditor;