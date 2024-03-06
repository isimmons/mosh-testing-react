import { useState, type KeyboardEventHandler } from "react";

type SearchBoxProps = {
  onChange: (text: string) => void;
};

const SearchBox = ({ onChange }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && searchTerm) onChange(searchTerm);
  };

  return (
    <div>
      <input
        type="search"
        aria-label="search"
        placeholder="Search..."
        className="input"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBox;
