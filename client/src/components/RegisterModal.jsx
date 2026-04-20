import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DefaultImage from "../avatar-placeholder.gif";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";

function RegisterModal({ show, onHide, onLoadingChange }) {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    info: "",
    avatar: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert(t("auth.missingFields"));
      return;
    }

    const submitData = new FormData();
    submitData.append("email", formData.email);
    submitData.append("username", formData.username);
    submitData.append("password", formData.password);
    submitData.append("info", formData.info);
    submitData.append("avatar", formData.avatar || DefaultImage);

    onLoadingChange?.(true);
    try {
      await fetch(`${serverURL}users/new`, {
        method: "POST",
        body: submitData,
      });
      onHide();
      login(formData.email, formData.password);
    } catch (error) {
      console.error(error);
      alert(t("auth.registrationError"));
      onHide();
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <Modal
      className="userRegisterModal"
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header style={{ fontSize: "small" }} closeButton>
        <Modal.Title style={{ fontSize: "medium" }}>{t("auth.register")}</Modal.Title>
      </Modal.Header>

      <div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            alt="Avatar"
            src={avatarPreview || DefaultImage}
            style={{
              border: "black 2px solid",
              borderRadius: "50%",
              width: "8rem",
              height: "8rem",
              alignSelf: "center",
            }}
          />
          <br />
          <input
            type="file"
            name="avatar"
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleFile}
          />
        </div>

        <div className="dataform">
          <Form.Group
            className="mb-4"
            controlId="formBasicEmail"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Form.Label>(*) {t("auth.email")}:</Form.Label>
            <Form.Control
              style={{ maxWidth: "20rem" }}
              type="email"
              name="email"
              placeholder={t("auth.email").toLowerCase()}
              onChange={handleChange}
            />

            <Form.Label>(*) {t("auth.password")}:</Form.Label>
            <Form.Control
              style={{ maxWidth: "20rem" }}
              type="password"
              name="password"
              placeholder={t("auth.password")}
              onChange={handleChange}
            />

            <Form.Label>(*) {t("auth.username")}:</Form.Label>
            <Form.Control
              style={{ maxWidth: "20rem" }}
              name="username"
              placeholder={t("auth.username").toLowerCase()}
              onChange={handleChange}
            />

            <Form.Label>{t("auth.info")}</Form.Label>
            <Form.Control
              style={{ maxWidth: "20rem" }}
              type="text"
              name="info"
              placeholder={t("auth.personalInfo")}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <Modal.Footer
          style={{ display: "flex", flexDirection: "row", alignContent: "space-around" }}
        >
          <Button variant="danger" onClick={onHide}>
            {t("auth.cancel")}
          </Button>
          <Button variant="success" style={{ cursor: "pointer" }} onClick={handleSubmit}>
            {t("auth.submit")}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default RegisterModal;
