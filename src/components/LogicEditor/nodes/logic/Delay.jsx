import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'delay',
  label: 'Delay',
  icon: '⏳',
  description: 'Wait before continuing',
  category: 'logic',
  type: 'logic',
  defaultData: {
    logicType: 'delay',
    duration: 1
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Duration (seconds):</label>
        <input
          className="nodrag"
          type="number"
          name="duration"
          value={data.duration || 1}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
      </>
    );
  }
};
