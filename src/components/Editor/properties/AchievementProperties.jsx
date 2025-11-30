import { useState } from 'react'; // AchievementProperties uses useState indirectly through CustomSelect and IconField
import CustomSelect from '../CustomSelect';
import { IconField } from '../shared/IconField'; // Adjusted path
import { RequirementBuilder } from '../shared/RequirementBuilder'; // Adjusted path
import { RenderIcon } from '../shared/RenderIcon'; // Adjusted path


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
