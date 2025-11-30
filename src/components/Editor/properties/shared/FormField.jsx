import React from 'react';

/**
 * FormField - Generic input field component
 */
export function FormField({ label, type = 'text', value, onChange, rows, ...props }) {
  if (type === 'textarea') {
    return (
      <div className="property-field">
        <label className="property-label">{label}</label>
        <textarea
          className="property-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows || 2}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="property-field">
      <label className="property-label">{label}</label>
      <input
        type={type}
        className="property-input"
        value={value}
        onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        {...props}
      />
    </div>
  );
}
