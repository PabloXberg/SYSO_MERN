import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { serverURL } from "../serverURL";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${serverURL}users/forgotpassword`, {
        email,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "");
    } finally {
      setSubmitting(false);
    }
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
        {t("auth.forgotPasswordTitle")}
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
          {t("auth.emailPlaceholder")}
        </label>
        <input
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            marginBottom: "1rem",
            backgroundColor: "#0d0d0d",
            color: "#f0f0f0",
            border: "1px solid #333",
            borderRadius: "0.3rem",
          }}
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
          {submitting ? "..." : t("auth.send")}
        </button>
      </form>

      {message && (
        <p
          style={{
            color: "#ddd",
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "0.3rem",
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

export default ForgotPassword;
