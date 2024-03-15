import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Select, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Product } from "../entities";
import useCategories from "../hooks/useCategories";
import {
  ProductFormData,
  productFormSchema,
} from "../validationSchemas/productSchema";
import ErrorMessage from "./ErrorMessage";

interface Props {
  product?: Product;
  onSubmit: (product: ProductFormData) => Promise<void>;
}

const ProductForm = ({ product, onSubmit }: Props) => {
  const { data: categories, isLoading } = useCategories();
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: product,
    resolver: zodResolver(productFormSchema),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <form
      name="product"
      onSubmit={(event) =>
        void handleSubmit(async (formData) => {
          try {
            setSubmitting(true);
            await onSubmit(formData);
          } catch (error) {
            toast.error("An unexpected error occurred");
          } finally {
            setSubmitting(false);
          }
        })(event)
      }
      className="space-y-3"
    >
      <Box>
        <TextField.Root className="max-w-sm">
          <TextField.Input
            aria-label="name"
            placeholder="Name"
            autoFocus
            {...register("name")}
            size="3"
          />
        </TextField.Root>
        <ErrorMessage error={errors.name} />
      </Box>
      <Box>
        <TextField.Root className="w-24">
          <TextField.Slot>$</TextField.Slot>
          <TextField.Input
            aria-label="price"
            placeholder="Price"
            maxLength={5}
            size="3"
            {...register("price", { valueAsNumber: true })}
          />
        </TextField.Root>
        <ErrorMessage error={errors.price} />
      </Box>
      {categories ? (
        <Box>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select.Root
                size="3"
                defaultValue={product?.categoryId.toString() || undefined}
                onValueChange={(value) => field.onChange(+value)}
              >
                <Select.Trigger aria-label="category" placeholder="Category" />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Category</Select.Label>
                    {categories.map((category) => (
                      <Select.Item
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            )}
          />
          <ErrorMessage error={errors.categoryId} />
        </Box>
      ) : null}
      <Button type="submit" size="3" disabled={isSubmitting}>
        Submit
      </Button>
      <Button type="reset" size="3" onClick={() => reset()}>
        Reset Form
      </Button>
    </form>
  );
};

export default ProductForm;
