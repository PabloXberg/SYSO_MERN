import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../serverURL";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert("La contraseña y la confirmación no coinciden");
      return;
    }

    try {
      const res = await axios.post(
        `${serverURL}users/resetpassword/${token}`,
        { password }
      );
      alert(res.data.message);
      // BUG FIX: original was `Navigate('/')` — Navigate is a component, not a
      // function. That line silently did nothing and the user was never redirected.
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error al restablecer la contraseña"
      );
    }
  };

  return (
    <div>
      <h2>Nueva Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Ingrese nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirme nueva contraseña"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">GUARDAR</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
