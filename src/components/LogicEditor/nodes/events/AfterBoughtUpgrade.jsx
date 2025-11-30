import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterBoughtUpgrade',
  label: 'After Bought Upgrade',
  icon: '🎁',
  description: 'After buying upgrade',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterBoughtUpgrade',
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
