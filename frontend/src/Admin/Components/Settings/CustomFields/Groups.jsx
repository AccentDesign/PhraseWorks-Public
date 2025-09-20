import React, { useState } from 'react';
import ListView from './ListView';

const Groups = ({
  groups,
  setGroups,
  selectedIds,
  setSelectedIds,
  toggleCheckbox,
  restoreGroup,
  binGroup,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <div>
      <ListView
        groups={groups}
        selectedIds={selectedIds}
        toggleCheckbox={toggleCheckbox}
        restoreGroup={restoreGroup}
        binGroup={binGroup}
        allSelected={allSelected}
        toggleAllCheckboxes={toggleAllCheckboxes}
      />
    </div>
  );
};

export default Groups;
