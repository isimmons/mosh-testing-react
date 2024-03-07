import { it, describe } from "vitest";
import { db } from "./mocks/db";

describe("TestingMSW", () => {
  it("should return mocked data", () => {
    const product = db.product.create();
    console.log(product);
  });
});
