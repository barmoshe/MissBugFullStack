import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview";
import { useContext, useEffect } from "react";
import { Context } from "../RootCmp.jsx";

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  const [loggedinUser] = useContext(Context);

  useEffect(() => {
    //loged in user
    console.log("loggedinUser", loggedinUser);
  }, [loggedinUser]);

  function printBug(bug) {
    console.log(bug);
    return false;
  }

  if (!bugs || bugs.length === 0) return <h2>No Bugs</h2>;
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {loggedinUser && bug.creator._id === loggedinUser._id && (
            <div className="btns-container">
              <button
                onClick={() => {
                  onRemoveBug(bug._id);
                }}
              >
                x
              </button>
              <button
                onClick={() => {
                  onEditBug(bug);
                }}
              >
                Edit
              </button>
            </div>
          )}

          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  );
}
