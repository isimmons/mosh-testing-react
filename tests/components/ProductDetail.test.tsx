import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({
      where: { id: { equals: productId } },
    });
  });

  it("should render the product details ", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
      strict: true,
    });
    render(<ProductDetail productId={product.id} />);

    expect(
      await screen.findByText(new RegExp(product.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product.price.toString()))
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