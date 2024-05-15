import React, { useState, useEffect, useCallback } from "react";

export function BugFilterBar({ onSetFilter, filterBy, sortBy, onSetSort }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  const [sortByToEdit, setSortByToEdit] = useState(sortBy);

  useEffect(() => {
    setFilterByToEdit(filterBy);
  }, [filterBy]);

  useEffect(() => {
    setSortByToEdit(sortBy);
  }, [sortBy]);

  const debouncedOnSetFilter = useCallback(
    debounce((newFilter) => {
      onSetFilter(newFilter);
    }, 300), // Adjust the delay as needed
    []
  );

  const handleChange = (field, value) => {
    const newFilter = { ...filterByToEdit, [field]: value };
    setFilterByToEdit(newFilter);
    debouncedOnSetFilter(newFilter);
  };

  return (
    <>
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
      <div className="bug-sort-bar">
        <select
          value={sortByToEdit}
          onChange={(e) => onSetSort(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="severity">Severity</option>
          <option value="createdAt">Created At</option>
        </select>
      </div>
    </>
  );
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
