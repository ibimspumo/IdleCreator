import React, { useState } from 'react';
import PixelArtEditor, { PixelArtUtils } from './PixelArtEditor';

// Helper: Render Icon (Pixel Art or Emoji)
export function RenderIcon({ icon, size = 18 }) {
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
export function LayerSection({ title, count, items, type, selectedItem, onSelect, onAdd, onDelete }) {
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
export function GameMetaProperties({ meta, onChange, prestige, onPrestigeChange }) {
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
export function ResourceProperties({ data, onChange }) {
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