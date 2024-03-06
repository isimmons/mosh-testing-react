import { useState } from "react";

type ExpandableTextProps = {
  text: string;
};

const ExpandableText = ({ text }: ExpandableTextProps) => {
  const limit = 255;
  const [isExpanded, setExpanded] = useState(false);

  if (text.length <= limit) return <article>{text}</article>;

  return (
    <div>
      {isExpanded ? (
        <article>{text}</article>
      ) : (
        <article>{text.substring(0, limit)}...</article>
      )}
      <button onClick={() => setExpanded(!isExpanded)} className="btn">
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ExpandableText;
