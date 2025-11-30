import React from 'react';
import CustomSelect from '../../CustomSelect';
import { RenderIcon } from '../../shared/RenderIcon';

/**
 * CostBuilder - Reusable component for building cost arrays
 */
export function CostBuilder({ costs, resources, onChange, minItems = 1, label = 'Costs' }) {
  const addCost = () => {
    onChange([...costs, { resourceId: resources[0]?.id || 'coins', baseAmount: 10 }]);
  };

  const updateCost = (index, field, value) => {
    const newCosts = [...costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onChange(newCosts);
  };

  const removeCost = (index) => {
    if (costs.length <= minItems) {
      alert(`You must have at least ${minItems} cost item(s)!`);
      return;
    }
    onChange(costs.filter((_, i) => i !== index));
  };

  return (
    <div className="property-group">
      <div className="property-group-title">{label}</div>
      {costs.map((cost, index) => (
        <div key={index} className="array-item">
          <div className="array-item-header">
            <span className="array-item-index">Cost {index + 1}</span>
            <button
              type="button"
              className="icon-button delete-button"
              onClick={() => removeCost(index)}
              title="Remove cost"
            >
              ✕
            </button>
          </div>

          <div className="property-field">
            <label className="property-label">Resource</label>
            <CustomSelect
              value={cost.resourceId}
              onChange={(newValue) => updateCost(index, 'resourceId', newValue)}
              options={resources.map(r => ({
                value: r.id,
                label: r.name,
                icon: r.icon
              }))}
              renderOption={(option) => (
                <>
                  <RenderIcon icon={option.icon} size={16} />
                  <span>{option.label}</span>
                </>
              )}
            />
          </div>

          <div className="property-field">
            <label className="property-label">Base Amount</label>
            <input
              type="number"
              className="property-input"
              value={cost.baseAmount}
              onChange={(e) => updateCost(index, 'baseAmount', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={addCost}
      >
        + Add Cost
      </button>
    </div>
  );
}
