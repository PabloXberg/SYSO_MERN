import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

interface SearchBarProps {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Called after the user stops typing (debounced) */
  onSearch: (query: string) => void;
  /** Optional starting value */
  initialValue?: string;
}

/**
 * Reusable search input with debouncing.
 * - Waits 300ms after the user stops typing before firing onSearch.
 * - This prevents filtering the list on every keystroke (feels snappier).
 */
const SearchBar = ({
  placeholder = "Buscar...",
  onSearch,
  initialValue = "",
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "500px",
        margin: "0 auto",
        width: "100%",
      }}
    >
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
