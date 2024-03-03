import { User } from "../entities";

type UserAccountProps = {
  user: User;
};

const UserAccount = ({ user }: UserAccountProps) => {
  return (
    <>
      <h2>User Profile</h2>
      {user.isAdmin && <button>Edit</button>}
      <div>
        <strong>Name:</strong> {user.name}
      </div>
    </>
  );
};

export default UserAccount;
