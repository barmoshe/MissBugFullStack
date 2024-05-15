import { useEffect, useState } from "react";
import { userService } from "../services/user.service.js";
import { UserList } from "../cmps/UserList.jsx";
import { UserFilterBar } from "../cmps/UserFilterBar.jsx";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

export function UserIndex() {
  const [users, setUsers] = useState([]);
  const [filterBy, setFilterBy] = useState({ txt: "", minBalance: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [filterBy, currentPage]); // Trigger loadUsers on filterBy or currentPage change
  async function loadUsers() {
    try {
      const { users, totalPages } = await userService.query({
        ...filterBy,
        pageIdx: currentPage,
      });
      setUsers(users);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error loading users:", error);
      showErrorMsg("Error loading users");
    }
  }
  function onPageChange(pageIdx) {
    setCurrentPage(pageIdx);
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
  if (!users) {
    console.error("No users");
    return <div>Loading...</div>;
  }
  return (
    <div className="user-index">
      <UserFilterBar filterBy={filterBy} setFilterBy={setFilterBy} />
      <UserList
        users={users}
        onRemoveUser={onRemoveUser}
        onEditUser={onEditUser}
      />
      <button onClick={onAddUser}>Add User</button>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span>{currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
