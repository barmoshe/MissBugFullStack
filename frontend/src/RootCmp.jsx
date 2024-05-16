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

function RouteGuard({ children }) {
  const loggedinUser = userService.getLoggedinUser();

  function isAllowed() {
    return loggedinUser?.isAdmin;
  }

  if (!isAllowed()) {
    showErrorMsg("Not authorized");
    return <Navigate to="/" />;
  }
  return children;
}

export function App() {
  return (
    <Router>
      <div className="main-app">
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
                <RouteGuard>
                  <UserIndex />
                </RouteGuard>
              }
            />
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </main>
        <AppFooter />
        <UserMsg />
      </div>
    </Router>
  );
}
