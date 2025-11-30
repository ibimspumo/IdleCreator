import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterPlaytime',
  label: 'After Playtime',
  icon: '🕐',
  description: 'After X minutes played',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterPlaytime',
    minutes: 60
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Minutes:</label>
        <input
          className="nodrag"
          type="number"
          name="minutes"
          value={data.minutes || 60}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
