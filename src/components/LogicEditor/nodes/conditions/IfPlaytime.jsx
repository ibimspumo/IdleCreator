import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifPlaytime',
  label: 'If Playtime',
  icon: '⏲️',
  description: 'Check total playtime',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifPlaytime',
    operator: '>=',
    minutes: 60
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Operator:</label>
        <select
          className="nodrag"
          name="operator"
          value={data.operator || '>='}
          onChange={handleChange}
        >
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <label>Minutes:</label>
        <input
          className="nodrag"
          type="number"
          name="minutes"
          value={data.minutes || 60}
          onChange={handleChange}
          min="0"
        />
      </>
    );
  }
};
