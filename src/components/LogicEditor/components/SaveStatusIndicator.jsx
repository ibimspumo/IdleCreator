import React from 'react';

/**
 * SaveStatusIndicator - Shows the current save status (saved, unsaved, saving)
 */
export function SaveStatusIndicator({ saveStatus }) {
  return (
    <div className="save-status-indicator" data-status={saveStatus}>
      <div className="save-status-dot"></div>
      <span className="save-status-text">
        {saveStatus === 'saved' && 'Saved'}
        {saveStatus === 'unsaved' && 'Unsaved changes'}
        {saveStatus === 'saving' && 'Saving...'}
      </span>
    </div>
  );
}
