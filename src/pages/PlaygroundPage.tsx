// import Onboarding from "../components/Onboarding";
// import TermsAndConditions from "../components/TermsAndConditions";
// import { Theme } from "@radix-ui/themes";
// import ExpandableText from "../components/ExpandableText";
// import OrderStatusSelector from "../components/OrderStatusSelector";
// import ProductList from "../components/ProductList";
// import Label from "../components/Label";
import ProductForm from "../components/ProductForm";

import { ProductFormData } from "../validationSchemas/productSchema";

const foo = async (product: ProductFormData) => {
  try {
    await new Promise((resolve) => resolve(console.log(product)));
  } catch (error) {
    console.error(error);
  }
};

const existingProduct = {
  id: 1,
  name: "foo",
  price: 2,
  categoryId: 2,
};

const PlaygroundPage = () => {
  return <ProductForm product={existingProduct} onSubmit={foo} />;
};

export default PlaygroundPage;
