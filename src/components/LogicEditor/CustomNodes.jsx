import React, { useCallback, useContext } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import '../../styles/custom-nodes.css'; // New CSS for custom nodes
import { GameDataContext } from '../../components/Editor/GameDataContext'; // Global game data context

// Helper to update node data (will be passed from LogicEditor)
const NodeDataUpdater = ({ nodeId, data, onUpdate }) => {
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    onUpdate(nodeId, { ...data, [name]: value });
  }, [nodeId, data, onUpdate]);

  return { handleChange };
};

// --- Universal Event Node ---
export const EVENT_TYPES = {
  onGameStart: { label: 'On Game Start' },
  onTick: { label: 'On Tick (every second)' },
  onClick: { label: 'On Main Resource Click' },
  afterXClicks: {
    label: 'After X Clicks',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const upgrades = gameData?.upgrades || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const achievements = gameData?.achievements || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });
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
          <EventComponent data={data} updateNodeData={(field, value) => updateNodeData(id, { ...data, [field]: value })} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}

// --- Universal Action Node ---
export const ACTION_TYPES = {
  addResource: {
    label: 'Add Resource',
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const upgrades = gameData?.upgrades || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const achievements = gameData?.achievements || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
          <ActionComponent data={data} updateNodeData={(field, value) => updateNodeData(id, { ...data, [field]: value })} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}

// --- Condition Node ---
export const CONDITION_TYPES = {
  ifResource: {
    label: 'If Resource',
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const upgrades = gameData?.upgrades || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const achievements = gameData?.achievements || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const resources = gameData?.resources || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
    component: ({ data, updateNodeData }) => {
      const { gameData } = useContext(GameDataContext);
      const buildings = gameData?.buildings || [];
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

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
          <ConditionComponent data={data} updateNodeData={(field, value) => updateNodeData(id, { ...data, [field]: value })} />
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

// --- Logic Node ---
export const LOGIC_TYPES = {
  delay: {
    label: 'Delay',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Duration (seconds):</label>
          <input className="nodrag" type="number" name="duration" value={data.duration || 1} onChange={handleChange} min="0" step="0.1" />
        </>
      );
    }
  },
  random: {
    label: 'Random',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Chance (%):</label>
          <input className="nodrag" type="number" name="chance" value={data.chance || 50} onChange={handleChange} min="0" max="100" />
        </>
      );
    }
  },
  loop: {
    label: 'Loop',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Repeat Count:</label>
          <input className="nodrag" type="number" name="repeatCount" value={data.repeatCount || 5} onChange={handleChange} min="1" max="100" />
        </>
      );
    }
  },
  branch: {
    label: 'Branch',
    component: ({ data, updateNodeData }) => {
      const { handleChange } = NodeDataUpdater({ nodeId: data.id, data, onUpdate: updateNodeData });

      return (
        <>
          <label>Outputs:</label>
          <input className="nodrag" type="number" name="outputCount" value={data.outputCount || 3} onChange={handleChange} min="2" max="5" />
        </>
      );
    }
  },
  sequence: {
    label: 'Sequence',
  },
};

export function LogicNode({ id, data, isConnectable, updateNodeData, selected }) {
  const LogicComponent = LOGIC_TYPES[data.logicType]?.component;
  const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

  return (
    <div className={`custom-node logic-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="node-header">Logic</div>
      <div className="node-content">
        <label>Logic Type:</label>
        <select className="nodrag" name="logicType" value={data.logicType || 'delay'} onChange={handleChange}>
          {Object.entries(LOGIC_TYPES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {LogicComponent && (
          <LogicComponent data={data} updateNodeData={(field, value) => updateNodeData(id, { ...data, [field]: value })} />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}

// Group Node - For visually grouping flows
export function GroupNode({ id, data, isConnectable, updateNodeData, selected }) {
  const borderColor = data.color || 'rgb(79, 70, 229)';
  const backgroundColor = data.colorBg || 'rgba(79, 70, 229, 0.05)';

  return (
    <div
      className={`custom-node group-node ${selected ? 'selected' : ''}`}
      style={{
        width: data.width || 400,
        height: data.height || 300,
        background: backgroundColor,
        borderColor: borderColor,
      }}
    >
      <NodeResizer minWidth={200} minHeight={150} />
      <div className="group-header" style={{
        background: backgroundColor.replace('0.05', '0.15'),
      }}>
        <span className="group-title" style={{ color: borderColor }}>
          {data.groupName || 'Flow Group'}
        </span>
      </div>
      {data.description && (
        <div className="group-description-hint">
          {data.description.substring(0, 50)}{data.description.length > 50 ? '...' : ''}
        </div>
      )}
    </div>
  );
}

export const nodeTypes = {
  event: EventNode,
  action: ActionNode,
  condition: ConditionNode,
  logic: LogicNode,
  group: GroupNode,
};
