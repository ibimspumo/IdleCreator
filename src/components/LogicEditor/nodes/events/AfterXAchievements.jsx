import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXAchievements',
  label: 'After X Achievements',
  icon: '🎖️',
  description: 'After unlocking X achievements',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXAchievements',
    achievementCount: 5
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Achievement Count:</label>
        <input
          className="nodrag"
          type="number"
          name="achievementCount"
          value={data.achievementCount || 5}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
