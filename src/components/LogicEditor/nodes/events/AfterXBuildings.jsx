import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXBuildings',
  label: 'After X Buildings',
  icon: '🏘️',
  description: 'After owning X buildings',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXBuildings',
    buildingCount: 10
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Building Count:</label>
        <input
          className="nodrag"
          type="number"
          name="buildingCount"
          value={data.buildingCount || 10}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
