import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { http, HttpResponse, delay } from "msw";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { db } from "../mocks/db";
import { QueryClient, QueryClientProvider } from "react-query";

describe("ProductList", () => {
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

  const renderComponent = () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  it("should render the list of products", async () => {
    renderComponent();

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toEqual(3);
  });

  it("should render 'no products available' if no products found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));

    renderComponent();

    const message = await screen.findByText(/no products/i);

    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    const loader = await screen.findByRole("progressbar", {
      name: "color-ring-loading",
    });
    expect(loader).toBeInTheDocument();
  });

  it("should remove loading indicator after data is fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: "color-ring-loading" })
    );
  });

  it("should remove loading indicator if data fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: "color-ring-loading" })
    );
  });
});
