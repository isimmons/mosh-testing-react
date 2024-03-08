import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const createUser = (isAdmin?: boolean) => {
    if (!isAdmin) return { id: 1, name: "John" };

    return { id: 1, name: "John", isAdmin: true };
  };

  it("should have correct prop types", () => {
    expectTypeOf(UserAccount).toBeFunction();
    expectTypeOf(UserAccount).parameter(0).toMatchTypeOf<{ user: User }>();
  });

  it("should show the users name", () => {
    const user = createUser();

    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should show edit button if user is admin", () => {
    const user = createUser(true);

    render(<UserAccount user={user} />);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should not show edit button if user is not admin", () => {
    const user = createUser();

    render(<UserAccount user={user} />);

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
  });
});
