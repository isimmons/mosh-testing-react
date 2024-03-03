import { User } from "../entities";

type UserListProps = {
  users: Array<User>;
};

const UserList = ({ users }: UserListProps) => {
  if (users.length === 0) return <p>No users available.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <a href={`/users/${user.id}`}>{user.name}</a>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
