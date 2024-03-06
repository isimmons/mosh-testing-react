import { render, screen } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const correctLabels = ["New", "Processed", "Fulfilled"];
  const renderSelect = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      selector: screen.getByRole("combobox", { name: /status/i }),
      user: userEvent.setup(),
      getOptionByLabel: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      onChange,
    };
  };

  it("should render 'New' as the default value", () => {
    const { selector } = renderSelect();

    expect(selector).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { selector, user } = renderSelect();

    await user.click(selector);
    const options = await screen.findAllByRole("option");
    const labels = options.map((option) => option.textContent);

    expect(options).toHaveLength(3);
    expect(labels).toEqual(correctLabels);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $value when $value option is selected ",
    async ({ label, value }) => {
      const { selector, user, getOptionByLabel, onChange } = renderSelect();
      await user.click(selector);

      const option = await getOptionByLabel(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' when 'new' option is selected", async () => {
    const { selector, user, getOptionByLabel, onChange } = renderSelect();
    await user.click(selector);

    const processedOption = await getOptionByLabel(/processed/i);
    await user.click(processedOption);

    await user.click(selector);

    const newOption = await getOptionByLabel(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
