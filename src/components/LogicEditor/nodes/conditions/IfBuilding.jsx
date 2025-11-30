import { useContext } from 'react';
import { GameDataContext } from '../../../Editor/GameDataContext';
import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'ifBuilding',
  label: 'If Building',
  icon: '🏗️',
  description: 'Check building count',
  category: 'conditions',
  type: 'condition',
  defaultData: {
    conditionType: 'ifBuilding',
    buildingId: '',
    operator: '>=',
    count: 0
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
        <label>Operator:</label>
        <select
          className="nodrag"
          name="operator"
          value={data.operator || '>='}
          onChange={handleChange}
        >
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="==">=</option>
        </select>
        <label>Count:</label>
        <input
          className="nodrag"
          type="number"
          name="count"
          value={data.count || 0}
          onChange={handleChange}
        />
      </>
    );
  }
};
