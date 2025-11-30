import React from 'react';
import { BaseEventNode } from './base/BaseEventNode';
import { EVENT_TYPES } from './events';

/**
 * Event Node Wrapper
 * Dynamically renders the correct event node based on data.eventType
 */
export function EventNode(props) {
  const { data } = props;
  const eventType = data.eventType || 'onGameStart';
  const config = EVENT_TYPES[eventType];

  if (!config) {
    console.error(`Unknown event type: ${eventType}`);
    return <div className="custom-node error-node">Unknown Event: {eventType}</div>;
  }

  return <BaseEventNode {...props} config={config} />;
}
