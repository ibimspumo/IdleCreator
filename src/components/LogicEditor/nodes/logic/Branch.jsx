import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'branch',
  label: 'Branch',
  icon: '🌳',
  description: 'Multiple output paths',
  category: 'logic',
  type: 'logic',
  defaultData: {
    logicType: 'branch',
    outputCount: 3
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Outputs:</label>
        <input
          className="nodrag"
          type="number"
          name="outputCount"
          value={data.outputCount || 3}
          onChange={handleChange}
          min="2"
          max="5"
        />
      </>
    );
  }
};
