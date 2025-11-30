import React from 'react';
import { RenderIcon } from '../../Editor/shared/RenderIcon';
import { FormatUtils } from '../../../utils/formatters';

/**
 * ResourceDisplay - Displays a single resource with icon, amount, and production rate
 */
export function ResourceDisplay({ resource, resourceState }) {
  return (
    <div className="resource-item">
      <div className="resource-header">
        <span className="resource-icon">
          <RenderIcon icon={resource.icon} size={20} />
        </span>
        <span className="resource-name">{resource.name}</span>
      </div>
      <div className="resource-amount">
        {FormatUtils.formatNumber(resourceState?.amount || 0)}
      </div>
      {resourceState?.perSecond > 0 && (
        <div className="resource-rate">
          +{FormatUtils.formatPerSecond(resourceState.perSecond)}
        </div>
      )}
    </div>
  );
}
