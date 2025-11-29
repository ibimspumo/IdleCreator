import { useState } from 'react';
import PixelArtEditor, { PixelArtUtils } from './PixelArtEditor';
import CustomSelect from './CustomSelect';

// Helper: Get display text for dropdown (option tags can't contain canvas)
function getIconDisplayText(icon) {
  if (icon && icon.startsWith('8x8:')) {
    return '🎨'; // Use a simple emoji for pixel art in dropdowns
  }
  return icon || '🎨';
}

// Helper: Render icon (pixel art or emoji) - for use in UI
function RenderIcon({ icon, size = 20 }) {
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

// Helper: Render Pixel Art or Emoji Icon
function IconPreview({ icon }) {
  if (icon && icon.startsWith('8x8:')) {
    const grid = PixelArtUtils.decompress(icon);
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
  return <span style={{ fontSize: '2rem' }}>{icon || '🎨'}</span>;
}

// Helper: Icon Input Field with Pixel Art Button
function IconField({ value, onChange, placeholder = '🎨 or use pixel art' }) {
  const [showPixelEditor, setShowPixelEditor] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          className="property-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
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
        <IconPreview icon={value} />
      </div>

      {showPixelEditor && (
        <PixelArtEditor
          value={value}
          onChange={icon => {
            onChange(icon);
            setShowPixelEditor(false);
          }}
          onClose={() => setShowPixelEditor(false)}
        />
      )}
    </>
  );
}

// Building Properties
export function BuildingProperties({ data, resources, onChange }) {
  const addCost = () => {
    onChange({ cost: [...data.cost, { resourceId: resources[0]?.id || 'coins', baseAmount: 10 }] });
  };

  const updateCost = (index, field, value) => {
    const newCost = [...data.cost];
    newCost[index] = { ...newCost[index], [field]: value };
    onChange({ cost: newCost });
  };

  const removeCost = (index) => {
    if (data.cost.length === 1) {
      alert('A building must have at least one cost!');
      return;
    }
    onChange({ cost: data.cost.filter((_, i) => i !== index) });
  };

  const addProduction = () => {
    onChange({ produces: [...data.produces, { resourceId: resources[0]?.id || 'coins', amount: 1 }] });
  };

  const updateProduction = (index, field, value) => {
    const newProduces = [...data.produces];
    newProduces[index] = { ...newProduces[index], [field]: value };
    onChange({ produces: newProduces });
  };

  const removeProduction = (index) => {
    if (data.produces.length === 1) {
      alert('A building must have at least one production!');
      return;
    }
    onChange({ produces: data.produces.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Building Info</div>

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
          <label className="property-label">Description</label>
          <textarea
            className="property-textarea"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Icon</label>
          <IconField
            value={data.icon}
            onChange={icon => onChange({ icon })}
            placeholder="🏗️ or use pixel art"
          />
        </div>

        <div className="property-field">
          <label className="property-label">Cost Scaling</label>
          <input
            type="number"
            className="property-input"
            value={data.costScaling}
            onChange={e => onChange({ costScaling: parseFloat(e.target.value) })}
            step="0.01"
          />
          <div className="property-hint">e.g. 1.15 = +15% per purchase</div>
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Costs</div>

        <div className="builder-list">
          {data.cost.map((cost, idx) => (
            <div key={idx} className="builder-item">
              <CustomSelect
                options={resources.map(r => ({ value: r.id, label: r.name, icon: r.icon }))}
                value={cost.resourceId}
                onChange={value => updateCost(idx, 'resourceId', value)}
              />
              <input
                type="number"
                className="property-input"
                value={cost.baseAmount}
                onChange={e => updateCost(idx, 'baseAmount', parseFloat(e.target.value))}
                placeholder="Amount"
              />
              <button className="builder-remove" onClick={() => removeCost(idx)}>×</button>
            </div>
          ))}
          <button className="builder-add" onClick={addCost}>+ Add Cost</button>
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Production</div>

        <div className="builder-list">
          {data.produces.map((prod, idx) => (
            <div key={idx} className="builder-item">
              <CustomSelect
                options={resources.map(r => ({ value: r.id, label: r.name, icon: r.icon }))}
                value={prod.resourceId}
                onChange={value => updateProduction(idx, 'resourceId', value)}
              />
              <input
                type="number"
                className="property-input"
                value={prod.amount}
                onChange={e => updateProduction(idx, 'amount', parseFloat(e.target.value))}
                placeholder="per second"
                step="0.1"
              />
              <button className="builder-remove" onClick={() => removeProduction(idx)}>×</button>
            </div>
          ))}
          <button className="builder-add" onClick={addProduction}>+ Add Production</button>
        </div>
      </div>
    </>
  );
}

// Upgrade Properties
export function UpgradeProperties({ data, resources, buildings, onChange }) {
  const addCost = () => {
    onChange({ cost: [...data.cost, { resourceId: resources[0]?.id || 'coins', amount: 100 }] });
  };

  const updateCost = (index, field, value) => {
    const newCost = [...data.cost];
    newCost[index] = { ...newCost[index], [field]: value };
    onChange({ cost: newCost });
  };

  const removeCost = (index) => {
    if (data.cost.length === 1) {
      alert('An upgrade must have at least one cost!');
      return;
    }
    onChange({ cost: data.cost.filter((_, i) => i !== index) });
  };

  const addRequirement = () => {
    onChange({
      unlockRequirements: [
        ...data.unlockRequirements,
        { type: 'resource', resourceId: resources[0]?.id || 'coins', amount: 50 }
      ]
    });
  };

  const updateRequirement = (index, updates) => {
    const newReqs = [...data.unlockRequirements];
    newReqs[index] = { ...newReqs[index], ...updates };
    onChange({ unlockRequirements: newReqs });
  };

  const removeRequirement = (index) => {
    onChange({ unlockRequirements: data.unlockRequirements.filter((_, i) => i !== index) });
  };

  const addEffect = () => {
    onChange({ effects: [...data.effects, { type: 'multiply', target: 'production', value: 2 }] });
  };

  const updateEffect = (index, field, value) => {
    const newEffects = [...data.effects];
    newEffects[index] = { ...newEffects[index], [field]: value };
    onChange({ effects: newEffects });
  };

  const removeEffect = (index) => {
    if (data.effects.length === 1) {
      alert('An upgrade must have at least one effect!');
      return;
    }
    onChange({ effects: data.effects.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Upgrade Info</div>

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
          <label className="property-label">Description</label>
          <textarea
            className="property-textarea"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Icon</label>
          <IconField
            value={data.icon}
            onChange={icon => onChange({ icon })}
            placeholder="⬆️ or use pixel art"
          />
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Costs</div>

        <div className="builder-list">
          {data.cost.map((cost, idx) => (
            <div key={idx} className="builder-item">
              <CustomSelect
                options={resources.map(r => ({ value: r.id, label: r.name, icon: r.icon }))}
                value={cost.resourceId}
                onChange={value => updateCost(idx, 'resourceId', value)}
              />
              <input
                type="number"
                className="property-input"
                value={cost.amount}
                onChange={e => updateCost(idx, 'amount', parseFloat(e.target.value))}
              />
              <button className="builder-remove" onClick={() => removeCost(idx)}>×</button>
            </div>
          ))}
          <button className="builder-add" onClick={addCost}>+ Add Cost</button>
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Unlock Requirements</div>

        <div className="builder-list">
          {data.unlockRequirements.map((req, idx) => (
            <RequirementBuilder
              key={idx}
              requirement={req}
              resources={resources}
              buildings={buildings}
              onChange={updates => updateRequirement(idx, updates)}
              onRemove={() => removeRequirement(idx)}
            />
          ))}
          <button className="builder-add" onClick={addRequirement}>+ Add Requirement</button>
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Effects</div>

        <div className="builder-list">
          {data.effects.map((effect, idx) => (
            <div key={idx} className="builder-item-vertical">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CustomSelect
                  options={[
                    { value: 'multiply', label: 'Multiply' },
                    { value: 'add', label: 'Add' }
                  ]}
                  value={effect.type}
                  onChange={value => updateEffect(idx, 'type', value)}
                />
                <button className="builder-remove" onClick={() => removeEffect(idx)}>×</button>
              </div>
              <CustomSelect
                options={[
                  { value: 'production', label: 'Production' },
                  { value: 'click', label: 'Click Value' }
                ]}
                value={effect.target}
                onChange={value => updateEffect(idx, 'target', value)}
              />
              <input
                type="number"
                className="property-input"
                value={effect.value}
                onChange={e => updateEffect(idx, 'value', parseFloat(e.target.value))}
                placeholder="Value"
                step="0.1"
              />
            </div>
          ))}
          <button className="builder-add" onClick={addEffect}>+ Add Effect</button>
        </div>
      </div>
    </>
  );
}

// Achievement Properties
export function AchievementProperties({ data, resources, buildings, onChange }) {
  const addRequirement = () => {
    onChange({
      requirements: [
        ...data.requirements,
        { type: 'resource', resourceId: resources[0]?.id || 'coins', amount: 100 }
      ]
    });
  };

  const updateRequirement = (index, updates) => {
    const newReqs = [...data.requirements];
    newReqs[index] = { ...newReqs[index], ...updates };
    onChange({ requirements: newReqs });
  };

  const removeRequirement = (index) => {
    if (data.requirements.length === 1) {
      alert('An achievement must have at least one requirement!');
      return;
    }
    onChange({ requirements: data.requirements.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Achievement Info</div>

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
          <label className="property-label">Description</label>
          <textarea
            className="property-textarea"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="property-field">
          <label className="property-label">Icon</label>
          <IconField
            value={data.icon}
            onChange={icon => onChange({ icon })}
            placeholder="🏆 or use pixel art"
          />
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Unlock Requirements</div>

        <div className="builder-list">
          {data.requirements.map((req, idx) => (
            <RequirementBuilder
              key={idx}
              requirement={req}
              resources={resources}
              buildings={buildings}
              onChange={updates => updateRequirement(idx, updates)}
              onRemove={() => removeRequirement(idx)}
            />
          ))}
          <button className="builder-add" onClick={addRequirement}>+ Add Requirement</button>
        </div>
        <div className="property-hint">All requirements must be met</div>
      </div>
    </>
  );
}

// Requirement Builder Component
function RequirementBuilder({ requirement, resources, buildings, onChange, onRemove }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
      <div className="builder-item" style={{ gridTemplateColumns: '1fr auto' }}>
        <CustomSelect
          options={[
            { value: 'resource', label: 'Resource Amount' },
            { value: 'building', label: 'Building Count' },
            { value: 'totalClicks', label: 'Total Clicks' }
          ]}
          value={requirement.type}
          onChange={value => onChange({ type: value, resourceId: resources[0]?.id, buildingId: buildings[0]?.id, amount: 1 })}
        />
        <button className="builder-remove" onClick={onRemove}>×</button>
      </div>

      {requirement.type === 'resource' && (
        <div className="builder-item">
          <CustomSelect
            options={resources.map(r => ({ value: r.id, label: r.name, icon: r.icon }))}
            value={requirement.resourceId}
            onChange={value => onChange({ resourceId: value })}
          />
          <input
            type="number"
            className="property-input"
            value={requirement.amount}
            onChange={e => onChange({ amount: parseFloat(e.target.value) })}
            placeholder="Amount"
          />
        </div>
      )}

      {requirement.type === 'building' && (
        <div className="builder-item">
          <CustomSelect
            options={buildings.map(b => ({ value: b.id, label: b.name, icon: b.icon }))}
            value={requirement.buildingId}
            onChange={value => onChange({ buildingId: value })}
          />
          <input
            type="number"
            className="property-input"
            value={requirement.amount}
            onChange={e => onChange({ amount: parseFloat(e.target.value) })}
            placeholder="Count"
          />
        </div>
      )}

      {requirement.type === 'totalClicks' && (
        <input
          type="number"
          className="property-input"
          value={requirement.amount}
          onChange={e => onChange({ amount: parseFloat(e.target.value) })}
          placeholder="Number of clicks"
        />
      )}
    </div>
  );
}

// Color Picker Field with Presets
function ColorPickerField({ label, value, onChange }) {
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

// Theme Properties
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

// Theme Canvas - Enhanced Preview
export function ThemeCanvas({ theme }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
          My Idle Game
        </h1>
        <p style={{ opacity: 0.7, fontSize: '1rem' }}>
          Live theme preview - See your colors in action!
        </p>
      </div>

      {/* Resource Display */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
        border: `2px solid ${theme.primaryColor}`,
        borderRadius: theme.borderRadius,
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🪙</div>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          1,234,567
        </div>
        <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>Coins</div>
        <div style={{ color: theme.accentColor, fontSize: '0.875rem', marginTop: '0.5rem' }}>
          +100 per second
        </div>
      </div>

      {/* Building Card */}
      <div style={{
        background: `${theme.backgroundColor}dd`,
        border: `1px solid ${theme.primaryColor}40`,
        borderRadius: theme.borderRadius,
        padding: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '2rem' }}>👆</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Auto-Clicker</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Produces +1 coin/sec</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Owned: 10</div>
          </div>
        </div>
        <button style={{
          backgroundColor: theme.primaryColor,
          color: theme.textColor,
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: theme.borderRadius,
          fontFamily: theme.fontFamily,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${theme.primaryColor}40`
        }}>
          Buy - 100 🪙
        </button>
      </div>

      {/* Upgrade Card */}
      <div style={{
        background: `${theme.backgroundColor}dd`,
        border: `1px solid ${theme.secondaryColor}40`,
        borderRadius: theme.borderRadius,
        padding: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '2rem' }}>⬆️</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Better Clicks</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Double click power</div>
          </div>
        </div>
        <button style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: theme.borderRadius,
          fontFamily: theme.fontFamily,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${theme.secondaryColor}40`
        }}>
          Buy - 500 🪙
        </button>
      </div>

      {/* Achievement Notification */}
      <div style={{
        background: theme.accentColor,
        color: theme.backgroundColor,
        padding: '1rem 1.5rem',
        borderRadius: theme.borderRadius,
        fontWeight: 600,
        textAlign: 'center',
        boxShadow: `0 8px 24px ${theme.accentColor}60`,
        marginBottom: '2rem'
      }}>
        🎉 Achievement Unlocked: First Click!
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { label: 'Total Clicks', value: '1,234' },
          { label: 'Buildings', value: '45' },
          { label: 'Upgrades', value: '12' },
          { label: 'Achievements', value: '8/20' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: `${theme.primaryColor}15`,
            border: `1px solid ${theme.primaryColor}30`,
            borderRadius: theme.borderRadius,
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
