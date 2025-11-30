import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifProductionRate',
  label: 'If Production Rate',
  icon: '📊',
  description: 'Check production per second',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifProductionRate',
    resourceId: '',
    operator: '>=',
    perSecond: 1
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
        </select>
        <label>Per Second:</label>
        <input
          className="nodrag"
          type="number"
          name="perSecond"
          value={data.perSecond || 1}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
      </>
    );
  }
};
