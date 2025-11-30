import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'unlockUpgrade',
  label: 'Unlock Upgrade',
  icon: '🔓',
  description: 'Unlock an upgrade',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'unlockUpgrade',
    upgradeId: ''
  },
  component: ({ id, data, updateNodeData }) => {
    const { gameData } = useContext(GameDataContext);
    const upgrades = gameData?.upgrades || [];
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Upgrade:</label>
        <select
          className="nodrag"
          name="upgradeId"
          value={data.upgradeId || ''}
          onChange={handleChange}
        >
          {upgrades.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </>
    );
  }
};
