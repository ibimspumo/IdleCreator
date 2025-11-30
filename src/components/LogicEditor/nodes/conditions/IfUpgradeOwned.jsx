import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifUpgradeOwned',
  label: 'If Upgrade Owned',
  icon: '🎁',
  description: 'Check if upgrade owned',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifUpgradeOwned',
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
