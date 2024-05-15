import fs from "fs";
import { utilService } from "../../services/util.service.js";

let users = [];
users = utilService.readJsonFile("data/user.json");
const PAGE_SIZE = 5;

export const userService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy, sortBy, pageIdx = 1) {
  let filteredUsers = [...users];

  try {
    // Filtering
    if (filterBy) {
      filteredUsers = _filterUsers(filterBy, filteredUsers);
    }

    // Sorting
    if (sortBy) {
      filteredUsers = _sortUsers(sortBy, filteredUsers);
    }

    // Paging
    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    if (pageIdx > totalPages) {
      throw new Error("Invalid page index");
    }

    const startIndex = (pageIdx - 1) * PAGE_SIZE || 0;
    const endIndex = startIndex + PAGE_SIZE;
    const pagedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: pagedUsers,
      totalPages: totalPages,
    };
  } catch (error) {
    throw error;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function remove(userId) {
  console.log("userId in remove", userId);
  try {
    const userIdx = users.findIndex((user) => user._id === userId);
    users.splice(userIdx, 1);
    _saveUsersToFile();
  } catch (error) {
    throw error;
  }
}

async function save(user) {
  try {
    if (user._id) {
      const userIdx = users.findIndex((u) => u._id === user._id);
      users[userIdx] = user;
    } else {
      user._id = utilService.makeId();
      users.push(user);
    }
    _saveUsersToFile();
    return user;
  } catch (error) {
    throw error;
  }
}

function _filterUsers(filterBy, users) {
  const { txt, minScore } = filterBy;

  const filteredUsers = users.filter((user) => {
    if (txt && !user.username.toLowerCase().includes(txt.toLowerCase()))
      return false;
    if (minScore && user.score < minScore) return false;
    return true;
  });
  return filteredUsers;
}

function _sortUsers(sortBy, users) {
  return users.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });
}

function _saveUsersToFile() {
  fs.writeFileSync("data/user.json", JSON.stringify(users, null, 2));
}

//example user :
//{
//     "_id": "u101",
//     "fullname": "Muki Ja",
//     "username": "muki",
//     "password": "muki1234",
//     "score": 100
// }
