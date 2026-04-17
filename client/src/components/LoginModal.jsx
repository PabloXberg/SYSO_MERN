import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../contexts/AuthContext";

function LoginModal({ show, onHide }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Bug fixed: original used `!== undefined || null || ""` which is always true.
    // We actually want: both fields must be present.
    if (formData.email && formData.password) {
      login(formData.email, formData.password);
      onHide();
    } else {
      alert("Falta rellenar alguno de los campos");
    }
  };

  return (
    <Modal
      scrollable
      size="sm"
      show={show}
      onHide={onHide}
      backdrop
      keyboard={false}
      centered
      style={{ maxHeight: "28rem", padding: "3rem" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Iniciar Sesión</Modal.Title>
      </Modal.Header>

      <Form.Group className="small mb-1" controlId="formBasicPassword">
        <Form.Label>
          <i>Correo Electrónico</i>
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="email"
          onChange={handleChange}
        />
        <Form.Label className="text-muted">
          <i>Contraseña</i>
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <Form.Label className="text-muted">
          {/* Route matches App.tsx: "/forgotPassword" */}
          <Link to="/forgotPassword" onClick={onHide}>
            Ha olvidado su contraseña?
          </Link>
        </Form.Label>
      </Form.Group>

      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="success" style={{ cursor: "pointer" }} onClick={handleSubmit}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
