import { it, expect, describe } from "vitest";

type CategoriesResponse = {
  id: number;
  name: string;
};

describe("TestingMSW", () => {
  it("should return mocked data", async () => {
    const response = await fetch("/categories");
    const data = (await response.json()) as Array<CategoriesResponse>;
    expect(data).toHaveLength(3);
  });
});
