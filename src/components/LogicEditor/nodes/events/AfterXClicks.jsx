import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'afterXClicks',
  label: 'After X Clicks',
  icon: '🖱️',
  description: 'After X clicks',
  category: 'events',
  type: 'event',
  defaultData: {
    eventType: 'afterXClicks',
    clickCount: 10,
    repeat: false
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Click Count:</label>
        <input
          className="nodrag"
          type="number"
          name="clickCount"
          value={data.clickCount || 10}
          onChange={handleChange}
          min="1"
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
