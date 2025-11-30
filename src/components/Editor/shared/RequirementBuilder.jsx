import { useState } from 'react'; // RequirementBuilder uses useState indirectly through CustomSelect
import CustomSelect from '../CustomSelect'; // Adjusted path
import { RenderIcon } from './RenderIcon'; // RenderIcon might be used if options for CustomSelect have icons

// Requirement Builder Component
export function RequirementBuilder({ requirement, resources, buildings, onChange, onRemove }) {
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
