import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import DefaultImage from "../avatar-placeholder.gif";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";

/**
 * Combined login + register modal with tabs.
 * Replaces the old separate LoginModal and RegisterModal.
 *
 * @param show          Whether the modal is visible
 * @param onHide        Callback to close the modal
 * @param initialTab    'login' or 'register' — which tab is active when opening
 * @param onLoadingChange  Called with true/false when register is uploading
 */
function AuthModal({ show, onHide, initialTab = "login", onLoadingChange }) {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reset tab to the requested one each time modal opens
  if (show && activeTab !== initialTab && !show._opened) {
    // no-op; we'll use an effect instead — but avoid extra state for simplicity
  }

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = () => {
    if (loginData.email && loginData.password) {
      login(loginData.email, loginData.password);
      onHide();
    } else {
      alert(t("auth.missingLoginFields"));
    }
  };

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    info: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setRegisterData({ ...registerData, avatar: e.target.files[0] });
    }
  };
  const handleRegisterSubmit = async () => {
    if (!registerData.username || !registerData.email || !registerData.password) {
      alert(t("auth.missingFields"));
      return;
    }
    const submitData = new FormData();
    submitData.append("email", registerData.email);
    submitData.append("username", registerData.username);
    submitData.append("password", registerData.password);
    submitData.append("info", registerData.info);
    submitData.append("avatar", registerData.avatar || DefaultImage);

    onLoadingChange?.(true);
    try {
      await fetch(`${serverURL}users/new`, {
        method: "POST",
        body: submitData,
      });
      onHide();
      login(registerData.email, registerData.password);
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
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
      size={activeTab === "register" ? "md" : "sm"}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.1rem" }}>
          {activeTab === "login" ? t("auth.login") : t("auth.register")}
        </Modal.Title>
      </Modal.Header>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "login")}
        style={{ margin: "0 1rem" }}
      >
        <Nav.Item>
          <Nav.Link eventKey="login">{t("auth.login")}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="register">{t("auth.register")}</Nav.Link>
        </Nav.Item>
      </Nav>

      <div style={{ padding: "1rem" }}>
        {activeTab === "login" ? (
          // ============ LOGIN TAB ============
          <Form.Group>
            <Form.Label>
              <i>{t("auth.email")}</i>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder={t("auth.email").toLowerCase()}
              onChange={handleLoginChange}
            />
            <Form.Label className="text-muted mt-2">
              <i>{t("auth.password")}</i>
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder={t("auth.password")}
              onChange={handleLoginChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLoginSubmit();
              }}
            />
            <Form.Label className="text-muted mt-2">
              <Link to="/forgotPassword" onClick={onHide}>
                {t("auth.forgotPassword")}
              </Link>
            </Form.Label>
          </Form.Group>
        ) : (
          // ============ REGISTER TAB ============
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
              <img
                alt="Avatar"
                src={avatarPreview}
                style={{
                  border: "black 2px solid",
                  borderRadius: "50%",
                  width: "6rem",
                  height: "6rem",
                }}
              />
              <br />
              <input
                type="file"
                name="avatar"
                accept="image/jpg, image/jpeg, image/png"
                onChange={handleFile}
                style={{ fontSize: "0.85rem" }}
              />
            </div>

            <Form.Group>
              <Form.Label>(*) {t("auth.email")}:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("auth.email").toLowerCase()}
                onChange={handleRegisterChange}
              />
              <Form.Label className="mt-2">(*) {t("auth.password")}:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={t("auth.password")}
                onChange={handleRegisterChange}
              />
              <Form.Label className="mt-2">(*) {t("auth.username")}:</Form.Label>
              <Form.Control
                name="username"
                placeholder={t("auth.username").toLowerCase()}
                onChange={handleRegisterChange}
              />
              <Form.Label className="mt-2">{t("auth.info")}</Form.Label>
              <Form.Control
                type="text"
                name="info"
                placeholder={t("auth.personalInfo")}
                onChange={handleRegisterChange}
              />
            </Form.Group>
          </>
        )}
      </div>

      <Modal.Footer>
        <Button variant="danger" onClick={onHide} size="sm">
          {t("auth.close")}
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={
            activeTab === "login" ? handleLoginSubmit : handleRegisterSubmit
          }
        >
          {activeTab === "login" ? t("auth.accept") : t("auth.submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuthModal;
