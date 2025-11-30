import React, { useCallback, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { GameDataContext } from '../../Editor/GameDataContext'; // Global game data context
import { NodeDataUpdater } from '../shared/NodeDataUpdater';

export const CONDITION_TYPES = {
  ifResource: {
    label: 'If Resource',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Resource:</label>
          <select className="nodrag" name="resourceId" value={data.resourceId || ''} onChange={handleChange}>
            {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <label>Operator:</label>
          <select className="nodrag" name="operator" value={data.operator || '>='} onChange={handleChange}>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="==">=</option>
          </select>
          <label>Amount:</label>
          <input className="nodrag" type="number" name="amount" value={data.amount || 0} onChange={handleChange} />
        </>
      );
    }
  },
  ifBuilding: {
    label: 'If Building',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Building:</label>
          <select className="nodrag" name="buildingId" value={data.buildingId || ''} onChange={handleChange}>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <label>Operator:</label>
          <select className="nodrag" name="operator" value={data.operator || '>='} onChange={handleChange}>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="==">=</option>
          </select>
          <label>Count:</label>
          <input className="nodrag" type="number" name="count" value={data.count || 0} onChange={handleChange} />
        </>
      );
    }
  },
  ifUpgradeOwned: {
    label: 'If Upgrade Owned',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const upgrades = gameData?.upgrades || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Upgrade:</label>
          <select className="nodrag" name="upgradeId" value={data.upgradeId || ''} onChange={handleChange}>
            {upgrades.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </>
      );
    }
  },
  ifAchievementUnlocked: {
    label: 'If Achievement Unlocked',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const achievements = gameData?.achievements || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Achievement:</label>
          <select className="nodrag" name="achievementId" value={data.achievementId || ''} onChange={handleChange}>
            {achievements.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </>
      );
    }
  },
  ifProductionRate: {
    label: 'If Production Rate',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Resource:</label>
          <select className="nodrag" name="resourceId" value={data.resourceId || ''} onChange={handleChange}>
            {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <label>Operator:</label>
          <select className="nodrag" name="operator" value={data.operator || '>='} onChange={handleChange}>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
          </select>
          <label>Per Second:</label>
          <input className="nodrag" type="number" name="perSecond" value={data.perSecond || 1} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  ifPrestigeLevel: {
    label: 'If Prestige Level',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Operator:</label>
          <select className="nodrag" name="operator" value={data.operator || '>='} onChange={handleChange}>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value="==">=</option>
          </select>
          <label>Level:</label>
          <input className="nodrag" type="number" name="level" value={data.level || 1} onChange={handleChange} min="0" />
        </>
      );
    }
  },
  ifPlaytime: {
    label: 'If Playtime',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Operator:</label>
          <select className="nodrag" name="operator" value={data.operator || '>='} onChange={handleChange}>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
          </select>
          <label>Minutes:</label>
          <input className="nodrag" type="number" name="minutes" value={data.minutes || 60} onChange={handleChange} min="0" />
        </>
      );
    }
  },
  ifBuildingOwned: {
    label: 'If Building Owned',
    component: ({ id, data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Building:</label>
          <select className="nodrag" name="buildingId" value={data.buildingId || ''} onChange={handleChange}>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </>
      );
    }
  },
};

export function ConditionNode({ id, data, isConnectable, updateNodeData, selected }) {
  const ConditionComponent = CONDITION_TYPES[data.conditionType]?.component;
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <div className={`custom-node condition-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Condition</div>
      <div className="node-content">
        <label>Condition Type:</label>
        <select className="nodrag" name="conditionType" value={data.conditionType || 'ifResource'} onChange={handleChange}>
          {Object.entries(CONDITION_TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {ConditionComponent && (
          <ConditionComponent id={id} data={data} updateNodeData={updateNodeData} />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        isConnectable={isConnectable}
        style={{ left: '30%', background: '#10b981', borderColor: '#059669' }}
      />
      <div className="handle-label handle-label-true">True</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        isConnectable={isConnectable}
        style={{ left: '70%', background: '#ef4444', borderColor: '#dc2626' }}
      />
      <div className="handle-label handle-label-false">False</div>
    </div>
  );
}
