import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/bug"
    : "http://localhost:3030/api/bug";
export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query(filterBy = {}) {
  try {
    const res = await axios.get(BASE_URL, { params: { ...filterBy } });
    return res.data;
  } catch (err) {
    console.log("Error in bugService.query", err);
  }
}
function _filterBugs(bugs, filterBy) {
  const { txt, severity } = filterBy;

  const filteredBugs = bugs.filter((bug) => {
    if (title && !bug.title.toLowerCase().includes(title.toLowerCase()))
      return false;
    if (severity && bug.severity !== severity) return false;
    if (
      description &&
      !bug.description.toLowerCase().includes(description.toLowerCase())
    )
      return false;
    return true;
  });
  return filteredBugs;
}

async function getById(bugId) {
  try {
    const res = await axios.get(`${BASE_URL}/${bugId}`);
    if (res.data) return res.data;
    else throw new Error(`Error getting bug id ${bugId}`);
  } catch (err) {
    console.log("Error in bugService.getById", err);
  }
}

async function save(bug) {
  try {
    if (bug._id) {
      // If bug has an _id, it means it already exists, so update it
      const res = await axios.put(`${BASE_URL}/${bug._id}`, { bug });
      return res.data;
    } else {
      // If bug doesn't have an _id, it's a new bug, so add it
      const res = await axios.post(BASE_URL, {
        ...bug,
        createdAt: Date.now(),
        creator: { _id: "u101", fullname: "Puki Ben David" },
      });

      return res.data;
    }
  } catch (err) {
    console.log("Error in bugService.save", err);
  }
}

async function remove(bugId) {
  try {
    const res = await axios.delete(`${BASE_URL}/${bugId}`);
    return { bugId };
  } catch (err) {
    console.log("Error in bugService.remove", err);
  }
}
