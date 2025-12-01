import { useState } from 'react';

export function CompletePropertiesPanel({ block, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('layout');

  const updateStyle = (key, value) => {
    onUpdate({ style: { ...block.style, [key]: value } });
  };

  return (
    <div className="complete-properties-panel">
      <div className="properties-header">
        <h3>Properties</h3>
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
        <button
          className={`properties-tab ${activeTab === 'spacing' ? 'active' : ''}`}
          onClick={() => setActiveTab('spacing')}
        >
          Spacing
        </button>
        <button
          className={`properties-tab ${activeTab === 'size' ? 'active' : ''}`}
          onClick={() => setActiveTab('size')}
        >
          Size
        </button>
      </div>

      <div className="properties-content">
        {activeTab === 'layout' && (
          <LayoutTab block={block} updateStyle={updateStyle} />
        )}

        {activeTab === 'style' && (
          <StyleTab block={block} updateStyle={updateStyle} />
        )}

        {activeTab === 'spacing' && (
          <SpacingTab block={block} updateStyle={updateStyle} />
        )}

        {activeTab === 'size' && (
          <SizeTab block={block} updateStyle={updateStyle} />
        )}
      </div>
    </div>
  );
}

function LayoutTab({ block, updateStyle }) {
  return (
    <div className="properties-section">
      <div className="property-group">
        <label className="property-label">Display</label>
        <select
          className="property-select"
          value={block.style.display || 'flex'}
          onChange={(e) => updateStyle('display', e.target.value)}
        >
          <option value="flex">Flexbox</option>
          <option value="grid">Grid</option>
          <option value="block">Block</option>
          <option value="inline-block">Inline Block</option>
          <option value="none">None</option>
        </select>
      </div>

      {block.style.display === 'flex' && (
        <>
          <div className="property-group">
            <label className="property-label">Flex Direction</label>
            <div className="button-group">
              <button
                className={`btn-icon ${block.style.flexDirection === 'row' ? 'active' : ''}`}
                onClick={() => updateStyle('flexDirection', 'row')}
                title="Row"
              >
                →
              </button>
              <button
                className={`btn-icon ${block.style.flexDirection === 'column' ? 'active' : ''}`}
                onClick={() => updateStyle('flexDirection', 'column')}
                title="Column"
              >
                ↓
              </button>
              <button
                className={`btn-icon ${block.style.flexDirection === 'row-reverse' ? 'active' : ''}`}
                onClick={() => updateStyle('flexDirection', 'row-reverse')}
                title="Row Reverse"
              >
                ←
              </button>
              <button
                className={`btn-icon ${block.style.flexDirection === 'column-reverse' ? 'active' : ''}`}
                onClick={() => updateStyle('flexDirection', 'column-reverse')}
                title="Column Reverse"
              >
                ↑
              </button>
            </div>
          </div>

          <div className="property-group">
            <label className="property-label">Justify Content</label>
            <select
              className="property-select"
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

          <div className="property-group">
            <label className="property-label">Align Items</label>
            <select
              className="property-select"
              value={block.style.alignItems || 'stretch'}
              onChange={(e) => updateStyle('alignItems', e.target.value)}
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>

          <div className="property-group">
            <label className="property-label">Flex Wrap</label>
            <select
              className="property-select"
              value={block.style.flexWrap || 'nowrap'}
              onChange={(e) => updateStyle('flexWrap', e.target.value)}
            >
              <option value="nowrap">No Wrap</option>
              <option value="wrap">Wrap</option>
              <option value="wrap-reverse">Wrap Reverse</option>
            </select>
          </div>

          <div className="property-group">
            <label className="property-label">Gap</label>
            <input
              type="text"
              className="property-input"
              value={block.style.gap || '0'}
              onChange={(e) => updateStyle('gap', e.target.value)}
              placeholder="e.g. 1rem or 16px"
            />
          </div>
        </>
      )}

      {block.style.display === 'grid' && (
        <>
          <div className="property-group">
            <label className="property-label">Grid Template Columns</label>
            <input
              type="text"
              className="property-input"
              value={block.style.gridTemplateColumns || '1fr'}
              onChange={(e) => updateStyle('gridTemplateColumns', e.target.value)}
              placeholder="e.g. 1fr 2fr or repeat(3, 1fr)"
            />
          </div>

          <div className="property-group">
            <label className="property-label">Grid Template Rows</label>
            <input
              type="text"
              className="property-input"
              value={block.style.gridTemplateRows || 'auto'}
              onChange={(e) => updateStyle('gridTemplateRows', e.target.value)}
              placeholder="e.g. auto auto or 100px 1fr"
            />
          </div>

          <div className="property-group">
            <label className="property-label">Gap</label>
            <input
              type="text"
              className="property-input"
              value={block.style.gap || '0'}
              onChange={(e) => updateStyle('gap', e.target.value)}
              placeholder="e.g. 1rem"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StyleTab({ block, updateStyle }) {
  return (
    <div className="properties-section">
      <div className="property-group">
        <label className="property-label">Background Color</label>
        <div className="color-input-group">
          <input
            type="color"
            className="color-picker"
            value={block.style.backgroundColor || '#1a1a1a'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            className="property-input"
            value={block.style.backgroundColor || '#1a1a1a'}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="property-group">
        <label className="property-label">Border</label>
        <input
          type="text"
          className="property-input"
          value={block.style.border || 'none'}
          onChange={(e) => updateStyle('border', e.target.value)}
          placeholder="e.g. 1px solid #333"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Border Radius</label>
        <input
          type="text"
          className="property-input"
          value={block.style.borderRadius || '0'}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="e.g. 8px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Box Shadow</label>
        <input
          type="text"
          className="property-input"
          value={block.style.boxShadow || 'none'}
          onChange={(e) => updateStyle('boxShadow', e.target.value)}
          placeholder="e.g. 0 4px 12px rgba(0,0,0,0.1)"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Overflow</label>
        <select
          className="property-select"
          value={block.style.overflow || 'visible'}
          onChange={(e) => updateStyle('overflow', e.target.value)}
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="scroll">Scroll</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div className="property-group">
        <label className="property-label">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={block.style.opacity || 1}
          onChange={(e) => updateStyle('opacity', e.target.value)}
        />
        <span className="range-value">{block.style.opacity || 1}</span>
      </div>
    </div>
  );
}

function SpacingTab({ block, updateStyle }) {
  return (
    <div className="properties-section">
      <div className="property-group">
        <label className="property-label">Padding</label>
        <input
          type="text"
          className="property-input"
          value={block.style.padding || '0'}
          onChange={(e) => updateStyle('padding', e.target.value)}
          placeholder="e.g. 1rem or 16px 24px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Margin</label>
        <input
          type="text"
          className="property-input"
          value={block.style.margin || '0'}
          onChange={(e) => updateStyle('margin', e.target.value)}
          placeholder="e.g. 1rem or 16px 24px"
        />
      </div>
    </div>
  );
}

function SizeTab({ block, updateStyle }) {
  return (
    <div className="properties-section">
      <div className="property-group">
        <label className="property-label">Width</label>
        <input
          type="text"
          className="property-input"
          value={block.style.width || 'auto'}
          onChange={(e) => updateStyle('width', e.target.value)}
          placeholder="e.g. 100% or 500px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Min Width</label>
        <input
          type="text"
          className="property-input"
          value={block.style.minWidth || 'auto'}
          onChange={(e) => updateStyle('minWidth', e.target.value)}
          placeholder="e.g. 200px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Max Width</label>
        <input
          type="text"
          className="property-input"
          value={block.style.maxWidth || 'none'}
          onChange={(e) => updateStyle('maxWidth', e.target.value)}
          placeholder="e.g. 1200px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Height</label>
        <input
          type="text"
          className="property-input"
          value={block.style.height || 'auto'}
          onChange={(e) => updateStyle('height', e.target.value)}
          placeholder="e.g. 100vh or 400px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Min Height</label>
        <input
          type="text"
          className="property-input"
          value={block.style.minHeight || 'auto'}
          onChange={(e) => updateStyle('minHeight', e.target.value)}
          placeholder="e.g. 100px"
        />
      </div>

      <div className="property-group">
        <label className="property-label">Max Height</label>
        <input
          type="text"
          className="property-input"
          value={block.style.maxHeight || 'none'}
          onChange={(e) => updateStyle('maxHeight', e.target.value)}
          placeholder="e.g. 800px"
        />
      </div>
    </div>
  );
}
