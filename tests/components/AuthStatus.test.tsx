import { render, screen } from "@testing-library/react";
import { mockAuthState } from "../utils";
import AuthStatus from "../../src/components/AuthStatus";

describe("AuthStatus", () => {
  it("should render the loading message while fetching auth status", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render a login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole("button", { name: /log in/i }));
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it("should render the users name if they are logged in", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "foo" },
    });

    render(<AuthStatus />);

    expect(screen.getByText("foo")).toBeInTheDocument();
  });

  it("should render a logout button if the user is logged in", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "foo" },
    });

    render(<AuthStatus />);

    expect(screen.getByRole("button", { name: /log out/i }));
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
