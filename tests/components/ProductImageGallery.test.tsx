import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  const createImageUrls = () => {
    return [
      "https://www.google.com",
      "https://www.epicweb.dev",
      "https://www.totaltypescript.com",
    ];
  };

  it("should have correct prop types", () => {
    expectTypeOf(ProductImageGallery).toBeFunction();
    expectTypeOf(ProductImageGallery)
      .parameter(0)
      .toMatchTypeOf<{ imageUrls: Array<string> }>();
  });

  it("should render null if imageUrls array is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render a list of images if given an array of image urls", () => {
    const imageUrls = createImageUrls();

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole<HTMLImageElement>("img");

    expect(images).toHaveLength(3);

    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
