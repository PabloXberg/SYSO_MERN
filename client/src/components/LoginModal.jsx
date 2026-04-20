import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../contexts/AuthContext";

function LoginModal({ show, onHide }) {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.email && formData.password) {
      login(formData.email, formData.password);
      onHide();
    } else {
      alert(t("auth.missingLoginFields"));
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
        <Modal.Title>{t("auth.login")}</Modal.Title>
      </Modal.Header>

      <Form.Group className="small mb-1" controlId="formBasicPassword">
        <Form.Label>
          <i>{t("auth.email")}</i>
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder={t("auth.email").toLowerCase()}
          onChange={handleChange}
        />
        <Form.Label className="text-muted">
          <i>{t("auth.password")}</i>
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder={t("auth.password")}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <Form.Label className="text-muted">
          <Link to="/forgotPassword" onClick={onHide}>
            {t("auth.forgotPassword")}
          </Link>
        </Form.Label>
      </Form.Group>

      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          {t("auth.close")}
        </Button>
        <Button variant="success" style={{ cursor: "pointer" }} onClick={handleSubmit}>
          {t("auth.accept")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
