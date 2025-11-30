import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifResource',
  label: 'If Resource',
  icon: '💎',
  description: 'Check resource amount',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifResource',
    resourceId: '',
    operator: '>=',
    amount: 0
  },
  component: ({ id, data, updateNodeData }) => {
    const { gameData } = useContext(GameDataContext);
    const resources = gameData?.resources || [];
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Resource:</label>
        <select
          className="nodrag"
          name="resourceId"
          value={data.resourceId || ''}
          onChange={handleChange}
        >
          {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
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
        <label>Amount:</label>
        <input
          className="nodrag"
          type="number"
          name="amount"
          value={data.amount || 0}
          onChange={handleChange}
        />
      </>
    );
  }
};
