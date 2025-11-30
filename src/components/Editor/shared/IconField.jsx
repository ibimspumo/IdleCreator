import { useState } from 'react';
import PixelArtEditor from '../PixelArtEditor';
import { RenderIcon } from './RenderIcon'; // Import shared RenderIcon


// Helper: Icon Input Field with Pixel Art Button
export function IconField({ value, onChange, placeholder = '🎨 or use pixel art' }) {
  const [showPixelEditor, setShowPixelEditor] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          className="property-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <button
          className="btn-secondary"
          onClick={() => setShowPixelEditor(true)}
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
        >
          Pixel Art
        </button>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Preview:</span>
        <RenderIcon icon={value} size={32} /> {/* Use shared RenderIcon for preview */}
      </div>

      {showPixelEditor && (
        <PixelArtEditor
          value={value}
          onChange={icon => {
            onChange(icon);
            setShowPixelEditor(false);
          }}
          onClose={() => setShowPixelEditor(false)}
        />
      )}
    </>
  );
}
