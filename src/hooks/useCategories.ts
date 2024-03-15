import axios from "axios";
import { useQuery } from "react-query";
import { Category } from "../entities";

const useCategories = () => {
  return useQuery<Category[], Error>({
    cacheTime: 0,
    queryKey: ["categories"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });
};

export default useCategories;
