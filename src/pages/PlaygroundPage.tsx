// import Onboarding from "../components/Onboarding";
// import TermsAndConditions from "../components/TermsAndConditions";
import { Theme } from "@radix-ui/themes";
// import ExpandableText from "../components/ExpandableText";
import OrderStatusSelector from "../components/OrderStatusSelector";

const PlaygroundPage = () => {
  return (
    <Theme>
      <OrderStatusSelector onChange={console.log} />
    </Theme>
  );
};

export default PlaygroundPage;
