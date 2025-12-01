import { useState, useEffect } from 'react';

export function UnitInput({ value = '0', onChange, placeholder = '0', className = 'prop-input' }) {
  const [numValue, setNumValue] = useState('');
  const [unit, setUnit] = useState('px');

  useEffect(() => {
    // Parse value to separate number and unit
    if (!value || value === 'auto' || value === 'none') {
      setNumValue(value);
      setUnit('px');
      return;
    }

    const match = String(value).match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      setNumValue(match[1]);
      setUnit(match[2] || 'px');
    } else {
      setNumValue(value);
      setUnit('px');
    }
  }, [value]);

  const handleNumChange = (e) => {
    const newNum = e.target.value;
    setNumValue(newNum);

    if (newNum === 'auto' || newNum === 'none' || newNum === '') {
      onChange(newNum);
    } else {
      onChange(`${newNum}${unit}`);
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);

    if (numValue && numValue !== 'auto' && numValue !== 'none') {
      onChange(`${numValue}${newUnit}`);
    }
  };

  return (
    <div className="unit-input-wrapper">
      <input
        type="text"
        className={className}
        value={numValue}
        onChange={handleNumChange}
        placeholder={placeholder}
      />
      <select
        className="unit-select"
        value={unit}
        onChange={handleUnitChange}
        disabled={numValue === 'auto' || numValue === 'none' || !numValue}
      >
        <option value="px">px</option>
        <option value="em">em</option>
        <option value="rem">rem</option>
        <option value="%">%</option>
        <option value="vh">vh</option>
        <option value="vw">vw</option>
      </select>
    </div>
  );
}
