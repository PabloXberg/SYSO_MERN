/**
 * Tag options for sketches. Must match the backend's ALLOWED_TAGS
 * in server/models/sketchModel.js exactly.
 *
 * Reduced color palette — street / spray-paint vibes:
 *   - White, red, yellow, cyan and green.
 *   - Repeated across tags to keep visual consistency.
 */
export interface TagOption {
  value: string;
  labelKey: string;
  color: string;
}

export const TAG_OPTIONS: TagOption[] = [
  { value: "sketch",    labelKey: "tags.sketch",    color: "#f5f5f5" }, // white
  { value: "stencil",   labelKey: "tags.stencil",   color: "#00e5ff" }, // cyan
  { value: "graffiti",  labelKey: "tags.graffiti",  color: "#ff3030" }, // red
  { value: "tag",       labelKey: "tags.tag",       color: "#ffcc00" }, // yellow
  { value: "bombing",   labelKey: "tags.bombing",   color: "#ff3030" }, // red
  { value: "wildstyle", labelKey: "tags.wildstyle", color: "#ffcc00" }, // yellow
  { value: "throw-up",  labelKey: "tags.throwup",   color: "#00e5ff" }, // cyan
  { value: "trains",    labelKey: "tags.trains",    color: "#00ff88" }, // neon green
  { value: "character", labelKey: "tags.character", color: "#f5f5f5" }, // white
];

export const MAX_TAGS_PER_SKETCH = 3;

export const findTag = (value: string): TagOption | undefined =>
  TAG_OPTIONS.find((t) => t.value === value);
