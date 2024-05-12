import { useEffect, useState } from "react";
import { userService } from "../services/user.service.js";
import { UserList } from "../cmps/UserList.jsx";
import { UserFilterBar } from "../cmps/UserFilterBar.jsx";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

export function UserIndex() {
  return (
    <div>
      <UserFilterBar />
      <UserList />
    </div>
  );
}
