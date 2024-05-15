export function UserPreview({ user }) {
  return (
    <article className="user-preview-card">
      <h4>{user.fullname}</h4>
      <h1>👤</h1>
      <p>
        Username: <span>{user.username}</span>
      </p>
      <p>score: {user.score}</p>
    </article>
  );
}
