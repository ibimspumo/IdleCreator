import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXBoughtUpgrades',
  label: 'After X Bought Upgrades',
  icon: '📦',
  description: 'After buying X upgrades',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXBoughtUpgrades',
    upgradeCount: 5
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Upgrade Count:</label>
        <input
          className="nodrag"
          type="number"
          name="upgradeCount"
          value={data.upgradeCount || 5}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
