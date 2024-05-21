import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/user.service.js";
import { UserList } from "../cmps/UserList.jsx";
import { UserFilterBar } from "../cmps/UserFilterBar.jsx";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

export function UserIndex() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);
  async function loadUsers() {
    try {
      const users = await userService.query();
      console.log("users from UserIndex", users);
      setUsers(users);
    } catch (error) {
      if (error.message === "Not logged in") {
        showErrorMsg("Please login to view users");
        navigate("/");
        return;
      }
      console.error("Error loading users:", error);
      showErrorMsg("Error loading users");
    }
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      showSuccessMsg("User removed");
    } catch (error) {
      console.error("Error removing user:", error);
      showErrorMsg("Error removing user");
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt("User fullname?"),
      username: prompt("User username?"),
      password: prompt("User password?"),
      score: +prompt("User score?"),
    };
    try {
      await userService.save(user);
      loadUsers();
      showSuccessMsg("User added");
    } catch (error) {
      console.error("Error adding user:", error);
      showErrorMsg("Error adding user");
    }
  }

  async function onEditUser(user) {
    //prompt user for new values
    const newUser = {
      ...user,
      fullname: prompt("User fullname?", user.fullname),
      username: prompt("User username?", user.username),
      password: prompt("User password?", user.password),
      score: +prompt("User score?", user.score),
    };
    try {
      await userService.save(newUser);
      loadUsers();
      showSuccessMsg("User updated");
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorMsg("Error updating user");
    }
  }
  async function onAddUser() {
    const user = {
      fullname: prompt("User fullname?"),
      username: prompt("User username?"),
      password: prompt("User password?"),
      score: +prompt("User score?"),
    };
    try {
      await userService.save(user);
      loadUsers();
      showSuccessMsg("User added");
    } catch (error) {
      console.error("Error adding user:", error);
      showErrorMsg("Error adding user");
    }
  }
  if (!users) {
    return <div>Loading...</div>;
  }
  return (
    <div className="user-index">
      <button onClick={onAddUser}>Add User</button>
      <UserList
        users={users}
        onRemoveUser={onRemoveUser}
        onEditUser={onEditUser}
      />
      <button onClick={onAddUser}>Add User</button>
    </div>
  );
}
