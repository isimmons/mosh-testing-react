import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Toaster } from "react-hot-toast";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

let category: Category;
let product: Product;

describe("ProductForm", () => {
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

  it.skip("should reset the form", async () => {
    const { waitForFormToLoad } = renderForm(product);

    const {
      nameInput,
      priceInput,
      categoryInput,
      resetButton,
      fill,
      validData,
    } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);

    await fill(validData);

    expect(nameInput).toHaveValue(validData.name);
    expect(priceInput).toHaveValue(validData.price?.toString());
    expect(categoryInput).toHaveTextContent(category.name);

    await userEvent.click(resetButton);

    // expect(nameInput).toHaveValue(product.name);
    // expect(priceInput).toHaveValue(product.price.toString());
    // expect(categoryInput).toHaveTextContent(category.name);

    expect(await screen.findByRole("textbox", { name: /name/i })).toHaveValue(
      product.name
    );
    expect(await screen.findByRole("textbox", { name: /price/i })).toHaveValue(
      product.price.toString()
    );
    expect(
      await screen.findByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "empty string",
      name: " ",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });
      await userEvent.click(form.submitButton);

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });
      await userEvent.click(form.submitButton);

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should display an error if category id NaN", async () => {
    server.use(
      http.get("/categories", () =>
        HttpResponse.json([{ id: "foo", name: "foo" }])
      )
    );
    const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });
    await userEvent.click(form.submitButton);

    expectErrorToBeInTheDocument(/nan/i);
  });

  it("should call onSubmit with the correct data", async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    const form = await waitForFormToLoad();
    await form.fill(form.validData);
    await userEvent.click(form.submitButton);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData;

    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it("should display toast if submission fails", async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockRejectedValue({});
    const form = await waitForFormToLoad();
    await form.fill(form.validData);
    await userEvent.click(form.submitButton);

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable the submit button upon submission", async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockReturnValue(new Promise(() => {}));
    const form = await waitForFormToLoad();
    await form.fill(form.validData);
    await userEvent.click(form.submitButton);

    expect(form.submitButton).toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockResolvedValue({});
    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).toBeEnabled();
  });

  it("should re-enable the submit button if submission fails", async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockRejectedValue({});
    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).toBeEnabled();
  });
});

const renderForm = (product?: Product) => {
  const onSubmit = vi.fn();

  render(
    <>
      <ProductForm product={product} onSubmit={onSubmit} />
      <Toaster />
    </>,
    { wrapper: AllProviders }
  );

  return {
    onSubmit,
    expectErrorToBeInTheDocument: (errorMessage: string | RegExp) => {
      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    },

    waitForFormToLoad: async () => {
      await screen.findByRole("form");

      const nameInput = screen.getByRole("textbox", { name: /name/i });
      const priceInput = screen.getByRole("textbox", { name: /price/i });
      const categoryInput = screen.getByRole("combobox", { name: /category/i });
      const submitButton = screen.getByRole("button", { name: /submit/i });
      const resetButton = screen.getByRole("button", { name: /reset/i });

      type FormData = {
        id: number;
        name: string | undefined;
        price: number | string | undefined;
        categoryId: number | string | undefined;
      };

      const validData: FormData = {
        id: 1,
        name: "a",
        price: 1,
        categoryId: category.id,
      };

      const fill = async (product: FormData) => {
        const user = userEvent.setup();

        if (product.name !== undefined) {
          await user.clear(nameInput);
          await user.type(nameInput, product.name);
        }

        if (product.price !== undefined) {
          await user.clear(priceInput);
          await user.type(priceInput, product.price.toString());
        }

        await user.tab();
        await user.click(categoryInput);
        const options = screen.getAllByRole("option");
        await user.click(options[0]);
      };

      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        resetButton,
        fill,
        validData,
      };
    },
  };
};
