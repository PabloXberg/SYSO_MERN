/**
 * Tag options for sketches. Must match the backend's ALLOWED_TAGS
 * in server/models/sketchModel.js exactly.
 */
export interface TagOption {
  value: string;
  labelKey: string;
  color: string;
}

// Order matters — this is the order they appear in the filter bar.
export const TAG_OPTIONS: TagOption[] = [
  { value: "sketch",     labelKey: "tags.sketch",     color: "#ffffff" }, // white (classic pencil)
  { value: "stencil",    labelKey: "tags.stencil",    color: "#00e5ff" }, // cyan (Banksy vibe)
  { value: "graffiti",   labelKey: "tags.graffiti",   color: "#ff0066" }, // hot pink
  { value: "tag",        labelKey: "tags.tag",        color: "#00ff88" }, // neon green
  { value: "bombing",    labelKey: "tags.bombing",    color: "#ff3030" }, // fire red
  { value: "wildstyle",  labelKey: "tags.wildstyle",  color: "#ffcc00" }, // yellow
  { value: "throw-up",   labelKey: "tags.throwup",    color: "#ff6b00" }, // orange
  { value: "blockbuster",labelKey: "tags.blockbuster",color: "#a020f0" }, // purple
  { value: "character",  labelKey: "tags.character",  color: "#33b5ff" }, // blue
];

export const MAX_TAGS_PER_SKETCH = 3;

export const findTag = (value: string): TagOption | undefined =>
  TAG_OPTIONS.find((t) => t.value === value);
