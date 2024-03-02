import { render, screen } from "@testing-library/react";
import { it, expect, describe, expectTypeOf } from "vitest";
import "@testing-library/jest-dom/vitest";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  /* playing around with vitest type checking. See note in readme*/
  it("should have the correct props type", () => {
    expectTypeOf(Greet).toBeFunction();
    expectTypeOf(Greet).parameter(0).toMatchTypeOf<{ name?: string }>();
  });

  it("should render Hello with the name when name is provided.", () => {
    render(<Greet name="foo" />);

    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/foo/i);
  });

  it("should render login button when name is not provided.", () => {
    render(<Greet />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
