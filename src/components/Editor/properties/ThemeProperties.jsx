import { useState } from 'react'; // ThemeProperties uses useState indirectly through ColorPickerField
import { ColorPickerField } from '../shared/ColorPickerField'; // Adjusted path


export function ThemeProperties({ theme, onChange }) {
  const presets = {
    editor: {
      name: 'Editor Style (Default)',
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      accentColor: '#10b981',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    },
    dark: {
      name: 'Dark Gray',
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8',
      backgroundColor: '#1f2937',
      textColor: '#f3f4f6',
      accentColor: '#fbbf24',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    },
    light: {
      name: 'Light',
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    },
    cyber: {
      name: 'Cyberpunk',
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      backgroundColor: '#0f172a',
      textColor: '#e0e7ff',
      accentColor: '#06b6d4',
      fontFamily: '"Courier New", monospace',
      borderRadius: '4px'
    },
    forest: {
      name: 'Forest',
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      backgroundColor: '#064e3b',
      textColor: '#d1fae5',
      accentColor: '#fbbf24',
      fontFamily: 'Georgia, serif',
      borderRadius: '12px'
    },
    sunset: {
      name: 'Sunset',
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      backgroundColor: '#7c2d12',
      textColor: '#fff7ed',
      accentColor: '#fb923c',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '16px'
    }
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Theme Presets</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              className="theme-preset-button"
              onClick={() => {
                const { name, ...themeData } = preset;
                onChange(themeData);
              }}
              style={{
                background: `linear-gradient(135deg, ${preset.backgroundColor}, ${preset.primaryColor})`,
                color: preset.textColor,
                border: `2px solid ${preset.primaryColor}`,
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Colors</div>

        <ColorPickerField
          label="Primary Color"
          value={theme.primaryColor}
          onChange={color => onChange({ ...theme, primaryColor: color })}
        />

        <ColorPickerField
          label="Secondary Color"
          value={theme.secondaryColor}
          onChange={color => onChange({ ...theme, secondaryColor: color })}
        />

        <ColorPickerField
          label="Background Color"
          value={theme.backgroundColor}
          onChange={color => onChange({ ...theme, backgroundColor: color })}
        />

        <ColorPickerField
          label="Text Color"
          value={theme.textColor}
          onChange={color => onChange({ ...theme, textColor: color })}
        />

        <ColorPickerField
          label="Accent Color"
          value={theme.accentColor}
          onChange={color => onChange({ ...theme, accentColor: color })}
        />
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Typography</div>

        <div className="property-field">
          <label className="property-label">Font Family</label>
          <select
            className="property-select"
            value={theme.fontFamily}
            onChange={e => onChange({ ...theme, fontFamily: e.target.value })}
          >
            <option value="Inter, system-ui, sans-serif">Inter</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Arial, sans-serif">Arial</option>
          </select>
        </div>

        <div className="property-field">
          <label className="property-label">Border Radius</label>
          <input
            type="text"
            className="property-input"
            value={theme.borderRadius}
            onChange={e => onChange({ ...theme, borderRadius: e.target.value })}
            placeholder="e.g. 8px"
          />
        </div>
      </div>
    </>
  );
}
