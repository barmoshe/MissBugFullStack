import { useState, useEffect } from "react";
import { BugList } from "../cmps/BugList.jsx";
import { BugFilterBar } from "../cmps/BugFilterBar.jsx";
import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { useContext } from "react";
import { Context } from "../RootCmp.jsx";

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [filterBy, setFilterBy] = useState({ txt: "", severity: 0 });
  const [sortBy, setSortBy] = useState("title");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loggedinUser] = useContext(Context);

  useEffect(() => {
    loadBugs();
  }, [filterBy, sortBy, currentPage]);

  async function loadBugs() {
    try {
      const { bugs, totalPages } = await bugService.query({
        ...filterBy,
        pageIdx: currentPage,
        sortBy,
      });
      setBugs(bugs);
      console.log("bugs from BugIndex", bugs);

      setTotalPages(totalPages);
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data === "Invalid page index") {
          //change the current page to the last page
          setCurrentPage(totalPages);
          return;
        }
      }
      console.error("Error loading bugs:", error);
      showErrorMsg("Error loading bugs");
    }
  }

  async function onPageChange(pageIdx) {
    setCurrentPage(pageIdx);
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg("Bug removed");
    } catch (error) {
      console.error("Error removing bug:", error);
      showErrorMsg("Error removing bug");
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity?"),
      description: prompt("Bug description?"),
    };
    try {
      const savedBug = await bugService.save(bug);
      if (!savedBug) throw new Error("Cannot add bug");
      setBugs((prevBugs) => [...prevBugs, savedBug]);
      showSuccessMsg("Bug added");
    } catch (err) {
      console.log("Error from onAddBug ->", err);
      showErrorMsg("Cannot add bug");
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt("New severity?");
    if (isNaN(severity) || severity < 1)
      return showErrorMsg("Severity must be a number greater than 0");
    const bugToSave = { ...bug, severity };
    try {
      const savedBug = await bugService.save(bugToSave);
      if (!savedBug) throw new Error("Cannot update bug");
      setBugs((prevBugs) =>
        prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
      );
      showSuccessMsg("Bug updated");
    } catch (err) {
      console.log("Error from onEditBug ->", err);
      showErrorMsg("Cannot update bug");
    }
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <button className="add-btn" onClick={onAddBug}>
          Add Bug ⛐
        </button>
        <BugFilterBar
          onSetFilter={setFilterBy}
          filterBy={filterBy}
          sortBy={sortBy}
          onSetSort={setSortBy}
        />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </main>
  );
}
