import React, { useState, useEffect } from "react";

export function BugFilterBar({ onSetFilter, filterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    setFilterByToEdit(filterBy);
  }, [filterBy]);

  const handleChange = (field, value) => {
    const newFilter = { ...filterByToEdit, [field]: value };
    setFilterByToEdit(newFilter);
    onSetFilter(newFilter);
  };

  return (
    <div className="bug-filter-bar">
      <input
        type="text"
        placeholder="Filter by txt"
        value={filterByToEdit.txt}
        onChange={(e) => handleChange("txt", e.target.value)}
      />
      <input
        type="number"
        placeholder="Filter by severity"
        value={filterByToEdit.severity}
        onChange={(e) => handleChange("severity", e.target.value)}
      />
    </div>
  );
}
