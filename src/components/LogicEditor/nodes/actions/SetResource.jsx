import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'setResource',
  label: 'Set Resource',
  icon: '🔢',
  description: 'Set resource to value',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'setResource',
    resourceId: '',
    value: 0
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
        <label>Value:</label>
        <input
          className="nodrag"
          type="number"
          name="value"
          value={data.value || 0}
          onChange={handleChange}
        />
      </>
    );
  }
};
