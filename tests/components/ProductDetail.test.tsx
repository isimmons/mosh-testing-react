import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({
      where: { id: { in: productIds } },
    });
  });

  it("should render the product details ", async () => {
    const products = db.product.getAll();
    render(<ProductDetail productId={products[0].id} />);

    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found ", async () => {
    server.use(
      http.get("/products/1", () => HttpResponse.json(null, { status: 404 }))
    );

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render error if productId is invalid ", async () => {
    render(<ProductDetail productId={0} />);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });
});
