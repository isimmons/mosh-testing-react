import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ categoryId: category.id });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderForm();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const { waitForFormToLoad } = renderForm(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field", async () => {
    const { waitForFormToLoad } = renderForm();
    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForFormToLoad } = renderForm();
    const form = await waitForFormToLoad();

    const user = userEvent.setup();
    await user.type(form.priceInput, "10");
    await user.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(form.submitButton);

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});

const renderForm = (product?: Product) => {
  render(<ProductForm product={product} onSubmit={vi.fn()} />, {
    wrapper: AllProviders,
  });

  return {
    waitForFormToLoad: async () => {
      await screen.findByRole("form");

      return {
        nameInput: screen.getByRole("textbox", { name: /name/i }),
        priceInput: screen.getByRole("textbox", { name: /price/i }),
        categoryInput: screen.getByRole("combobox", { name: /category/i }),
        submitButton: screen.getByRole("button", { name: /submit/i }),
      };
    },
  };
};
