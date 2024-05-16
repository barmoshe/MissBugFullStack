import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/"
    : "http://localhost:3030/api/";

const BASE_AUTH_URL = BASE_URL + "auth/";

export const userService = {
  query,
  getById,
  remove,
  save,
  getLoggedinUser,
  getEmptyUser,
  login,
  saveLocalUser,
  logout,
};

async function query(filterBy = {}) {
  try {
    const res = await axios.get(BASE_URL + "user", { params: { ...filterBy } });
    console.log("res.data", res.data);
    return res.data;
  } catch (err) {
    //if 403 then throw error -not logged in
    if (err.response.status === 403) throw new Error("Not logged in");
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
    const res = await axios.get(`${BASE_URL + "user"}/${userId}`);
    if (res.data) return res.data;
    else throw new Error(`Error getting user id ${userId}`);
  } catch (err) {
    console.log("Error in userService.getById", err);
  }
}

async function remove(userId) {
  try {
    const res = await axios.delete(`${BASE_URL + "user"}/${userId}`);
    return res.data;
  } catch (err) {
    console.log("Error in userService.remove", err);
  }
}

async function save(user) {
  try {
    if (user._id) {
      const res = await axios.put(`${BASE_URL + "user"}/${user._id}`, { user });
      return res.data;
    } else {
      const res = await axios.post(BASE_URL + "user", { user });
      return res.data;
    }
  } catch (err) {
    console.log("Error in userService.save", err);
  }
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function getEmptyUser() {
  return {
    username: "",
    fullname: "",
    password: "",
    imgUrl: "",
  };
}
async function login(credentials) {
  const { data: user } = await axios.post(BASE_AUTH_URL + "login", credentials);
  console.log("user", user);
  if (user) {
    return saveLocalUser(user);
  }
}
function saveLocalUser(user) {
  user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

async function logout() {
  await axios.post(BASE_AUTH_URL + "logout");
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
}

// async function remove(bugId) {
