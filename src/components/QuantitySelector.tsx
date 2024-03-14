import { Button, Flex, Text } from "@radix-ui/themes";
import { useCart } from "../hooks/useCart";
import { Product } from "../entities";

const QuantitySelector = ({ product }: { product: Product }) => {
  const { getItem, addToCart, removeFromCart } = useCart();

  const cartItem = getItem(product);
  if (!cartItem)
    return <Button onClick={() => addToCart(product)}>Add to Cart</Button>;

  return (
    <Flex gap="3" align="center" role="spinbutton">
      <Button
        onClick={() => removeFromCart(product)}
        aria-label="decrement item quantity"
      >
        -
      </Button>
      <Text role="status" aria-label="current item quantity">
        {cartItem.quantity}
      </Text>
      <Button
        onClick={() => addToCart(product)}
        aria-label="increment item quantity"
      >
        +
      </Button>
    </Flex>
  );
};

export default QuantitySelector;
