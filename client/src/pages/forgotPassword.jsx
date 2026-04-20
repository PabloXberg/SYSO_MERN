import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { serverURL } from "../serverURL";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverURL}users/forgotpassword`, { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>{t("auth.forgotPasswordTitle")}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
          {t("auth.send")}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
