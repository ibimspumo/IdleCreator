import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'loop',
  label: 'Loop',
  icon: '🔄',
  description: 'Repeat actions X times',
  category: 'logic',
  type: 'logic',
  defaultData: {
    logicType: 'loop',
    repeatCount: 5
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Repeat Count:</label>
        <input
          className="nodrag"
          type="number"
          name="repeatCount"
          value={data.repeatCount || 5}
          onChange={handleChange}
          min="1"
          max="100"
        />
      </>
    );
  }
};
