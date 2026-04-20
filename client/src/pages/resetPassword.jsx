import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../serverURL";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert(t("auth.passwordMismatch"));
      return;
    }

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
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>{t("auth.resetPasswordTitle")}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder={t("auth.newPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="password"
          placeholder={t("auth.confirmPasswordPlaceholder")}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
          {t("auth.save")}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
