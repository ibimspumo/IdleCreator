import { useState } from 'react';
import { SpacingPopover } from './SpacingPopover';

export function SpacingSection({ block, updateStyle }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePopover, setActivePopover] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, side: '' });

  const parseSpacing = (value) => {
    if (!value || value === '0') return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
    const parts = value.split(' ');
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    if (parts.length === 4) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  };

  const updateSpacing = (type, side, value) => {
    const current = parseSpacing(block.style[type]);
    current[side] = value;
    const newValue = `${current.top} ${current.right} ${current.bottom} ${current.left}`;
    updateStyle(type, newValue);
  };

  const margin = parseSpacing(block.style.margin);
  const padding = parseSpacing(block.style.padding);

  const handleClick = (e, type, side) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({
      top: rect.top,
      left: rect.left + rect.width / 2,
      side: side
    });
    setActivePopover(`${type}-${side}`);
  };

  const getCurrentValue = () => {
    if (!activePopover) return '0px';
    const [type, side] = activePopover.split('-');
    return type === 'margin' ? margin[side] : padding[side];
  };

  return (
    <div className="prop-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="section-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="section-title">Spacing</span>
      </div>

      {isExpanded && (
        <div className="section-content">
          <div className="box-model">
            <div className="box-model-layer margin-layer">
              <div className="box-model-label">Margin</div>
              <div className="box-value-btn box-top" onClick={(e) => handleClick(e, 'margin', 'top')}>{margin.top}</div>
              <div className="box-value-btn box-right" onClick={(e) => handleClick(e, 'margin', 'right')}>{margin.right}</div>
              <div className="box-value-btn box-bottom" onClick={(e) => handleClick(e, 'margin', 'bottom')}>{margin.bottom}</div>
              <div className="box-value-btn box-left" onClick={(e) => handleClick(e, 'margin', 'left')}>{margin.left}</div>

              <div className="box-model-layer padding-layer">
                <div className="box-model-label">Padding</div>
                <div className="box-value-btn box-top" onClick={(e) => handleClick(e, 'padding', 'top')}>{padding.top}</div>
                <div className="box-value-btn box-right" onClick={(e) => handleClick(e, 'padding', 'right')}>{padding.right}</div>
                <div className="box-value-btn box-bottom" onClick={(e) => handleClick(e, 'padding', 'bottom')}>{padding.bottom}</div>
                <div className="box-value-btn box-left" onClick={(e) => handleClick(e, 'padding', 'left')}>{padding.left}</div>

                <div className="box-model-center">
                  <div className="box-center-icon">📦</div>
                </div>
              </div>
            </div>
          </div>

          {/* Single Popover */}
          {activePopover && (
            <div
              className="spacing-popover-overlay"
              style={{
                position: 'fixed',
                top: `${popoverPos.top}px`,
                left: `${popoverPos.left}px`,
                transform: 'translate(-50%, -110%)',
                zIndex: 10000
              }}
            >
              <SpacingPopover
                value={getCurrentValue()}
                onChange={(value) => {
                  const [type, side] = activePopover.split('-');
                  updateSpacing(type, side, value);
                }}
                label={activePopover.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                onClose={() => setActivePopover(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
