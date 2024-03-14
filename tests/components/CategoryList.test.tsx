import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach((item) => {
      const category = db.category.create({
        name: "Category " + item,
      });
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({
      where: { id: { in: categoryIds } },
    });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders });
  };

  it("should render a list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // 3 ways to do this
    // expect(
    //   screen.getByRole("listitem", { name: categories[0].name })
    // ).toBeInTheDocument();
    // expect(
    //   screen.getByRole("listitem", { name: categories[1].name })
    // ).toBeInTheDocument();
    // expect(
    //   screen.getByRole("listitem", { name: categories[2].name })
    // ).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("listitem", { name: category.name })
      ).toBeInTheDocument();
    });

    // if there is need to wait or use a findByRole since it doesn't work well inside a forEach
    // use promises and Promise.all().then()
    // const promises = categories.map((category) =>
    //   screen.findByRole("listitem", { name: category.name })
    // );

    // await Promise.all(promises).then((elements) => {
    //   for (const element of elements) {
    //     expect(element).toBeInTheDocument();
    //   }
    // });
  });

  it("should render a loading message when fetching categories", () => {
    simulateDelay("/categories");

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render an error message if fetching categories fails", async () => {
    simulateError("/categories");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
