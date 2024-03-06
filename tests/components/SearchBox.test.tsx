import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchbox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      searchbox: screen.getByRole("searchbox", { name: /search/i }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it("should render an input field for searching", () => {
    const { searchbox } = renderSearchbox();

    expect(searchbox).toBeInTheDocument();
  });

  it("should call onChange when 'enter' is pressed", async () => {
    const { searchbox, user, onChange } = renderSearchbox();

    const searchTerm = "SpongeBob";
    await user.type(searchbox, `${searchTerm}{enter}`);

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange when 'enter' is pressed and input is empty", async () => {
    const { searchbox, user, onChange } = renderSearchbox();

    await user.type(searchbox, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
