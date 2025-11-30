import React, { useCallback, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { GameDataContext } from '../../Editor/GameDataContext'; // Global game data context
import { NodeDataUpdater } from '../shared/NodeDataUpdater';

export const EVENT_TYPES = {
  onGameStart: { label: 'On Game Start' },
  onTick: { label: 'On Tick (every second)' },
  onClick: { label: 'On Main Resource Click' },
  afterXClicks: {
    label: 'After X Clicks',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Click Count:</label>
          <input className="nodrag" type="number" name="clickCount" value={data.clickCount || 10} onChange={handleChange} min="1" />
          <label>
            <input className="nodrag" type="checkbox" name="repeat" checked={data.repeat || false} onChange={(e) => handleChange({ target: { name: 'repeat', value: e.target.checked } })} />
            Repeat
          </label>
        </>
      );
    }
  },
  afterXSeconds: {
    label: 'After X Seconds',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Seconds:</label>
          <input className="nodrag" type="number" name="seconds" value={data.seconds || 10} onChange={handleChange} min="0" step="0.1" />
          <label>
            <input className="nodrag" type="checkbox" name="repeat" checked={data.repeat || false} onChange={(e) => handleChange({ target: { name: 'repeat', value: e.target.checked } })} />
            Repeat
          </label>
        </>
      );
    }
  },
  afterXResources: {
    label: 'After X Resources',
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
          <input className="nodrag" type="number" name="amount" value={data.amount || 100} onChange={handleChange} min="0" />
        </>
      );
    }
  },
  afterBoughtUpgrade: {
    label: 'After Bought Upgrade',
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
  afterXBoughtUpgrades: {
    label: 'After X Bought Upgrades',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Upgrade Count:</label>
          <input className="nodrag" type="number" name="upgradeCount" value={data.upgradeCount || 5} onChange={handleChange} min="1" />
        </>
      );
    }
  },
  afterXResourcesSpent: {
    label: 'After X Resources Spent',
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
          <label>Amount Spent:</label>
          <input className="nodrag" type="number" name="amountSpent" value={data.amountSpent || 1000} onChange={handleChange} min="0" />
        </>
      );
    }
  },
  onPrestige: { label: 'On Prestige' },
  afterXBuildings: {
    label: 'After X Buildings',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Building Count:</label>
          <input className="nodrag" type="number" name="buildingCount" value={data.buildingCount || 10} onChange={handleChange} min="1" />
        </>
      );
    }
  },
  afterBoughtBuilding: {
    label: 'After Bought Building',
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
  onAchievementUnlock: {
    label: 'On Achievement Unlock',
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
  afterXAchievements: {
    label: 'After X Achievements',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Achievement Count:</label>
          <input className="nodrag" type="number" name="achievementCount" value={data.achievementCount || 5} onChange={handleChange} min="1" />
        </>
      );
    }
  },
  onResourceFull: {
    label: 'On Resource Full',
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
        </>
      );
    }
  },
  onResourceEmpty: {
    label: 'On Resource Empty',
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
        </>
      );
    }
  },
  afterXProduction: {
    label: 'After X Production',
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
          <label>Total Produced:</label>
          <input className="nodrag" type="number" name="totalProduced" value={data.totalProduced || 10000} onChange={handleChange} min="0" />
        </>
      );
    }
  },
  onBuildingMaxed: {
    label: 'On Building Maxed',
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
  afterPlaytime: {
    label: 'After Playtime',
    component: ({ id, data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
      return (
        <>
          <label>Minutes:</label>
          <input className="nodrag" type="number" name="minutes" value={data.minutes || 60} onChange={handleChange} min="1" />
        </>
      );
    }
  },
};

export function EventNode({ id, data, isConnectable, updateNodeData, selected }) {
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });
  const EventComponent = EVENT_TYPES[data.eventType]?.component;

  return (
    <div className={`custom-node event-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">Event Trigger</div>
      <div className="node-content">
        <label>Event Type:</label>
        <select
          className="nodrag"
          name="eventType"
          value={data.eventType || 'onGameStart'}
          onChange={handleChange}
        >
          {Object.entries(EVENT_TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {EventComponent && (
          <EventComponent id={id} data={data} updateNodeData={updateNodeData} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}
