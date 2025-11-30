import React from 'react';
import { AchievementCard } from '../components/AchievementCard';

/**
 * AchievementsPanel - Displays the achievements list
 */
export function AchievementsPanel({ gameData, gameState }) {
  return (
    <div className="achievements-list">
      {gameData.achievements.map(ach => {
        const achState = gameState.achievements[ach.id];
        const isUnlocked = achState?.unlocked;

        return (
          <AchievementCard
            key={ach.id}
            achievement={ach}
            isUnlocked={isUnlocked}
          />
        );
      })}
    </div>
  );
}
