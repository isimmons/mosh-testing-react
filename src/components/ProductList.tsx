import axios, { AxiosError } from "axios";
// import { useEffect, useState } from "react";
import { Product } from "../entities";
import { ColorRing } from "react-loader-spinner";
import { useQuery } from "react-query";

const ProductList = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  // const [products, setProducts] = useState<Product[]>([]);
  // const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   const fetchProducts = async (): Promise<void> => {
  //     try {
  //       setLoading(true);
  //       const { data } = await axios.get<Product[]>("/products");
  //       setProducts(data);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       if (error instanceof AxiosError) setError(error.message);
  //       else setError("An unexpected error occurred");
  //     }
  //   };
  //   void fetchProducts();
  // }, []);

  if (isLoading)
    return (
      <div>
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  if (!products || products.length === 0) return <p>No products available.</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
