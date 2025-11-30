import { NodeDataUpdater } from '../../shared/NodeDataUpdater';

export default {
  id: 'showNotification',
  label: 'Show Notification',
  icon: '💬',
  description: 'Show popup message',
  category: 'actions',
  type: 'action',
  defaultData: {
    actionType: 'showNotification',
    message: 'Notification',
    duration: 3
  },
  component: ({ id, data, updateNodeData }) => {
    const { handleChange } = NodeDataUpdater({ nodeId: id, data, onUpdate: updateNodeData });

    return (
      <>
        <label>Message:</label>
        <input
          className="nodrag"
          type="text"
          name="message"
          value={data.message || 'Notification'}
          onChange={handleChange}
        />
        <label>Duration (s):</label>
        <input
          className="nodrag"
          type="number"
          name="duration"
          value={data.duration || 3}
          onChange={handleChange}
          min="1"
          max="10"
        />
      </>
    );
  }
};
