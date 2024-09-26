import React, { useState } from 'react';
import axios from 'axios';
import { serverURL } from '../serverURL';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

const res = await axios.post(`${serverURL}users/forgotpassword`, { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Contraseña olvidada..</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="ingrese su cuenta de correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">ENVIAR</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
