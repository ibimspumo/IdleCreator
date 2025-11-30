import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'unlockBuilding',
  label: 'Unlock Building',
  icon: '🔑',
  description: 'Unlock a building',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'unlockBuilding',
    buildingId: ''
  },
  component: ({ id, data, updateNodeData }) => {
    const { gameData } = useContext(GameDataContext);
    const buildings = gameData?.buildings || [];
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Building:</label>
        <select
          className="nodrag"
          name="buildingId"
          value={data.buildingId || ''}
          onChange={handleChange}
        >
          {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </>
    );
  }
};
