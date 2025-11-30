import { useState, useRef, useEffect } from 'react';
import { RenderIcon } from './shared/RenderIcon'; // Import shared RenderIcon
import '../../styles/custom-select.css';

/**
 * Custom Select Component with Icon Support
 *
 * @param {Object} props
 * @param {Array} props.options - Array of {value, label, icon?}
 * @param {string} props.value - Currently selected value
 * @param {function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 */
export default function CustomSelect({ options = [], value, onChange, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select" ref={dropdownRef}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-selected">
          {selectedOption ? (
            <>
              {selectedOption.icon && <RenderIcon icon={selectedOption.icon} size={20} />}
              <span className="custom-select-label">{selectedOption.label}</span>
            </>
          ) : (
            <span className="custom-select-placeholder">{placeholder}</span>
          )}
        </div>
        <span className="custom-select-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && <RenderIcon icon={option.icon} size={20} />}
              <span className="custom-select-label">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
