import React from 'react';
import { IconField } from '../shared/IconField';
import { FormField } from './FormField';

/**
 * BasePropertiesPanel - Common fields for all item types (id, name, description, icon)
 */
export function BasePropertiesPanel({ data, onChange, title = 'Item Info' }) {
  return (
    <div className="property-group">
      <div className="property-group-title">{title}</div>

      <FormField
        label="ID"
        value={data.id}
        onChange={(value) => onChange({ id: value })}
      />

      <FormField
        label="Name"
        value={data.name}
        onChange={(value) => onChange({ name: value })}
      />

      <FormField
        label="Description"
        type="textarea"
        value={data.description}
        onChange={(value) => onChange({ description: value })}
        rows={2}
      />

      <div className="property-field">
        <label className="property-label">Icon</label>
        <IconField
          icon={data.icon}
          onChange={(newIcon) => onChange({ icon: newIcon })}
        />
      </div>
    </div>
  );
}
