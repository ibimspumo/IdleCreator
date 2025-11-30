import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'setClickPower',
  label: 'Set Click Power',
  icon: '👊',
  description: 'Change click power',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'setClickPower',
    clickAmount: 1
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Click Amount:</label>
        <input
          className="nodrag"
          type="number"
          name="clickAmount"
          value={data.clickAmount || 1}
          onChange={handleChange}
          min="1"
        />
      </>
    );
  }
};
