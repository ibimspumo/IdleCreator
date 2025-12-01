import { useState, useEffect } from 'react';

export function SpacingPopover({ value, onChange, label, onClose }) {
  const [numValue, setNumValue] = useState('0');
  const [unit, setUnit] = useState('px');

  useEffect(() => {
    // Parse initial value
    if (!value || value === '0') {
      setNumValue('0');
      setUnit('px');
      return;
    }

    const match = String(value).match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      setNumValue(match[1]);
      setUnit(match[2] || 'px');
    }
  }, [value]);

  const handleNumChange = (e) => {
    const newNum = e.target.value;
    setNumValue(newNum);
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  const handleApply = () => {
    onChange(`${numValue}${unit}`);
    onClose();
  };

  const quickValues = ['0', '0.125', '0.25', '0.5', '1', '2', '4', '8'];

  return (
    <div className="spacing-popover">
      <div className="spacing-popover-header">
        <span className="spacing-label">{label}</span>
        <button className="popover-close" onClick={onClose}>✕</button>
      </div>

      <div className="spacing-input-group">
        <input
          type="number"
          className="spacing-number-input"
          value={numValue}
          onChange={handleNumChange}
          autoFocus
        />
        <select
          className="spacing-unit-select"
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value)}
        >
          <option value="px">PX</option>
          <option value="em">EM</option>
          <option value="rem">REM</option>
          <option value="%">%</option>
          <option value="vh">VH</option>
          <option value="vw">VW</option>
        </select>
      </div>

      <div className="spacing-quick-values">
        {quickValues.map(val => (
          <button
            key={val}
            className={`quick-value-btn ${numValue === val ? 'active' : ''}`}
            onClick={() => setNumValue(val)}
          >
            {val}
          </button>
        ))}
      </div>

      <div className="spacing-popover-footer">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-apply" onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
}
