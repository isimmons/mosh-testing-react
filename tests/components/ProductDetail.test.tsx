import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
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

  it("should render an error if data fetching fails", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json({});
      })
    );

    render(<ProductDetail productId={1} />);

    expect(
      await screen.findByRole("progressbar", { name: /loading products/i })
    ).toBeInTheDocument();
  });

  it("should remove loading indicator after data is fetched", async () => {
    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /loading products/i })
    );
  });

  it("should remove loading indicator if data fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /loading products/i })
    );
  });
});
