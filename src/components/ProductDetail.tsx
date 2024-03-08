// import { useEffect, useState } from "react";
import { Product } from "../entities";
import { useQuery } from "react-query";
import axios, { type AxiosError } from "axios";

const ProductDetail = ({ productId }: { productId: number }) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, AxiosError>({
    queryKey: ["products", "productId"],
    queryFn: () =>
      axios
        .get<Product>(`/products/${productId.toString()}`)
        .then((res) => res.data),
  });

  // const [product, setProduct] = useState<Product | undefined>(undefined);
  // const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   if (!productId) {
  //     setError("Invalid ProductId");
  //     return;
  //   }

  //   setLoading(true);
  //   fetch("/products/" + productId)
  //     .then((res): Promise<Product> => res.json())
  //     .then((data) => setProduct(data))
  //     .catch((err) => setError((err as Error).message))
  //     .finally(() => setLoading(false));
  // }, [productId]);

  if (!productId) return <div>Invalid productId</div>;

  if (isLoading)
    return (
      <div role="progressbar" aria-label="loading products">
        Loading...
      </div>
    );

  if (error) {
    console.log(error.message);
    return <div>Error: The given product was not found.</div>;
  }

  if (!product) return <div>Error: The given product was not found.</div>;

  return (
    <div>
      <h1>Product Detail</h1>
      <div>Name: {product.name}</div>
      <div>Price: ${product.price}</div>
    </div>
  );
};

export default ProductDetail;
