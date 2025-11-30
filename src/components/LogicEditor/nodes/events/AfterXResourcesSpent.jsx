import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXResourcesSpent',
  label: 'After X Resources Spent',
  icon: '💸',
  description: 'After spending resources',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXResourcesSpent',
    resourceId: '',
    amountSpent: 1000
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
        <label>Amount Spent:</label>
        <input
          className="nodrag"
          type="number"
          name="amountSpent"
          value={data.amountSpent || 1000}
          onChange={handleChange}
          min="0"
        />
      </>
    );
  }
};
