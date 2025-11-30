import { useState } from 'react'; // UpgradeProperties uses useState indirectly through CustomSelect and IconField
import CustomSelect from '../CustomSelect';
import { IconField } from '../shared/IconField'; // Adjusted path
import { RequirementBuilder } from '../shared/RequirementBuilder'; // Adjusted path
import { RenderIcon } from '../shared/RenderIcon'; // Adjusted path


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
