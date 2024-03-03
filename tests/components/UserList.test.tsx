import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";

import { type User } from "../../src/entities";

describe("UserList", () => {
  const createUsers = () => {
    return [
      { id: 1, name: "John" },
      { id: 2, name: "Sarah" },
    ];
  };

  it("should have correct prop types", () => {
    expectTypeOf(UserList).toBeFunction();
    expectTypeOf(UserList).parameter(0).toMatchTypeOf<{ users: Array<User> }>();
  });

  it("should render text 'no users' when the users array is empty.", () => {
    render(<UserList users={[]} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it("should render a list of users", () => {
    const users = createUsers();

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
