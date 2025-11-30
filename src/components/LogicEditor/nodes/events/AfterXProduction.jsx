import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXProduction',
  label: 'After X Production',
  icon: '🏭',
  description: 'After producing X total',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXProduction',
    resourceId: '',
    totalProduced: 10000
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
        <label>Total Produced:</label>
        <input
          className="nodrag"
          type="number"
          name="totalProduced"
          value={data.totalProduced || 10000}
          onChange={handleChange}
          min="0"
        />
      </>
    );
  }
};
