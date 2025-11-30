import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'onAchievementUnlock',
  label: 'On Achievement Unlock',
  icon: '🏆',
  description: 'When achievement unlocks',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'onAchievementUnlock',
    achievementId: ''
  },
  component: ({ id, data, updateNodeData }) => {
    const { gameData } = useContext(GameDataContext);
    const achievements = gameData?.achievements || [];
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Achievement:</label>
        <select
          className="nodrag"
          name="achievementId"
          value={data.achievementId || ''}
          onChange={handleChange}
        >
          {achievements.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </>
    );
  }
};
