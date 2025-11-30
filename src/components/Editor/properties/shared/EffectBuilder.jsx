import React from 'react';
import CustomSelect from '../../CustomSelect';
import { RenderIcon } from '../../shared/RenderIcon';

/**
 * EffectBuilder - Reusable component for building effect arrays
 */
export function EffectBuilder({ effects, resources, onChange }) {
  const addEffect = () => {
    onChange([...effects, { type: 'multiply', target: 'production', resourceId: resources[0]?.id || 'coins', value: 2 }]);
  };

  const updateEffect = (index, field, value) => {
    const newEffects = [...effects];
    newEffects[index] = { ...newEffects[index], [field]: value };
    onChange(newEffects);
  };

  const removeEffect = (index) => {
    onChange(effects.filter((_, i) => i !== index));
  };

  return (
    <div className="property-group">
      <div className="property-group-title">Effects</div>
      {effects.map((effect, index) => (
        <div key={index} className="array-item">
          <div className="array-item-header">
            <span className="array-item-index">Effect {index + 1}</span>
            <button
              type="button"
              className="icon-button delete-button"
              onClick={() => removeEffect(index)}
              title="Remove effect"
            >
              ✕
            </button>
          </div>

          <div className="property-field">
            <label className="property-label">Type</label>
            <select
              className="property-select"
              value={effect.type}
              onChange={(e) => updateEffect(index, 'type', e.target.value)}
            >
              <option value="multiply">Multiply</option>
              <option value="add">Add</option>
            </select>
          </div>

          <div className="property-field">
            <label className="property-label">Target</label>
            <select
              className="property-select"
              value={effect.target}
              onChange={(e) => updateEffect(index, 'target', e.target.value)}
            >
              <option value="production">Production</option>
              <option value="click">Click Power</option>
            </select>
          </div>

          {effect.target === 'production' && (
            <div className="property-field">
              <label className="property-label">Resource (Optional)</label>
              <CustomSelect
                value={effect.resourceId || ''}
                onChange={(newValue) => updateEffect(index, 'resourceId', newValue || null)}
                options={[
                  { value: '', label: 'All Resources', icon: null },
                  ...resources.map(r => ({
                    value: r.id,
                    label: r.name,
                    icon: r.icon
                  }))
                ]}
                renderOption={(option) => (
                  <>
                    {option.icon && <RenderIcon icon={option.icon} size={16} />}
                    <span>{option.label}</span>
                  </>
                )}
              />
            </div>
          )}

          <div className="property-field">
            <label className="property-label">Value</label>
            <input
              type="number"
              className="property-input"
              value={effect.value}
              onChange={(e) => updateEffect(index, 'value', parseFloat(e.target.value) || 1)}
              step={effect.type === 'multiply' ? '0.1' : '1'}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={addEffect}
      >
        + Add Effect
      </button>
    </div>
  );
}
