import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../serverURL";
import PasswordInput from "../components/PasswordInput";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      alert(t("auth.passwordTooShort", "La contraseña debe tener al menos 6 caracteres"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${serverURL}users/resetpassword/${token}`,
        { password }
      );
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || t("auth.resetPasswordError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Common dark input style for non-password fields (kept for consistency
  // even though there are none here — useful if email/etc get added later)
  const darkInputStyle = {
    backgroundColor: "#0d0d0d",
    color: "#f0f0f0",
    border: "1px solid #333",
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "500px",
        margin: "0 auto",
        color: "#f0f0f0",
      }}
    >
      <h2
        style={{
          fontFamily: "MiFuente2, MiFuente, cursive",
          color: "#ffcc00",
          letterSpacing: "0.04em",
          textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
          marginBottom: "1.5rem",
        }}
      >
        {t("auth.resetPasswordTitle")}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1a1a1a",
          padding: "1.5rem",
          border: "2px solid #333",
          borderRadius: "0.4rem",
        }}
      >
        <label
          style={{
            display: "block",
            color: "#ffcc00",
            marginBottom: "0.3rem",
            fontStyle: "italic",
          }}
        >
          {t("auth.newPasswordPlaceholder")}
        </label>
        <PasswordInput
          name="password"
          placeholder={t("auth.newPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          style={{ ...darkInputStyle, marginBottom: "1rem" }}
        />

        <label
          style={{
            display: "block",
            color: "#ffcc00",
            marginBottom: "0.3rem",
            fontStyle: "italic",
          }}
        >
          {t("auth.confirmPasswordPlaceholder")}
        </label>
        <PasswordInput
          name="passwordConfirmation"
          placeholder={t("auth.confirmPasswordPlaceholder")}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          autoComplete="new-password"
          style={{ ...darkInputStyle, marginBottom: "1rem" }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "0.6rem",
            backgroundColor: "transparent",
            color: "#00ff88",
            border: "2px solid #00ff88",
            borderRadius: "0.3rem",
            fontFamily: "MiFuente2, MiFuente, cursive",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "..." : t("auth.save")}
        </button>
      </form>

      {message && (
        <p
          style={{
            color: "#ff6b6b",
            marginTop: "1rem",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
