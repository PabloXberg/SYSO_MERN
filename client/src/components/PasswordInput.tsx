import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

interface Props {
  /** Field name attribute (e.g. "password", "newPassword") */
  name: string;
  /** Placeholder text */
  placeholder?: string;
  /** Current value (controlled) — if not passed, the input runs uncontrolled */
  value?: string;
  /** onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional onKeyDown */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Defaults to false */
  required?: boolean;
  /** Bootstrap className passthrough */
  className?: string;
  /** Style for the OUTER WRAPPER (margins, layout) */
  style?: React.CSSProperties;
  /** Style for the INPUT itself (background, color, border) — defaults to dark theme */
  inputStyle?: React.CSSProperties;
  /** id for label association */
  id?: string;
  /** Auto-complete hint, e.g. "current-password" or "new-password" */
  autoComplete?: string;
}

/**
 * Default dark-theme styling for the input. Anywhere this component is
 * used in the app, the form is on a dark background, so this looks right
 * by default. Override with `inputStyle` prop if you ever need it lighter.
 */
const DEFAULT_INPUT_STYLE: React.CSSProperties = {
  backgroundColor: "#0d0d0d",
  color: "#f0f0f0",
  border: "1px solid #333",
};

/**
 * PasswordInput — wrapper around Bootstrap Form.Control with a toggle
 * eye button that shows/hides the password.
 *
 * Drop-in replacement for any:
 *   <Form.Control type="password" ... />
 *
 * Two style props:
 *   - `style`      → outer wrapper (margins, width, etc.)
 *   - `inputStyle` → the input itself (bg color, text color, border)
 *
 * The input defaults to a dark theme to match the rest of the app.
 */
const PasswordInput = ({
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  required,
  className,
  style,
  inputStyle,
  id,
  autoComplete = "current-password",
}: Props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  // Merge default dark style with any overrides (also reserve right
  // padding so the eye icon doesn't overlap the typed text).
  const finalInputStyle: React.CSSProperties = {
    ...DEFAULT_INPUT_STYLE,
    ...inputStyle,
    paddingRight: "2.5rem",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        ...style,
      }}
    >
      <Form.Control
        id={id}
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        className={className}
        autoComplete={autoComplete}
        style={finalInputStyle}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={
          visible
            ? t("auth.hidePassword", "Ocultar contraseña")
            : t("auth.showPassword", "Mostrar contraseña")
        }
        title={
          visible
            ? t("auth.hidePassword", "Ocultar contraseña")
            : t("auth.showPassword", "Mostrar contraseña")
        }
        style={{
          position: "absolute",
          right: "0.4rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          padding: "0.25rem",
          cursor: "pointer",
          color: "#ffcc00", // gold to match the rest of the theme
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <i
          className="material-icons"
          style={{ fontSize: "1.25rem", lineHeight: 1 }}
        >
          {visible ? "visibility_off" : "visibility"}
        </i>
      </button>
    </div>
  );
};

export default PasswordInput;
