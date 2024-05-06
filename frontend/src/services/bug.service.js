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

}

async function remove(bugId) {
  try {
    const res = await axios.delete(`${BASE_URL}/${bugId}`);
    return { bugId };
  } catch (err) {
    console.log("Error in bugService.remove", err);
  }
}
