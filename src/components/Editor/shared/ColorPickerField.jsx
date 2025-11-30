import { useState } from 'react';

// Color Picker Field with Presets
export function ColorPickerField({ label, value, onChange }) {
  const [showPresets, setShowPresets] = useState(false);

  const colorPresets = [
    // Blues & Purples
    '#6366f1', '#818cf8', '#3b82f6', '#60a5fa', '#8b5cf6', '#a78bfa',
    // Greens
    '#10b981', '#34d399', '#059669', '#14b8a6', '#06b6d4',
    // Yellows & Oranges
    '#fbbf24', '#fcd34d', '#f59e0b', '#fb923c', '#f97316',
    // Reds & Pinks
    '#ef4444', '#f87171', '#ec4899', '#f472b6',
    // Grays
    '#0a0a0a', '#111111', '#1a1a1a', '#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
  ];

  return (
    <div className="property-field">
      <label className="property-label">{label}</label>
      <div className="color-picker-container">
        <div className="property-color-input">
          <input
            type="color"
            className="property-color-picker"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <input
            type="text"
            className="property-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="#000000"
          />
          <button
            className="color-presets-toggle"
            onClick={() => setShowPresets(!showPresets)}
            title="Show color presets"
          >
            <span style={{ fontSize: '1rem' }}>🎨</span>
          </button>
        </div>
        {showPresets && (
          <div className="color-presets-grid">
            {colorPresets.map((color) => (
              <button
                key={color}
                className="color-preset"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setShowPresets(false);
                }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
