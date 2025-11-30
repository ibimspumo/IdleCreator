import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXSeconds',
  label: 'After X Seconds',
  icon: '⏰',
  description: 'After X seconds',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXSeconds',
    seconds: 10,
    repeat: false
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Seconds:</label>
        <input
          className="nodrag"
          type="number"
          name="seconds"
          value={data.seconds || 10}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
        <label>
          <input
            className="nodrag"
            type="checkbox"
            name="repeat"
            checked={data.repeat || false}
            onChange={(e) => handleChange({ target: { name: 'repeat', value: e.target.checked } })}
          />
          Repeat
        </label>
      </>
    );
  }
};
