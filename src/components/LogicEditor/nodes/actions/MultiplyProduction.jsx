import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'multiplyProduction',
  label: 'Multiply Production',
  icon: '🚀',
  description: 'Multiply production rate',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'multiplyProduction',
    resourceId: '',
    multiplier: 2
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
        <label>Multiplier:</label>
        <input
          className="nodrag"
          type="number"
          name="multiplier"
          value={data.multiplier || 2}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
      </>
    );
  }
};
