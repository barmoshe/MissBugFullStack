import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/user"
    : "http://localhost:3030/api/user";

export const userService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy = {}) {
  try {
    const res = await axios.get(BASE_URL, { params: { ...filterBy } });
    return res.data;
  } catch (err) {
    console.log("Error in userService.query", err);
  }
}
function _filterUsers(users, filterBy) {
  const { txt, minBalance } = filterBy;

  const filteredUsers = users.filter((user) => {
    if (txt && !user.username.toLowerCase().includes(txt.toLowerCase()))
      return false;
    if (minBalance && user.balance < minBalance) return false;
    return true;
  });
  return filteredUsers;
}

async function getById(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/${userId}`);
    if (res.data) return res.data;
    else throw new Error(`Error getting user id ${userId}`);
  } catch (err) {
    console.log("Error in userService.getById", err);
  }
}

async function remove(userId) {
  try {
    const res = await axios.delete(`${BASE_URL}/${userId}`);
    return res.data;
  } catch (err) {
    console.log("Error in userService.remove", err);
  }
}

async function save(user) {
  try {
    if (user._id) {
      const res = await axios.put(`${BASE_URL}/${user._id}`, { user });
      return res.data;
    } else {
      const res = await axios.post(BASE_URL, { user });
      return res.data;
    }
  } catch (err) {
    console.log("Error in userService.save", err);
  }
}

// async function remove(bugId) {
