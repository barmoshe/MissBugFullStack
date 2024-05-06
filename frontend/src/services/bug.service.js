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

async function query() {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.log("Error in bugService.query", err);
  }
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
    console.log("bug-service-from-frontend Saving Bug:", bug);
    const res = await axios.get(`${BASE_URL}/save`, { params: bug });
    return res.data;
  } catch (err) {
    console.log("Error in bugService.save", err);
  }
}

async function remove(bugId) {
  try {
    console.log("bug-service-from-frontend Removing Bug:", bugId);
    const res = await axios.get(`${BASE_URL}/${bugId}/remove`);
    return { bugId };
  } catch (err) {
    console.log("Error in bugService.remove", err);
  }
}
