import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'addProduction',
  label: 'Add Production',
  icon: '📈',
  description: 'Add production per second',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'addProduction',
    resourceId: '',
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
