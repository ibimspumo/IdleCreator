// Theme Canvas - Enhanced Preview
export function ThemeCanvas({ theme }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
          My Idle Game
        </h1>
        <p style={{ opacity: 0.7, fontSize: '1rem' }}>
          Live theme preview - See your colors in action!
        </p>
      </div>

      {/* Resource Display */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
        border: `2px solid ${theme.primaryColor}`,
        borderRadius: theme.borderRadius,
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🪙</div>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          1,234,567
        </div>
        <div style={{ opacity: 0.7, fontSize: '0.875rem' }}>Coins</div>
        <div style={{ color: theme.accentColor, fontSize: '0.875rem', marginTop: '0.5rem' }}>
          +100 per second
        </div>
      </div>

      {/* Building Card */}
      <div style={{
        background: `${theme.backgroundColor}dd`,
        border: `1px solid ${theme.primaryColor}40`,
        borderRadius: theme.borderRadius,
        padding: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '2rem' }}>👆</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Auto-Clicker</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Produces +1 coin/sec</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Owned: 10</div>
          </div>
        </div>
        <button style={{
          backgroundColor: theme.primaryColor,
          color: theme.textColor,
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: theme.borderRadius,
          fontFamily: theme.fontFamily,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${theme.primaryColor}40`
        }}>
          Buy - 100 🪙
        </button>
      </div>

      {/* Upgrade Card */}
      <div style={{
        background: `${theme.backgroundColor}dd`,
        border: `1px solid ${theme.secondaryColor}40`,
        borderRadius: theme.borderRadius,
        padding: '1.5rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '2rem' }}>⬆️</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Better Clicks</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Double click power</div>
          </div>
        </div>
        <button style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: theme.borderRadius,
          fontFamily: theme.fontFamily,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 12px ${theme.secondaryColor}40`
        }}>
          Buy - 500 🪙
        </button>
      </div>

      {/* Achievement Notification */}
      <div style={{
        background: theme.accentColor,
        color: theme.backgroundColor,
        padding: '1rem 1.5rem',
        borderRadius: theme.borderRadius,
        fontWeight: 600,
        textAlign: 'center',
        boxShadow: `0 8px 24px ${theme.accentColor}60`,
        marginBottom: '2rem'
      }}>
        🎉 Achievement Unlocked: First Click!
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { label: 'Total Clicks', value: '1,234' },
          { label: 'Buildings', value: '45' },
          { label: 'Upgrades', value: '12' },
          { label: 'Achievements', value: '8/20' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: `${theme.primaryColor}15`,
            border: `1px solid ${theme.primaryColor}30`,
            borderRadius: theme.borderRadius,
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
