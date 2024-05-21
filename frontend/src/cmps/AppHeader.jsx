import { NavLink } from "react-router-dom";
import { UserMsg } from "./UserMsg.jsx";
import { LoginSignup } from "./LoginSignup.jsx";
import { userService } from "../services/user.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { Context } from "../RootCmp.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const [loggedinUser, setLoggedinUser] = useContext(Context);
  const navigate = useNavigate();

  async function onLogin(credentials) {
    console.log(credentials);
    try {
      const user = await userService.login(credentials);
      setLoggedinUser(user);
      showSuccessMsg(`Welcome ${user.fullname}`);
    } catch (err) {
      console.log("Cannot login :", err);
      showErrorMsg(`Cannot login`);
    }
  }

  async function onSignup(credentials) {
    console.log(credentials);
    try {
      const user = await userService.signup(credentials);
      setLoggedinUser(user);
      showSuccessMsg(`Welcome ${user.fullname}`);
    } catch (err) {
      console.log("Cannot signup :", err);
      showErrorMsg(`Cannot signup`);
    }
    // add signup
  }

  async function onLogout() {
    console.log("logout");
    try {
      await userService.logout();
      setLoggedinUser(null);
    } catch (err) {
      console.log("can not logout");
    }
    // add logout
  }

  function isAllowed() {
    return loggedinUser?.isAdmin;
  }

  return (
    <header className="app-header full main-layout">
      <section className="header-container">
        <h1>React Car App</h1>

        <section className="login-signup-container">
          {!loggedinUser && (
            <LoginSignup onLogin={onLogin} onSignup={onSignup} />
          )}

          {loggedinUser && (
            <div className="user-preview">
              <h3 onClick={() => navigate("/user/" + loggedinUser._id)}>
                Hello {loggedinUser.fullname}
                <button onClick={onLogout}>Logout</button>
              </h3>
            </div>
          )}
        </section>

        <nav className="app-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/bug">Bugs</NavLink>
          <NavLink to="/user">Users</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </section>
      <UserMsg />
    </header>
  );
}
