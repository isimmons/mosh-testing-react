import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector", () => {
  it("should render Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent(validProduct);

    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getAddToCartButton, getQuantityControls } =
      renderComponent(validProduct);

    await userEvent.click(getAddToCartButton()!);

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toHaveTextContent("-");
    expect(incrementButton).toHaveTextContent("+");
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getAddToCartButton, getQuantityControls } =
      renderComponent(validProduct);

    await userEvent.click(getAddToCartButton()!);

    const { quantity, incrementButton } = getQuantityControls();
    await userEvent.click(incrementButton!);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { getAddToCartButton, getQuantityControls } =
      renderComponent(validProduct);

    await userEvent.click(getAddToCartButton()!);

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    await userEvent.click(incrementButton!);
    await userEvent.click(decrementButton!);

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const { getAddToCartButton, getQuantityControls } =
      renderComponent(validProduct);

    await userEvent.click(getAddToCartButton()!);

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    await userEvent.click(decrementButton!);

    expect(quantity).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  const validProduct: Product = {
    id: 1,
    name: "Milk",
    price: 5,
    categoryId: 1,
  };

  const renderComponent = (product: Product) => {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCartButton: () =>
        screen.queryByRole("button", { name: /add to cart/i }),
      getQuantityControls: () => ({
        decrementButton: screen.queryByRole("button", { name: /decrement/i }),
        incrementButton: screen.queryByRole("button", { name: /increment/i }),
        quantity: screen.queryByRole("status", { name: /quantity/i }),
      }),
    };
  };
});
