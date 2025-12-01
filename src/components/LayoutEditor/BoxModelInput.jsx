import { useState, useEffect } from 'react';

export function BoxModelInput({ value = '0px', onChange, position }) {
  const [numValue, setNumValue] = useState('');
  const [unit, setUnit] = useState('px');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Parse value to separate number and unit
    if (!value) {
      setNumValue('0');
      setUnit('px');
      return;
    }

    const match = String(value).match(/^(-?\d*\.?\d+)(.*)$/);
    if (match) {
      setNumValue(match[1]);
      setUnit(match[2] || 'px');
    } else {
      setNumValue('0');
      setUnit('px');
    }
  }, [value]);

  const handleNumChange = (e) => {
    const newNum = e.target.value;
    setNumValue(newNum);
    onChange(`${newNum}${unit}`);
  };

  const handleUnitSelect = (newUnit) => {
    setUnit(newUnit);
    onChange(`${numValue}${newUnit}`);
    setIsOpen(false);
  };

  const units = ['px', 'em', 'rem', '%', 'vh', 'vw'];

  return (
    <div className={`box-model-input ${position}`}>
      <input
        type="number"
        className="box-input"
        value={numValue}
        onChange={handleNumChange}
      />
      <div className="box-unit-selector">
        <button
          className="box-unit-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {unit}
        </button>
        {isOpen && (
          <>
            <div className="box-unit-overlay" onClick={() => setIsOpen(false)} />
            <div className="box-unit-dropdown">
              {units.map(u => (
                <button
                  key={u}
                  className={`box-unit-option ${unit === u ? 'active' : ''}`}
                  onClick={() => handleUnitSelect(u)}
                >
                  {u}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
