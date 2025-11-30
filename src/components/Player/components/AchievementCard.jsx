import React from 'react';
import { RenderIcon } from '../../Editor/shared/RenderIcon';

/**
 * AchievementCard - Displays an achievement card
 */
export function AchievementCard({ achievement, isUnlocked }) {
  return (
    <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon">
        <RenderIcon icon={achievement.icon} size={40} />
      </div>
      <div className="achievement-info">
        <h3 className="achievement-title">{achievement.name}</h3>
        <p className="achievement-description">{achievement.description}</p>
        {isUnlocked && (
          <div className="achievement-unlocked">✓ Unlocked</div>
        )}
      </div>
    </div>
  );
}
