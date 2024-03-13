import { Text } from "@radix-ui/themes";
import useLanguage from "../hooks/useLanguage";

type LabelProps = {
  labelId: string;
};

const Label = ({ labelId }: LabelProps) => {
  const { getLabel } = useLanguage();

  return <Text role="label">{getLabel(labelId)}</Text>;
};

export default Label;
