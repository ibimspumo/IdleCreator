import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'removeResource',
  label: 'Remove Resource',
  icon: '➖',
  description: 'Remove resource amount',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'removeResource',
    resourceId: '',
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
