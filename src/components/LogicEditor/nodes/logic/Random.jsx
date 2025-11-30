import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'random',
  label: 'Random',
  icon: '🎲',
  description: 'Random chance branch',
  category: 'logic',
  type: 'logic',
  defaultData: {
    logicType: 'random',
    chance: 50
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Chance (%):</label>
        <input
          className="nodrag"
          type="number"
          name="chance"
          value={data.chance || 50}
          onChange={handleChange}
          min="0"
          max="100"
        />
      </>
    );
  }
};
