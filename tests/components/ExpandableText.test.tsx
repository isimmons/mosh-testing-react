import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const shortText = "a".repeat(limit - 1);
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render the full text if less than 255 characters", () => {
    render(<ExpandableText text={shortText} />);

    expect(screen.getByText(shortText)).toBeInTheDocument();
  });

  it("should render the truncated text if more than 255 characters", () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /more/i });
    expect(button).toBeInTheDocument();
  });

  it("should expand the truncated text when 'Show more' button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /more/i });
    expect(button).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should truncate the expanded text when 'Show less' button is clicked", async () => {
    render(<ExpandableText text={longText} />);
    const user = userEvent.setup();
    const showMorebutton = screen.getByRole("button", { name: /more/i });
    await user.click(showMorebutton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showLessButton).toHaveTextContent(/more/i);
  });
});
