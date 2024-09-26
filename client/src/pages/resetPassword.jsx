import React, { useState } from 'react';
import { useParams,  Navigate} from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../serverURL';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) { alert("la contraseña y la confirmacion no coinciden") }
    else {
      try {
      const res = await axios.post(`${serverURL}users/resetpassword/${token}`, { password });
        setMessage(res.data.message);
        Navigate('/')
       window.location.href = '/'
    } catch (error) {
      setMessage(error.response.data.message);
    }}
   
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
          placeholder="confirme nueva contraseña"
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
