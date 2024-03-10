import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it("should render form fields", async () => {
    const { waitForFormToLoad, getFormInputs } = renderForm();
    await waitForFormToLoad();

    const { nameInput, priceInput, categoryInput } = getFormInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getFormInputs } = renderForm(product);
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getFormInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });
});

const renderForm = (product?: Product) => {
  render(<ProductForm product={product} onSubmit={vi.fn()} />, {
    wrapper: AllProviders,
  });

  return {
    waitForFormToLoad: () => screen.findByRole("form"),
    getFormInputs: () => {
      return {
        nameInput: screen.getByRole("textbox", { name: /name/i }),
        priceInput: screen.getByRole("textbox", { name: /price/i }),
        categoryInput: screen.getByRole("combobox", { name: /category/i }),
      };
    },
  };
};
