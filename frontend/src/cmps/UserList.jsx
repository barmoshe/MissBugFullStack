import { Link } from "react-router-dom";
import { UserPreview } from "./UserPreview.jsx";

export function UserList({ users, onRemoveUser }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div>
            <button
              onClick={() => {
                onRemoveUser(user._id);
              }}
            >
              x
            </button>
          </div>
          <Link to={`/user/${user._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  );
}
