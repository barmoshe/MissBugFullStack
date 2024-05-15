import fs from "fs";
import { utilService } from "../../services/util.service.js";

let bugs = [];
bugs = utilService.readJsonFile("data/bug.json");
const PAGE_SIZE = 5;

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy, sortBy, pageIdx = 1) {
  let filteredBugs = [...bugs];

  try {
    // Filtering
    if (filterBy) {
      filteredBugs = _filterBugs(filterBy, filteredBugs);
    }
    if (!filteredBugs.length) {
      return {
        bugs: [],
        totalPages: 0,
      };
    }
    // Sorting
    if (sortBy) {
      filteredBugs = _sortBugs(sortBy, filteredBugs);
    }

    // Paging
    const totalPages = Math.ceil(filteredBugs.length / PAGE_SIZE);
    if (pageIdx > totalPages) {
      throw new Error("Invalid page index");
    }

    const startIndex = (pageIdx - 1) * PAGE_SIZE || 0;
    const endIndex = startIndex + PAGE_SIZE;
    const pagedBugs = filteredBugs.slice(startIndex, endIndex);

    return {
      bugs: pagedBugs,
      totalPages: totalPages,
    };
  } catch (error) {
    throw error;
  }
}

async function getById(bugId) {
  try {
    const bug = await bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (error) {
    throw error;
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    bugs.splice(bugIdx, 1);
    _saveBugsToFile();
  } catch (error) {
    throw error;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx < 0) throw `Can't find bug with _id ${bugToSave._id}`;
      bugs[idx] = bugToSave;
    } else {
      bugToSave._id = utilService.makeId();
      bugToSave.createdAt = Date.now();
      bugs.push(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (error) {
    throw error;
  }
}

function _filterBugs(filterBy, bugs) {
  const { txt, severity } = filterBy;

  const filteredBugs = bugs.filter((bug) => {
    let matchTxt = true;
    let matchSeverity = true;

    // Ensure bug properties are defined and valid
    const bugTitle = bug.title ? bug.title.toLowerCase() : "";
    const bugDescription = bug.description ? bug.description.toLowerCase() : "";
    const bugLabels = Array.isArray(bug.labels) ? bug.labels : [];
    const bugSeverity = typeof bug.severity === "number" ? bug.severity : -1;

    if (txt) {
      const txtLower = txt.toLowerCase();
      matchTxt =
        bugTitle.includes(txtLower) ||
        bugDescription.includes(txtLower) ||
        bugLabels.some((label) => label.toLowerCase().includes(txtLower));
    }

    if (severity) {
      matchSeverity = bugSeverity >= severity;
    }

    return matchTxt && matchSeverity;
  });

  return filteredBugs;
}

function _sortBugs(sortBy, bugs) {
  switch (sortBy) {
    case "title":
      return bugs.sort((a, b) => a.title.localeCompare(b.title));
    case "severity":
      return bugs.sort((a, b) => a.severity - b.severity);
    case "createdAt":
      return bugs.sort((a, b) => a.createdAt - b.createdAt);
    default:
      return bugs;
  }
}

function _saveBugsToFile(path = "./data/bug.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
