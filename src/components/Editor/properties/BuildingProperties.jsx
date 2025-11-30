import { useState } from 'react'; // BuildingProperties uses useState indirectly through CustomSelect and IconField
import CustomSelect from '../CustomSelect';
import { IconField } from '../shared/IconField'; // Adjusted path
import { RenderIcon } from '../shared/RenderIcon'; // Adjusted path

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
