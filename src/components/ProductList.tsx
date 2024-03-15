import axios, { AxiosError } from "axios";
import { ColorRing } from "react-loader-spinner";
import { useQuery } from "react-query";
import { Product } from "../entities";

const ProductList = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

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
