import { useState, useRef, useEffect } from 'react';
import { CompressionUtils } from '../../utils/compression';
import {
  BuildingProperties,
  UpgradeProperties,
  AchievementProperties,
  ThemeProperties,
  ThemeCanvas
} from './PropertyPanels';
import PixelArtEditor from './PixelArtEditor';
import {
  BuildingCardPreview,
  UpgradeCardPreview,
  AchievementCardPreview,
  ResourcePreview
} from '../Preview/PreviewCards';
import LogicEditor from '../LogicEditor/LogicEditor';
import '../../styles/editor.css';
import { GameDataContext } from './GameDataContext';
import LogicToolbox from '../LogicEditor/LogicToolbox';
import LogicNodeProperties from '../LogicEditor/LogicNodeProperties';

import {
  RenderIcon,
  LayerSection,
  GameMetaProperties,
  ResourceProperties
} from './GameEditorHelpers';

function GameEditor({ onPreview }) {
  const [gameData, setGameData] = useState(CompressionUtils.createTemplate());
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTab, setSelectedTab] = useState('game');
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState(''); // State to control import modal

  const logicSetNodesRef = useRef(null);
  const logicUpdateNodeDataRef = useRef(null);
  const logicOnSaveRef = useRef(null);

  const [selectedLogicNode, setSelectedLogicNode] = useState(null);

  const handleImportEditor = (compressedString) => {
    const gameData = CompressionUtils.decompress(compressedString);

    if (!gameData) {
      alert('Import fehlgeschlagen: Ungültiger Code');
      return;
    }

    const validation = CompressionUtils.validate(gameData);
    if (!validation.valid) {
      alert(`Import fehlgeschlagen: ${validation.error}`);
      return;
    }

    setGameData(gameData);
    setImportString(''); // Close the import modal
    alert('Game erfolgreich importiert!');
  };

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
    if (logicOnSaveRef.current) {
      logicOnSaveRef.current();
    }
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
    <GameDataContext.Provider value={{ gameData, onGameDataChange: setGameData }}>
      <div className={`editor-container ${selectedTab === 'logic' ? 'logic-view-active' : ''}`}>
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
            <button className="toolbar-button" onClick={() => setImportString('open')}>
              Import
            </button>
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

            {selectedTab === 'logic' && (
              <LogicToolbox
                setNodesRef={logicSetNodesRef}
                updateNodeDataRef={logicUpdateNodeDataRef}
              />
            )}
          </div>

          {/* Back Button at bottom of sidebar */}

        </div>

      {/* Center Canvas */}
      <div className="editor-canvas">
        {selectedTab === 'logic' ? (
          <LogicEditor
            exposeSetNodes={logicSetNodesRef}
            exposeUpdateNodeData={logicUpdateNodeDataRef}
            exposeOnSave={logicOnSaveRef}
            onNodeSelect={setSelectedLogicNode}
          />
        ) : (
          <>
            {selectedTab === 'game' && selectedItem && selectedData && ( // Corrected conditional
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

            {selectedTab === 'game' && !selectedItem && (
              <div className="canvas-empty">
                <div className="canvas-empty-icon">←</div>
                <div className="canvas-empty-text">Select an element to edit</div>
                <div className="canvas-empty-hint">Click on any item in the sidebar</div>
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

          {selectedTab === 'logic' && selectedLogicNode && (
            <LogicNodeProperties node={selectedLogicNode} updateNodeData={logicUpdateNodeDataRef.current} />
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

      {/* Import Modal */}
      {importString && (
        <div className="export-modal" onClick={() => setImportString('')}> {/* Reusing export-modal styles */}
          <div className="export-content" onClick={e => e.stopPropagation()}> {/* Reusing export-content styles */}
            <h2>Import Game</h2>
            <p>Paste your game export code here:</p>
            <textarea
              className="export-textarea" // Reusing export-textarea styles
              value={importString === 'open' ? '' : importString} // Clear content if just opened
              onChange={(e) => setImportString(e.target.value)}
              placeholder="Paste export code here..."
              rows={10}
            />
            <div className="export-actions">
              <button onClick={() => setImportString('')} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleImportEditor(importString)} className="btn-primary">
                Import Game
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </GameDataContext.Provider>
  );
}

export default GameEditor;