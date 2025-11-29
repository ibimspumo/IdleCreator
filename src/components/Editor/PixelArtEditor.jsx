import { useState, useRef, useEffect } from 'react';
import '../../styles/pixel-editor.css';

// Pixel Art Utilities
export const PixelArtUtils = {
  // Komprimiert ein 8x8 Grid zu einem String
  compress(grid) {
    // Format: "8x8:palette|pixelData"
    // palette: Farben getrennt durch ','
    // pixelData: Index der Farbe für jedes Pixel (base36)

    const uniqueColors = [...new Set(grid.flat())];
    const palette = uniqueColors.join(',');

    const pixelData = grid.flat().map(color => {
      const index = uniqueColors.indexOf(color);
      return index.toString(36); // Base36 (0-9, a-z)
    }).join('');

    return `8x8:${palette}|${pixelData}`;
  },

  // Dekomprimiert einen String zu einem 8x8 Grid
  decompress(compressed) {
    if (!compressed || !compressed.startsWith('8x8:')) {
      return this.createEmptyGrid();
    }

    try {
      const [header, data] = compressed.split(':');
      const [palette, pixelData] = data.split('|');
      const colors = palette.split(',');

      const pixels = pixelData.split('').map(char => {
        const index = parseInt(char, 36);
        return colors[index] || '#000000';
      });

      const grid = [];
      for (let y = 0; y < 8; y++) {
        grid[y] = pixels.slice(y * 8, (y + 1) * 8);
      }

      return grid;
    } catch (e) {
      console.error('Failed to decompress pixel art:', e);
      return this.createEmptyGrid();
    }
  },

  // Erstellt ein leeres Grid
  createEmptyGrid(color = '#000000') {
    return Array(8).fill(null).map(() => Array(8).fill(color));
  },

  // Rendert Pixel Art zu Canvas (für Preview)
  renderToCanvas(grid, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const pixelSize = size / 8;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    return canvas.toDataURL();
  },

  // Konvertiert zu Emoji-ähnlichem Unicode (optional)
  toEmoji(grid) {
    // Für später: Könnte man ein custom emoji generieren
    return '🎨';
  }
};

// Preset Farben
const DEFAULT_PALETTE = [
  '#000000', // Schwarz
  '#FFFFFF', // Weiß
  '#FF0000', // Rot
  '#00FF00', // Grün
  '#0000FF', // Blau
  '#FFFF00', // Gelb
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
];

function PixelArtEditor({ value, onChange, onClose }) {
  const [grid, setGrid] = useState(() => {
    if (value && typeof value === 'string' && value.startsWith('8x8:')) {
      return PixelArtUtils.decompress(value);
    }
    return PixelArtUtils.createEmptyGrid('#FFFFFF');
  });

  const [selectedColor, setSelectedColor] = useState('#000000');
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [tool, setTool] = useState('draw'); // 'draw', 'erase', 'fill'
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const pixelSize = 32; // Größe eines Pixels in px

  // Zeichne Grid auf Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichne Pixels
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Zeichne Grid Lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pixelSize, 0);
      ctx.lineTo(i * pixelSize, 8 * pixelSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * pixelSize);
      ctx.lineTo(8 * pixelSize, i * pixelSize);
      ctx.stroke();
    }
  }, [grid]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      drawPixel(x, y);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    handleCanvasClick(e);
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawPixel = (x, y) => {
    const newGrid = grid.map(row => [...row]);

    if (tool === 'draw') {
      newGrid[y][x] = selectedColor;
    } else if (tool === 'erase') {
      newGrid[y][x] = '#FFFFFF';
    } else if (tool === 'fill') {
      const targetColor = grid[y][x];
      floodFill(newGrid, x, y, targetColor, selectedColor);
    }

    setGrid(newGrid);
  };

  const floodFill = (grid, x, y, targetColor, fillColor) => {
    if (x < 0 || x >= 8 || y < 0 || y >= 8) return;
    if (grid[y][x] !== targetColor || grid[y][x] === fillColor) return;

    grid[y][x] = fillColor;

    floodFill(grid, x + 1, y, targetColor, fillColor);
    floodFill(grid, x - 1, y, targetColor, fillColor);
    floodFill(grid, x, y + 1, targetColor, fillColor);
    floodFill(grid, x, y - 1, targetColor, fillColor);
  };

  const handleClear = () => {
    setGrid(PixelArtUtils.createEmptyGrid('#FFFFFF'));
  };

  const handleAddColor = () => {
    const color = prompt('Enter hex color (e.g. #FF5733):', '#FF5733');
    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      setPalette([...palette, color]);
      setSelectedColor(color);
    }
  };

  const handleSave = () => {
    const compressed = PixelArtUtils.compress(grid);
    onChange(compressed);
    if (onClose) onClose();
  };

  const handleInvert = () => {
    const newGrid = grid.map(row =>
      row.map(color => {
        // Invertiere Farbe
        const hex = color.replace('#', '');
        const r = 255 - parseInt(hex.substr(0, 2), 16);
        const g = 255 - parseInt(hex.substr(2, 2), 16);
        const b = 255 - parseInt(hex.substr(4, 2), 16);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      })
    );
    setGrid(newGrid);
  };

  const handleMirrorH = () => {
    const newGrid = grid.map(row => [...row].reverse());
    setGrid(newGrid);
  };

  const handleMirrorV = () => {
    const newGrid = [...grid].reverse();
    setGrid(newGrid);
  };

  return (
    <div className="pixel-art-editor-overlay" onClick={onClose}>
      <div className="pixel-art-editor" onClick={e => e.stopPropagation()}>
        <div className="pixel-editor-header">
          <h3>Pixel Art Icon Editor</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="pixel-editor-content">
          <div className="pixel-editor-left">
            {/* Tools */}
            <div className="tools-section">
              <div className="section-title">Tools</div>
              <div className="tools-grid">
                <button
                  className={`tool-btn ${tool === 'draw' ? 'active' : ''}`}
                  onClick={() => setTool('draw')}
                  title="Draw"
                >
                  ✏️
                </button>
                <button
                  className={`tool-btn ${tool === 'erase' ? 'active' : ''}`}
                  onClick={() => setTool('erase')}
                  title="Erase"
                >
                  🧹
                </button>
                <button
                  className={`tool-btn ${tool === 'fill' ? 'active' : ''}`}
                  onClick={() => setTool('fill')}
                  title="Fill"
                >
                  🪣
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="palette-section">
              <div className="section-title">Colors</div>
              <div className="palette-grid">
                {palette.map((color, idx) => (
                  <button
                    key={idx}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
                <button className="color-btn add-color" onClick={handleAddColor}>
                  +
                </button>
              </div>
              <div className="selected-color-display">
                <div className="color-preview" style={{ backgroundColor: selectedColor }} />
                <span>{selectedColor}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section">
              <div className="section-title">Actions</div>
              <button className="action-btn" onClick={handleClear}>Clear</button>
              <button className="action-btn" onClick={handleInvert}>Invert</button>
              <button className="action-btn" onClick={handleMirrorH}>Mirror H</button>
              <button className="action-btn" onClick={handleMirrorV}>Mirror V</button>
            </div>
          </div>

          <div className="pixel-editor-center">
            <canvas
              ref={canvasRef}
              width={8 * pixelSize}
              height={8 * pixelSize}
              className="pixel-canvas"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="pixel-editor-right">
            <div className="preview-section">
              <div className="section-title">Preview</div>
              <div className="preview-sizes">
                <div className="preview-item">
                  <div className="preview-label">16x16</div>
                  <canvas
                    width={16}
                    height={16}
                    ref={canvas => {
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        const ps = 2;
                        for (let y = 0; y < 8; y++) {
                          for (let x = 0; x < 8; x++) {
                            ctx.fillStyle = grid[y][x];
                            ctx.fillRect(x * ps, y * ps, ps, ps);
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="preview-item">
                  <div className="preview-label">32x32</div>
                  <canvas
                    width={32}
                    height={32}
                    ref={canvas => {
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        const ps = 4;
                        for (let y = 0; y < 8; y++) {
                          for (let x = 0; x < 8; x++) {
                            ctx.fillStyle = grid[y][x];
                            ctx.fillRect(x * ps, y * ps, ps, ps);
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="preview-item">
                  <div className="preview-label">64x64</div>
                  <canvas
                    width={64}
                    height={64}
                    ref={canvas => {
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        const ps = 8;
                        for (let y = 0; y < 8; y++) {
                          for (let x = 0; x < 8; x++) {
                            ctx.fillStyle = grid[y][x];
                            ctx.fillRect(x * ps, y * ps, ps, ps);
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">Info</div>
              <div className="info-text">
                <small>Size: 8x8 pixels</small>
                <small>Compressed: ~{PixelArtUtils.compress(grid).length} chars</small>
              </div>
            </div>
          </div>
        </div>

        <div className="pixel-editor-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Icon</button>
        </div>
      </div>
    </div>
  );
}

export default PixelArtEditor;
