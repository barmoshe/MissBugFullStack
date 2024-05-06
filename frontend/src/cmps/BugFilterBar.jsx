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
        placeholder="Filter by title"
        value={filterByToEdit.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <select
        value={filterByToEdit.severity}
        onChange={(e) => handleChange("severity", parseInt(e.target.value))}
      >
        <option value={0}>Filter by severity</option>
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
      </select>
      <input
        type="text"
        placeholder="Filter by description"
        value={filterByToEdit.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  );
}
