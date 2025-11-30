import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXResources',
  label: 'After X Resources',
  icon: '💰',
  description: 'After reaching amount',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXResources',
    resourceId: '',
    amount: 100
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
          value={data.amount || 100}
          onChange={handleChange}
          min="0"
        />
      </>
    );
  }
};
