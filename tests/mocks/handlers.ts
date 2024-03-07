import { http, HttpResponse } from "msw";
import { products, categories } from "./data";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json(categories);
  }),

  http.get("/products", () => {
    return HttpResponse.json(products);
  }),

  http.get("/products/:id", ({ params }) => {
    const { id } = params;
    if (typeof id !== "string") throw Error("id should be of type string");

    const product = products.find((p) => p.id === parseInt(id));
    if (!product) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(product);
  }),
];
