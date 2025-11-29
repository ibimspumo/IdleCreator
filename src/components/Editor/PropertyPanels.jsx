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

// Theme Properties
export function ThemeProperties({ theme, onChange }) {
  const presets = {
    dark: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8',
      backgroundColor: '#1f2937',
      textColor: '#f3f4f6',
      accentColor: '#fbbf24',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    },
    light: {
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    },
    cyber: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      backgroundColor: '#0f172a',
      textColor: '#e0e7ff',
      accentColor: '#06b6d4',
      fontFamily: '"Courier New", monospace',
      borderRadius: '4px'
    }
  };

  return (
    <>
      <div className="property-group">
        <div className="property-group-title">Presets</div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => onChange(presets.dark)}>Dark</button>
          <button className="btn-secondary" onClick={() => onChange(presets.light)}>Light</button>
          <button className="btn-secondary" onClick={() => onChange(presets.cyber)}>Cyber</button>
        </div>
      </div>

      <div className="divider" />

      <div className="property-group">
        <div className="property-group-title">Colors</div>

        <div className="property-field">
          <label className="property-label">Primary Color</label>
          <div className="property-color-input">
            <input
              type="color"
              className="property-color-picker"
              value={theme.primaryColor}
              onChange={e => onChange({ ...theme, primaryColor: e.target.value })}
            />
            <input
              type="text"
              className="property-input"
              value={theme.primaryColor}
              onChange={e => onChange({ ...theme, primaryColor: e.target.value })}
            />
          </div>
        </div>

        <div className="property-field">
          <label className="property-label">Secondary Color</label>
          <div className="property-color-input">
            <input
              type="color"
              className="property-color-picker"
              value={theme.secondaryColor}
              onChange={e => onChange({ ...theme, secondaryColor: e.target.value })}
            />
            <input
              type="text"
              className="property-input"
              value={theme.secondaryColor}
              onChange={e => onChange({ ...theme, secondaryColor: e.target.value })}
            />
          </div>
        </div>

        <div className="property-field">
          <label className="property-label">Background Color</label>
          <div className="property-color-input">
            <input
              type="color"
              className="property-color-picker"
              value={theme.backgroundColor}
              onChange={e => onChange({ ...theme, backgroundColor: e.target.value })}
            />
            <input
              type="text"
              className="property-input"
              value={theme.backgroundColor}
              onChange={e => onChange({ ...theme, backgroundColor: e.target.value })}
            />
          </div>
        </div>

        <div className="property-field">
          <label className="property-label">Text Color</label>
          <div className="property-color-input">
            <input
              type="color"
              className="property-color-picker"
              value={theme.textColor}
              onChange={e => onChange({ ...theme, textColor: e.target.value })}
            />
            <input
              type="text"
              className="property-input"
              value={theme.textColor}
              onChange={e => onChange({ ...theme, textColor: e.target.value })}
            />
          </div>
        </div>

        <div className="property-field">
          <label className="property-label">Accent Color</label>
          <div className="property-color-input">
            <input
              type="color"
              className="property-color-picker"
              value={theme.accentColor}
              onChange={e => onChange({ ...theme, accentColor: e.target.value })}
            />
            <input
              type="text"
              className="property-input"
              value={theme.accentColor}
              onChange={e => onChange({ ...theme, accentColor: e.target.value })}
            />
          </div>
        </div>
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

// Theme Canvas
export function ThemeCanvas({ theme }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Theme Preview</h2>

      <div
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
          borderRadius: theme.borderRadius,
          padding: '2rem',
          border: '1px solid var(--border-primary)'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Game Title</h3>
        <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>This is how your game will look with these theme settings.</p>

        <button
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.textColor,
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: theme.borderRadius,
            fontFamily: theme.fontFamily,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Primary Button
        </button>

        <div
          style={{
            backgroundColor: theme.accentColor,
            color: theme.backgroundColor,
            padding: '1rem',
            borderRadius: theme.borderRadius,
            fontWeight: 600,
            display: 'inline-block'
          }}
        >
          Achievement Unlocked!
        </div>
      </div>
    </div>
  );
}
