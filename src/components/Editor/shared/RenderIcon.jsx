import { PixelArtUtils } from '../PixelArtEditor'; // Adjusted path

// Helper: Render icon (pixel art or emoji) - for use in UI
export function RenderIcon({ icon, size = 20 }) {
  if (icon && icon.startsWith('8x8:')) {
    const grid = PixelArtUtils.decompress(icon);
    return (
      <canvas
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated', display: 'block' }}
        ref={canvas => {
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const ps = size / 8;
            for (let y = 0; y < 8; y++) {
              for (let x = 0; x < 8; x++) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(x * ps, y * ps, ps, ps);
              }
            }
          }
        }}
      />
    );
  }
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>{icon || '📦'}</span>;
}
