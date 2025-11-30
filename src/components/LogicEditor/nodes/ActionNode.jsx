import React, { useCallback, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { GameDataContext } from '../../Editor/GameDataContext'; // Global game data context
import { NodeDataUpdater } from '../shared/NodeDataUpdater';

export const ACTION_TYPES = {
  addResource: {
    label: 'Add Resource',
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
          <label>Amount:</label>
          <input className="nodrag" type="number" name="amount" value={data.amount || 0} onChange={handleChange} />
        </>
      );
    }
  },
  removeResource: {
    label: 'Remove Resource',
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
          <label>Amount:</label>
          <input className="nodrag" type="number" name="amount" value={data.amount || 0} onChange={handleChange} />
        </>
      );
    }
  },
  setResource: {
    label: 'Set Resource',
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
          <label>Value:</label>
          <input className="nodrag" type="number" name="value" value={data.value || 0} onChange={handleChange} />
        </>
      );
    }
  },
  multiplyResource: {
    label: 'Multiply Resource',
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
          <label>Multiplier:</label>
          <input className="nodrag" type="number" name="multiplier" value={data.multiplier || 2} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  unlockUpgrade: {
    label: 'Unlock Upgrade',
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
  unlockBuilding: {
    label: 'Unlock Building',
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
  showNotification: {
    label: 'Show Notification',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Message:</label>
          <input className="nodrag" type="text" name="message" value={data.message || 'Notification'} onChange={handleChange} />
          <label>Duration (s):</label>
          <input className="nodrag" type="number" name="duration" value={data.duration || 3} onChange={handleChange} min="1" max="10" />
        </>
      );
    }
  },
  addProduction: {
    label: 'Add Production',
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
          <label>Per Second:</label>
          <input className="nodrag" type="number" name="perSecond" value={data.perSecond || 1} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  multiplyProduction: {
    label: 'Multiply Production',
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
          <label>Multiplier:</label>
          <input className="nodrag" type="number" name="multiplier" value={data.multiplier || 2} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  forcePrestige: {
    label: 'Force Prestige',
  },
  unlockAchievement: {
    label: 'Unlock Achievement',
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
  setClickPower: {
    label: 'Set Click Power',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Click Amount:</label>
          <input className="nodrag" type="number" name="clickAmount" value={data.clickAmount || 1} onChange={handleChange} min="1" />
        </>
      );
    }
  },
};

export function ActionNode({ id, data, isConnectable, updateNodeData, selected }) {
  const ActionComponent = ACTION_TYPES[data.actionType]?.component;
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <div className={`custom-node action-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Action</div>
      <div className="node-content">
        <label>Action Type:</label>
        <select className="nodrag" name="actionType" value={data.actionType || 'addResource'} onChange={handleChange}>
          {Object.entries(ACTION_TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {ActionComponent && (
          <ActionComponent id={id} data={data} updateNodeData={updateNodeData} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
