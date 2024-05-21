import { AppHeader } from "./cmps/AppHeader.jsx";
import { AppFooter } from "./cmps/AppFooter.jsx";
import { Home } from "./pages/Home.jsx";
import { BugIndex } from "./pages/BugIndex.jsx";
import { BugDetails } from "./pages/BugDetails.jsx";
import { UserIndex } from "./pages/UserIndex.jsx";
import { UserDetails } from "./pages/UserDetails.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { userService } from "./services/user.service.js";
import { showSuccessMsg, showErrorMsg } from "./services/event-bus.service.js";

import { UserMsg } from "./cmps/UserMsg.jsx";
import { createContext, useState } from "react";
import { useParams } from "react-router-dom";

function AdminGuard({ children }) {
  const loggedinUser = userService.getLoggedinUser();

  function isAllowed() {
    return loggedinUser?.isAdmin;
  }

  if (!isAllowed()) {
    console.log("not allowed");
    return <Navigate to="/" />;
  }
  return children;
}

function UserGuard({ children }) {
  const loggedinUser = userService.getLoggedinUser();
  const params = useParams();
  const userId = params.userId;

  function isAllowed() {
    console.log("loggedinUser", loggedinUser);
    if (!loggedinUser) return false;
    return loggedinUser._id === userId;
  }

  if (!isAllowed()) {
    console.log("not logged in");
    return <Navigate to="/" />;
  }
  return children;
}
export const Context = createContext();

export function App() {
  const [loggedinUser, setLoggedinUser] = useState(
    userService.getLoggedinUser()
  );

  return (
    <Router>
      <div className="main-app">
        <Context.Provider value={[loggedinUser, setLoggedinUser]}>
          <AppHeader />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bug" element={<BugIndex />} />
              <Route path="/bug/:bugId" element={<BugDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route
                path="/user"
                element={
                  <AdminGuard>
                    <UserIndex />
                  </AdminGuard>
                }
              />

              <Route
                path="/user/:userId"
                element={
                  <UserGuard>
                    <UserDetails />
                  </UserGuard>
                }
              />
            </Routes>
          </main>

          <AppFooter />
        </Context.Provider>

        <UserMsg />
      </div>
    </Router>
  );
}
