import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifPrestigeLevel',
  label: 'If Prestige Level',
  icon: '⭐',
  description: 'Check prestige level',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifPrestigeLevel',
    operator: '>=',
    level: 1
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
          <option value="==">=</option>
        </select>
        <label>Level:</label>
        <input
          className="nodrag"
          type="number"
          name="level"
          value={data.level || 1}
          onChange={handleChange}
          min="0"
        />
      </>
    );
  }
};
