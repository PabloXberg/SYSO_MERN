import { useTranslation } from "react-i18next";
import { TAG_OPTIONS, MAX_TAGS_PER_SKETCH } from "../constants/tags";
import TagChip from "./TagChip";

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

/**
 * UI for picking up to MAX_TAGS_PER_SKETCH tags.
 * Click a tag to add/remove it. Visual feedback on selected state.
 */
const TagSelector = ({ selected, onChange }: TagSelectorProps) => {
  const { t } = useTranslation();

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((t) => t !== value));
    } else if (selected.length < MAX_TAGS_PER_SKETCH) {
      onChange([...selected, value]);
    }
  };

  return (
    <div style={{ margin: "0.5rem 0" }}>
      <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 0.4rem 0" }}>
        {t("tags.pickUpTo", { count: MAX_TAGS_PER_SKETCH })}{" "}
        <i>({selected.length}/{MAX_TAGS_PER_SKETCH})</i>
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          padding: "0.5rem",
          background: "#f5f5f5",
          borderRadius: "0.5rem",
        }}
      >
        {TAG_OPTIONS.map((opt) => (
          <div key={opt.value} onClick={() => toggle(opt.value)}>
            <TagChip
              tag={opt.value}
              size="md"
              active={selected.includes(opt.value)}
              onClick={() => toggle(opt.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
