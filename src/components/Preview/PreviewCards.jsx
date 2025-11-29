import { FormatUtils } from '../../utils/formatters';
import { PixelArtUtils } from '../Editor/PixelArtEditor';
import '../../styles/preview-cards.css';

// Helper to render icons (pixel art or emoji)
function RenderIcon({ icon, size = 48 }) {
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
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>{icon || '🎨'}</span>;
}

// Building Card Preview
export function BuildingCardPreview({ building, resources = [] }) {
  return (
    <div className="preview-card building-card-preview">
      <div className="preview-card-header">
        <div className="preview-card-icon">
          <RenderIcon icon={building.icon} size={48} />
        </div>
        <div className="preview-card-info">
          <h3>{building.name || 'Building Name'}</h3>
          <p>{building.description || 'Building description goes here.'}</p>
        </div>
      </div>

      <div className="preview-card-stats">
        <div className="stat-row">
          <span className="stat-label">Base Cost:</span>
          <div className="stat-value">
            {building.cost && building.cost.length > 0 ? (
              building.cost.map((cost, idx) => {
                const res = resources.find(r => r.id === cost.resourceId);
                return (
                  <span key={idx} className="cost-item">
                    <RenderIcon icon={res?.icon} size={16} />
                    {FormatUtils.formatNumber(cost.baseAmount)}
                  </span>
                );
              })
            ) : (
              <span className="empty-text">No cost defined</span>
            )}
          </div>
        </div>

        <div className="stat-row">
          <span className="stat-label">Cost Scaling:</span>
          <span className="stat-value">
            {building.costScaling ? `x${building.costScaling}` : 'x1.15 (default)'}
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Produces:</span>
          <div className="stat-value">
            {building.produces && building.produces.length > 0 ? (
              building.produces.map((prod, idx) => {
                const res = resources.find(r => r.id === prod.resourceId);
                return (
                  <span key={idx} className="production-item">
                    <RenderIcon icon={res?.icon} size={16} />
                    {FormatUtils.formatPerSecond(prod.amount)}
                  </span>
                );
              })
            ) : (
              <span className="empty-text">No production defined</span>
            )}
          </div>
        </div>
      </div>

      <div className="preview-card-footer">
        <button className="preview-buy-button" disabled>
          Buy (Preview)
        </button>
      </div>
    </div>
  );
}

// Upgrade Card Preview
export function UpgradeCardPreview({ upgrade, resources = [] }) {
  return (
    <div className="preview-card upgrade-card-preview">
      <div className="preview-card-header">
        <div className="preview-card-icon">
          <RenderIcon icon={upgrade.icon} size={48} />
        </div>
        <div className="preview-card-info">
          <h3>{upgrade.name || 'Upgrade Name'}</h3>
          <p>{upgrade.description || 'Upgrade description goes here.'}</p>
        </div>
      </div>

      <div className="preview-card-stats">
        <div className="stat-row">
          <span className="stat-label">Cost:</span>
          <div className="stat-value">
            {upgrade.cost && upgrade.cost.length > 0 ? (
              upgrade.cost.map((cost, idx) => {
                const res = resources.find(r => r.id === cost.resourceId);
                return (
                  <span key={idx} className="cost-item">
                    <RenderIcon icon={res?.icon} size={16} />
                    {FormatUtils.formatNumber(cost.amount)}
                  </span>
                );
              })
            ) : (
              <span className="empty-text">No cost defined</span>
            )}
          </div>
        </div>

        <div className="stat-row">
          <span className="stat-label">Effects:</span>
          <div className="stat-value">
            {upgrade.effects && upgrade.effects.length > 0 ? (
              upgrade.effects.map((effect, idx) => {
                const res = resources.find(r => r.id === effect.resourceId);
                return (
                  <div key={idx} className="effect-item">
                    {effect.type === 'multiply' && (
                      <>
                        Multiply {effect.target} {effect.resourceId && (
                          <>
                            for <RenderIcon icon={res?.icon} size={16} /> {res?.name}
                          </>
                        )} by x{effect.value}
                      </>
                    )}
                    {effect.type === 'add' && (
                      <>
                        Add {effect.value} to {effect.target} {effect.resourceId && (
                          <>
                            for <RenderIcon icon={res?.icon} size={16} /> {res?.name}
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="empty-text">No effects defined</span>
            )}
          </div>
        </div>

        {upgrade.unlockRequirements && upgrade.unlockRequirements.length > 0 && (
          <div className="stat-row">
            <span className="stat-label">Unlock Requirements:</span>
            <div className="stat-value">
              <span className="requirement-count">
                {upgrade.unlockRequirements.length} requirement(s)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="preview-card-footer">
        <button className="preview-buy-button" disabled>
          Buy (Preview)
        </button>
      </div>
    </div>
  );
}

// Achievement Card Preview
export function AchievementCardPreview({ achievement, resources = [] }) {
  return (
    <div className="preview-card achievement-card-preview">
      <div className="preview-card-header horizontal">
        <div className="preview-card-icon small">
          <RenderIcon icon={achievement.icon} size={32} />
        </div>
        <div className="preview-card-info">
          <h3>{achievement.name || 'Achievement Name'}</h3>
          <p>{achievement.description || 'Achievement description goes here.'}</p>
        </div>
      </div>

      {achievement.requirements && achievement.requirements.length > 0 && (
        <div className="preview-card-stats">
          <div className="stat-row">
            <span className="stat-label">Requirements:</span>
            <div className="stat-value">
              {achievement.requirements.map((req, idx) => (
                <div key={idx} className="requirement-item">
                  {req.type === 'resource' && (
                    <>
                      Have {FormatUtils.formatNumber(req.amount)} {
                        resources.find(r => r.id === req.resourceId)?.name || req.resourceId
                      }
                    </>
                  )}
                  {req.type === 'building' && (
                    <>
                      Own {req.amount} {req.buildingId}
                    </>
                  )}
                  {req.type === 'upgrade' && (
                    <>
                      Purchase upgrade: {req.upgradeId}
                    </>
                  )}
                  {req.type === 'totalClicks' && (
                    <>
                      Total {FormatUtils.formatNumber(req.amount)} clicks
                    </>
                  )}
                  {req.type === 'prestige' && (
                    <>
                      Prestige level {req.level}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Resource Display Preview
export function ResourcePreview({ resource }) {
  return (
    <div className="preview-card resource-preview">
      <div className="preview-resource-row">
        <div className="preview-resource-icon">
          <RenderIcon icon={resource.icon} size={32} />
        </div>
        <div className="preview-resource-info">
          <div className="preview-resource-name">{resource.name || 'Resource Name'}</div>
          <div className="preview-resource-amount">
            {FormatUtils.formatNumber(resource.startAmount || 0)}
          </div>
        </div>
      </div>

      {resource.clickable && (
        <div className="preview-clickable-badge">
          ⭐ Clickable (+{resource.clickAmount || 1} per click)
        </div>
      )}
    </div>
  );
}
