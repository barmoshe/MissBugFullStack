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
async function getById(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/${userId}`);
    if (res.data) return res.data;
    else throw new Error(`Error getting user id ${userId}`);
  } catch (err) {
    console.log("Error in userService.getById", err);
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
async function remove(userId) {
  try {
    const res = await axios.delete(`${BASE_URL}/${userId}`);
    return res.data;
  } catch (err) {
    console.log("Error in userService.remove", err);
  }
}
function _filterUsers(users, filterBy) {
  const { name, email } = filterBy;

  const filteredUsers = users.filter((user) => {
    if (name && !user.name.toLowerCase().includes(name.toLowerCase()))
      return false;
    if (email && user.email !== email) return false;
    return true;
  });
  return filteredUsers;
}
