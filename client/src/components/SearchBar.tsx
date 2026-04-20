import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar = ({
  placeholder,
  onSearch,
  initialValue = "",
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          fontSize: "1rem",
          padding: "0.6rem 1rem",
          borderRadius: "2rem",
          border: "2px solid #333",
        }}
      />
    </div>
  );
};

export default SearchBar;
