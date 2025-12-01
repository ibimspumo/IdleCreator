import { useState } from 'react';

export function BlockProperties({ block, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('layout');

  const updateStyle = (key, value) => {
    onUpdate({ style: { ...block.style, [key]: value } });
  };

  return (
    <div className="block-properties">
      <div className="properties-header">
        <h3>Block Properties</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Tabs */}
      <div className="properties-tabs">
        <button
          className={`properties-tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          Layout
        </button>
        <button
          className={`properties-tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
      </div>

      <div className="properties-content">
        {activeTab === 'layout' && (
          <div className="properties-section">
            {/* Display Type */}
            <div className="property-field">
              <label>Display</label>
              <select
                value={block.style.display || 'flex'}
                onChange={(e) => updateStyle('display', e.target.value)}
              >
                <option value="flex">Flexbox</option>
                <option value="grid">Grid</option>
                <option value="block">Block</option>
              </select>
            </div>

            {/* Flex Properties */}
            {block.style.display === 'flex' && (
              <>
                <div className="property-field">
                  <label>Flex Direction</label>
                  <select
                    value={block.style.flexDirection || 'row'}
                    onChange={(e) => updateStyle('flexDirection', e.target.value)}
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Justify Content</label>
                  <select
                    value={block.style.justifyContent || 'flex-start'}
                    onChange={(e) => updateStyle('justifyContent', e.target.value)}
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Align Items</label>
                  <select
                    value={block.style.alignItems || 'stretch'}
                    onChange={(e) => updateStyle('alignItems', e.target.value)}
                  >
                    <option value="stretch">Stretch</option>
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Flex Wrap</label>
                  <select
                    value={block.style.flexWrap || 'nowrap'}
                    onChange={(e) => updateStyle('flexWrap', e.target.value)}
                  >
                    <option value="nowrap">No Wrap</option>
                    <option value="wrap">Wrap</option>
                    <option value="wrap-reverse">Wrap Reverse</option>
                  </select>
                </div>
              </>
            )}

            {/* Grid Properties */}
            {block.style.display === 'grid' && (
              <>
                <div className="property-field">
                  <label>Grid Template Columns</label>
                  <input
                    type="text"
                    value={block.style.gridTemplateColumns || '1fr'}
                    onChange={(e) => updateStyle('gridTemplateColumns', e.target.value)}
                    placeholder="e.g. 1fr 2fr or repeat(3, 1fr)"
                  />
                </div>

                <div className="property-field">
                  <label>Grid Template Rows</label>
                  <input
                    type="text"
                    value={block.style.gridTemplateRows || 'auto'}
                    onChange={(e) => updateStyle('gridTemplateRows', e.target.value)}
                    placeholder="e.g. auto auto or 100px 1fr"
                  />
                </div>

                <div className="property-field">
                  <label>Grid Auto Flow</label>
                  <select
                    value={block.style.gridAutoFlow || 'row'}
                    onChange={(e) => updateStyle('gridAutoFlow', e.target.value)}
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="dense">Dense</option>
                  </select>
                </div>
              </>
            )}

            {/* Gap */}
            <div className="property-field">
              <label>Gap</label>
              <input
                type="text"
                value={block.style.gap || '0'}
                onChange={(e) => updateStyle('gap', e.target.value)}
                placeholder="e.g. 1rem or 16px"
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="properties-section">
            {/* Padding */}
            <div className="property-field">
              <label>Padding</label>
              <input
                type="text"
                value={block.style.padding || '0'}
                onChange={(e) => updateStyle('padding', e.target.value)}
                placeholder="e.g. 1rem or 16px"
              />
            </div>

            {/* Margin */}
            <div className="property-field">
              <label>Margin</label>
              <input
                type="text"
                value={block.style.margin || '0'}
                onChange={(e) => updateStyle('margin', e.target.value)}
                placeholder="e.g. 1rem or 16px"
              />
            </div>

            {/* Width */}
            <div className="property-field">
              <label>Width</label>
              <input
                type="text"
                value={block.style.width || 'auto'}
                onChange={(e) => updateStyle('width', e.target.value)}
                placeholder="e.g. 100% or 500px"
              />
            </div>

            {/* Height */}
            <div className="property-field">
              <label>Height</label>
              <input
                type="text"
                value={block.style.height || 'auto'}
                onChange={(e) => updateStyle('height', e.target.value)}
                placeholder="e.g. 100vh or 400px"
              />
            </div>

            {/* Background Color */}
            <div className="property-field">
              <label>Background Color</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={block.style.backgroundColor || '#1a1a1a'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  value={block.style.backgroundColor || '#1a1a1a'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div className="property-field">
              <label>Border Radius</label>
              <input
                type="text"
                value={block.style.borderRadius || '0'}
                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                placeholder="e.g. 8px"
              />
            </div>

            {/* Border */}
            <div className="property-field">
              <label>Border</label>
              <input
                type="text"
                value={block.style.border || 'none'}
                onChange={(e) => updateStyle('border', e.target.value)}
                placeholder="e.g. 1px solid #333"
              />
            </div>

            {/* Overflow */}
            <div className="property-field">
              <label>Overflow</label>
              <select
                value={block.style.overflow || 'visible'}
                onChange={(e) => updateStyle('overflow', e.target.value)}
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="scroll">Scroll</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
