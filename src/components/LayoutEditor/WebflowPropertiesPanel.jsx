import { useState } from 'react';
import { UnitInput } from './UnitInput';
import { GoogleFontsSelector } from './GoogleFontsSelector';
import { SpacingSection } from './SpacingSection';
import '../../styles/webflow-properties.css';

export function WebflowPropertiesPanel({ block, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('style');

  const updateStyle = (key, value) => {
    onUpdate({ style: { ...block.style, [key]: value } });
  };

  return (
    <div className="webflow-properties-panel">
      {/* Header */}
      <div className="properties-header">
        <div className="header-title">
          <span className="block-icon">{getBlockIcon(block.type)}</span>
          <span className="block-type">{getBlockName(block.type)}</span>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div className="properties-tabs">
        <button
          className={`prop-tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`prop-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="properties-content">
        {activeTab === 'style' && (
          <>
            <LayoutSection block={block} updateStyle={updateStyle} />
            <SpacingSection block={block} updateStyle={updateStyle} />
            <SizeSection block={block} updateStyle={updateStyle} />
            <PositionSection block={block} updateStyle={updateStyle} />
            <TypographySection block={block} updateStyle={updateStyle} />
            <StyleSection block={block} updateStyle={updateStyle} />
          </>
        )}
      </div>
    </div>
  );
}

// Layout Section with Visual Controls
function LayoutSection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const display = block.style.display || 'flex';

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Layout</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          {/* Display Type */}
          <div className="prop-group">
            <label className="prop-label">Display</label>
            <div className="button-group-inline">
              <button
                className={`btn-toggle ${display === 'block' ? 'active' : ''}`}
                onClick={() => updateStyle('display', 'block')}
                title="Block"
              >
                Block
              </button>
              <button
                className={`btn-toggle ${display === 'flex' ? 'active' : ''}`}
                onClick={() => updateStyle('display', 'flex')}
                title="Flex"
              >
                Flex
              </button>
              <button
                className={`btn-toggle ${display === 'grid' ? 'active' : ''}`}
                onClick={() => updateStyle('display', 'grid')}
                title="Grid"
              >
                Grid
              </button>
              <button
                className={`btn-toggle ${display === 'none' ? 'active' : ''}`}
                onClick={() => updateStyle('display', 'none')}
                title="None"
              >
                None
              </button>
            </div>
          </div>

          {/* Flex Controls */}
          {display === 'flex' && (
            <>
              {/* Flex Direction */}
              <div className="prop-group">
                <label className="prop-label">Direction</label>
                <div className="button-group-visual">
                  <button
                    className={`btn-visual ${block.style.flexDirection === 'row' || !block.style.flexDirection ? 'active' : ''}`}
                    onClick={() => updateStyle('flexDirection', 'row')}
                    title="Row"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="2" y="7" width="5" height="6" fill="currentColor" opacity="0.7"/>
                      <rect x="8" y="7" width="5" height="6" fill="currentColor" opacity="0.7"/>
                      <rect x="14" y="7" width="4" height="6" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.flexDirection === 'column' ? 'active' : ''}`}
                    onClick={() => updateStyle('flexDirection', 'column')}
                    title="Column"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="7" y="2" width="6" height="5" fill="currentColor" opacity="0.7"/>
                      <rect x="7" y="8" width="6" height="5" fill="currentColor" opacity="0.7"/>
                      <rect x="7" y="14" width="6" height="4" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.flexDirection === 'row-reverse' ? 'active' : ''}`}
                    onClick={() => updateStyle('flexDirection', 'row-reverse')}
                    title="Row Reverse"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="14" y="7" width="4" height="6" fill="currentColor" opacity="0.7"/>
                      <rect x="8" y="7" width="5" height="6" fill="currentColor" opacity="0.7"/>
                      <rect x="2" y="7" width="5" height="6" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.flexDirection === 'column-reverse' ? 'active' : ''}`}
                    onClick={() => updateStyle('flexDirection', 'column-reverse')}
                    title="Column Reverse"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="7" y="14" width="6" height="4" fill="currentColor" opacity="0.7"/>
                      <rect x="7" y="8" width="6" height="5" fill="currentColor" opacity="0.7"/>
                      <rect x="7" y="2" width="6" height="5" fill="currentColor" opacity="0.7"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Justify Content */}
              <div className="prop-group">
                <label className="prop-label">Justify</label>
                <div className="button-group-visual">
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'flex-start' || !block.style.justifyContent ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'flex-start')}
                    title="Start"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="3" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="7" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="11" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'center' ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'center')}
                    title="Center"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="5" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="8.5" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="12" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'flex-end' ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'flex-end')}
                    title="End"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="6" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="10" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="14" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'space-between' ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'space-between')}
                    title="Space Between"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="2" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="8.5" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="15" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'space-around' ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'space-around')}
                    title="Space Around"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="3" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="8.5" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="14" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.justifyContent === 'space-evenly' ? 'active' : ''}`}
                    onClick={() => updateStyle('justifyContent', 'space-evenly')}
                    title="Space Evenly"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="4" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="8.5" y="7" width="3" height="6" fill="currentColor"/>
                      <rect x="13" y="7" width="3" height="6" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Align Items */}
              <div className="prop-group">
                <label className="prop-label">Align</label>
                <div className="button-group-visual">
                  <button
                    className={`btn-visual ${block.style.alignItems === 'flex-start' ? 'active' : ''}`}
                    onClick={() => updateStyle('alignItems', 'flex-start')}
                    title="Start"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="5" y="3" width="3" height="5" fill="currentColor"/>
                      <rect x="9" y="3" width="3" height="7" fill="currentColor"/>
                      <rect x="13" y="3" width="3" height="4" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.alignItems === 'center' ? 'active' : ''}`}
                    onClick={() => updateStyle('alignItems', 'center')}
                    title="Center"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="5" y="6" width="3" height="5" fill="currentColor"/>
                      <rect x="9" y="5" width="3" height="7" fill="currentColor"/>
                      <rect x="13" y="7" width="3" height="4" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.alignItems === 'flex-end' ? 'active' : ''}`}
                    onClick={() => updateStyle('alignItems', 'flex-end')}
                    title="End"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="5" y="10" width="3" height="5" fill="currentColor"/>
                      <rect x="9" y="8" width="3" height="7" fill="currentColor"/>
                      <rect x="13" y="11" width="3" height="4" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    className={`btn-visual ${block.style.alignItems === 'stretch' || !block.style.alignItems ? 'active' : ''}`}
                    onClick={() => updateStyle('alignItems', 'stretch')}
                    title="Stretch"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="5" y="4" width="3" height="11" fill="currentColor"/>
                      <rect x="9" y="4" width="3" height="11" fill="currentColor"/>
                      <rect x="13" y="4" width="3" height="11" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Flex Wrap */}
              <div className="prop-group">
                <label className="prop-label">Wrap</label>
                <div className="button-group-inline">
                  <button
                    className={`btn-toggle ${block.style.flexWrap === 'nowrap' || !block.style.flexWrap ? 'active' : ''}`}
                    onClick={() => updateStyle('flexWrap', 'nowrap')}
                  >
                    No Wrap
                  </button>
                  <button
                    className={`btn-toggle ${block.style.flexWrap === 'wrap' ? 'active' : ''}`}
                    onClick={() => updateStyle('flexWrap', 'wrap')}
                  >
                    Wrap
                  </button>
                </div>
              </div>

              {/* Gap */}
              <div className="prop-group">
                <label className="prop-label">Gap</label>
                <UnitInput
                  value={block.style.gap || '0'}
                  onChange={(value) => updateStyle('gap', value)}
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* Grid Controls */}
          {display === 'grid' && (
            <>
              <div className="prop-group">
                <label className="prop-label">Columns</label>
                <input
                  type="text"
                  className="prop-input"
                  value={block.style.gridTemplateColumns || '1fr'}
                  onChange={(e) => updateStyle('gridTemplateColumns', e.target.value)}
                  placeholder="1fr 1fr"
                />
              </div>

              <div className="prop-group">
                <label className="prop-label">Rows</label>
                <input
                  type="text"
                  className="prop-input"
                  value={block.style.gridTemplateRows || 'auto'}
                  onChange={(e) => updateStyle('gridTemplateRows', e.target.value)}
                  placeholder="auto"
                />
              </div>

              <div className="prop-group">
                <label className="prop-label">Gap</label>
                <UnitInput
                  value={block.style.gap || '0'}
                  onChange={(value) => updateStyle('gap', value)}
                  placeholder="0"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Size Section
function SizeSection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Size</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label-sm">Width</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.width || 'auto'}
                onChange={(value) => updateStyle('width', value)}
                placeholder="auto"
              />
            </div>
            <div className="prop-col">
              <label className="prop-label-sm">Height</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.height || 'auto'}
                onChange={(value) => updateStyle('height', value)}
                placeholder="auto"
              />
            </div>
          </div>

          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label-sm">Min W</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.minWidth || '0'}
                onChange={(value) => updateStyle('minWidth', value)}
                placeholder="0"
              />
            </div>
            <div className="prop-col">
              <label className="prop-label-sm">Min H</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.minHeight || '0'}
                onChange={(value) => updateStyle('minHeight', value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label-sm">Max W</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.maxWidth || 'none'}
                onChange={(value) => updateStyle('maxWidth', value)}
                placeholder="none"
              />
            </div>
            <div className="prop-col">
              <label className="prop-label-sm">Max H</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.maxHeight || 'none'}
                onChange={(value) => updateStyle('maxHeight', value)}
                placeholder="none"
              />
            </div>
          </div>

          <div className="prop-group">
            <label className="prop-label">Overflow</label>
            <div className="button-group-inline">
              <button
                className={`btn-toggle ${block.style.overflow === 'visible' || !block.style.overflow ? 'active' : ''}`}
                onClick={() => updateStyle('overflow', 'visible')}
              >
                Visible
              </button>
              <button
                className={`btn-toggle ${block.style.overflow === 'hidden' ? 'active' : ''}`}
                onClick={() => updateStyle('overflow', 'hidden')}
              >
                Hidden
              </button>
              <button
                className={`btn-toggle ${block.style.overflow === 'auto' ? 'active' : ''}`}
                onClick={() => updateStyle('overflow', 'auto')}
              >
                Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Position Section
function PositionSection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Position</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          <div className="prop-group">
            <label className="prop-label">Position</label>
            <select
              className="prop-select"
              value={block.style.position || 'static'}
              onChange={(e) => updateStyle('position', e.target.value)}
            >
              <option value="static">Static</option>
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
              <option value="fixed">Fixed</option>
              <option value="sticky">Sticky</option>
            </select>
          </div>

          {block.style.position && block.style.position !== 'static' && (
            <>
              <div className="prop-row">
                <div className="prop-col">
                  <label className="prop-label-sm">Top</label>
                  <UnitInput
                    className="prop-input-sm"
                    value={block.style.top || 'auto'}
                    onChange={(value) => updateStyle('top', value)}
                    placeholder="auto"
                  />
                </div>
                <div className="prop-col">
                  <label className="prop-label-sm">Right</label>
                  <UnitInput
                    className="prop-input-sm"
                    value={block.style.right || 'auto'}
                    onChange={(value) => updateStyle('right', value)}
                    placeholder="auto"
                  />
                </div>
              </div>

              <div className="prop-row">
                <div className="prop-col">
                  <label className="prop-label-sm">Bottom</label>
                  <UnitInput
                    className="prop-input-sm"
                    value={block.style.bottom || 'auto'}
                    onChange={(value) => updateStyle('bottom', value)}
                    placeholder="auto"
                  />
                </div>
                <div className="prop-col">
                  <label className="prop-label-sm">Left</label>
                  <UnitInput
                    className="prop-input-sm"
                    value={block.style.left || 'auto'}
                    onChange={(value) => updateStyle('left', value)}
                    placeholder="auto"
                  />
                </div>
              </div>

              <div className="prop-group">
                <label className="prop-label">Z-Index</label>
                <input
                  type="number"
                  className="prop-input"
                  value={block.style.zIndex || 'auto'}
                  onChange={(e) => updateStyle('zIndex', e.target.value)}
                  placeholder="auto"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Typography Section
function TypographySection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Typography</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          <div className="prop-group">
            <label className="prop-label">Font Family</label>
            <GoogleFontsSelector
              value={block.style.fontFamily || 'Inter'}
              onChange={(value) => updateStyle('fontFamily', value)}
            />
          </div>

          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label-sm">Size</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.fontSize || '1rem'}
                onChange={(value) => updateStyle('fontSize', value)}
                placeholder="1rem"
              />
            </div>
            <div className="prop-col">
              <label className="prop-label-sm">Weight</label>
              <select
                className="prop-select-sm"
                value={block.style.fontWeight || '400'}
                onChange={(e) => updateStyle('fontWeight', e.target.value)}
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>

          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label-sm">Line Height</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.lineHeight || 'normal'}
                onChange={(value) => updateStyle('lineHeight', value)}
                placeholder="1.5"
              />
            </div>
            <div className="prop-col">
              <label className="prop-label-sm">Letter Spacing</label>
              <UnitInput
                className="prop-input-sm"
                value={block.style.letterSpacing || 'normal'}
                onChange={(value) => updateStyle('letterSpacing', value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="prop-group">
            <label className="prop-label">Color</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={block.style.color || '#ffffff'}
                onChange={(e) => updateStyle('color', e.target.value)}
              />
              <input
                type="text"
                className="prop-input"
                value={block.style.color || '#ffffff'}
                onChange={(e) => updateStyle('color', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="prop-group">
            <label className="prop-label">Align</label>
            <div className="button-group-visual">
              <button
                className={`btn-visual ${block.style.textAlign === 'left' || !block.style.textAlign ? 'active' : ''}`}
                onClick={() => updateStyle('textAlign', 'left')}
                title="Left"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <rect x="2" y="5" width="12" height="1.5" fill="currentColor"/>
                  <rect x="2" y="9" width="8" height="1.5" fill="currentColor"/>
                  <rect x="2" y="13" width="10" height="1.5" fill="currentColor"/>
                </svg>
              </button>
              <button
                className={`btn-visual ${block.style.textAlign === 'center' ? 'active' : ''}`}
                onClick={() => updateStyle('textAlign', 'center')}
                title="Center"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <rect x="4" y="5" width="12" height="1.5" fill="currentColor"/>
                  <rect x="6" y="9" width="8" height="1.5" fill="currentColor"/>
                  <rect x="5" y="13" width="10" height="1.5" fill="currentColor"/>
                </svg>
              </button>
              <button
                className={`btn-visual ${block.style.textAlign === 'right' ? 'active' : ''}`}
                onClick={() => updateStyle('textAlign', 'right')}
                title="Right"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <rect x="6" y="5" width="12" height="1.5" fill="currentColor"/>
                  <rect x="10" y="9" width="8" height="1.5" fill="currentColor"/>
                  <rect x="8" y="13" width="10" height="1.5" fill="currentColor"/>
                </svg>
              </button>
              <button
                className={`btn-visual ${block.style.textAlign === 'justify' ? 'active' : ''}`}
                onClick={() => updateStyle('textAlign', 'justify')}
                title="Justify"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <rect x="2" y="5" width="16" height="1.5" fill="currentColor"/>
                  <rect x="2" y="9" width="16" height="1.5" fill="currentColor"/>
                  <rect x="2" y="13" width="16" height="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Style Section (Background, Borders, etc.)
function StyleSection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Backgrounds & Borders</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          <div className="prop-group">
            <label className="prop-label">Background</label>
            <div className="color-input-group">
              <input
                type="color"
                className="color-picker"
                value={block.style.backgroundColor || '#1a1a1a'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="prop-input"
                value={block.style.backgroundColor || '#1a1a1a'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                placeholder="#1a1a1a"
              />
            </div>
          </div>

          <div className="prop-group">
            <label className="prop-label">Border</label>
            <input
              type="text"
              className="prop-input"
              value={block.style.border || 'none'}
              onChange={(e) => updateStyle('border', e.target.value)}
              placeholder="1px solid #333"
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Border Radius</label>
            <UnitInput
              value={block.style.borderRadius || '0'}
              onChange={(value) => updateStyle('borderRadius', value)}
              placeholder="8px"
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Box Shadow</label>
            <input
              type="text"
              className="prop-input"
              value={block.style.boxShadow || 'none'}
              onChange={(e) => updateStyle('boxShadow', e.target.value)}
              placeholder="0 4px 12px rgba(0,0,0,0.1)"
            />
          </div>

          <div className="prop-group">
            <label className="prop-label">Opacity</label>
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
      )}
    </div>
  );
}

// Helper functions
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
