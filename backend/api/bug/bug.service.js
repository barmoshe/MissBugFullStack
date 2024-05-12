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
    const bug = bugs.find((bug) => bug._id === bugId);
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
  return bugs.filter((bug) => {
    let matchTxt = true;
    let matchSeverity = true;
    let matchLabels = true;

    if (txt) {
      matchTxt =
        bug.title.toLowerCase().includes(txt.toLowerCase()) ||
        bug.description.toLowerCase().includes(txt.toLowerCase()) ||
        bug.labels.some((label) =>
          label.toLowerCase().includes(txt.toLowerCase())
        );
    }

    if (severity) {
      matchSeverity = bug.severity >= severity;
    }

    return matchTxt && matchSeverity && matchLabels;
  });
}

function _sortBugs(sortBy, bugs) {
  const { sortBy: sortByField, sortDir } = sortBy;
  return bugs.sort((a, b) => {
    const sortFactor = sortDir === -1 ? -1 : 1;
    if (a[sortByField] > b[sortByField]) return sortFactor;
    if (a[sortByField] < b[sortByField]) return -sortFactor;
    return 0;
  });
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
