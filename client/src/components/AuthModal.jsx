import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import DefaultImage from "../avatar-placeholder.gif";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";
import PasswordInput from "./PasswordInput";

/**
 * Combined login + register modal with tabs.
 *
 * Style: matches the underground/graffiti theme used in the sidebar
 * and notifications dropdown.
 *
 * Password inputs use PasswordInput (with eye toggle):
 *   - login → autoComplete="current-password"
 *   - register → autoComplete="new-password"
 */
function AuthModal({ show, onHide, initialTab = "login", onLoadingChange }) {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (show) setActiveTab(initialTab);
  }, [show, initialTab]);

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

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    info: "",
    avatar: null,
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
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      alert(t("auth.missingFields"));
      return;
    }

    const submitData = new FormData();
    submitData.append("email", registerData.email);
    submitData.append("username", registerData.username);
    submitData.append("password", registerData.password);
    submitData.append("info", registerData.info);
    if (registerData.avatar instanceof File) {
      submitData.append("avatar", registerData.avatar);
    }

    onLoadingChange?.(true);
    try {
      const response = await fetch(`${serverURL}users/new`, {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        alert(errorBody.error || t("auth.registrationError"));
        return;
      }

      const { email, password } = registerData;
      onHide();
      login(email, password);
    } catch (error) {
      console.error("Register failed:", error);
      alert(t("auth.registrationError"));
    } finally {
      onLoadingChange?.(false);
    }
  };

  // ─── Inline styles for the graffiti coherence ────────────────────
  const graffitiTitleStyle = {
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: "1.6rem",
    color: "#ffcc00",
    letterSpacing: "0.04em",
    textShadow: "2px 2px 0 #000",
    transform: "rotate(-1deg)",
    display: "inline-block",
    margin: 0,
  };

  const tabStyle = (active) => ({
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: "1.1rem",
    letterSpacing: "0.04em",
    color: active ? "#ffcc00" : "#888",
    border: "none",
    borderBottom: active ? "3px solid #ffcc00" : "3px solid transparent",
    background: "transparent",
  });

  const buttonStyle = (variant) => ({
    fontFamily: "MiFuente2, MiFuente, cursive",
    fontSize: "1rem",
    letterSpacing: "0.04em",
    border: `2px solid ${variant === "success" ? "#00ff88" : "#ff3030"}`,
    color: variant === "success" ? "#00ff88" : "#ff3030",
    background: "transparent",
    padding: "0.35rem 0.9rem",
    textTransform: "uppercase",
    boxShadow: "2px 2px 0 rgba(0,0,0,0.7)",
    transform: "rotate(-0.5deg)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  // Common dark input style (for non-password fields)
  const darkInputStyle = {
    backgroundColor: "#0d0d0d",
    color: "#f0f0f0",
    border: "1px solid #333",
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
      {/* Header with graffiti title */}
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#0d0d0d",
          borderBottom: "2px solid #ffcc00",
        }}
        closeVariant="white"
      >
        <Modal.Title>
          <span style={graffitiTitleStyle}>
            {activeTab === "login" ? t("auth.login") : t("auth.register")}
          </span>
        </Modal.Title>
      </Modal.Header>

      {/* Custom tabs styled coherently */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "login")}
        style={{
          backgroundColor: "#1a1a1a",
          borderBottom: "2px solid #333",
          padding: "0 1rem",
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="login" style={tabStyle(activeTab === "login")}>
            {t("auth.login")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="register"
            style={tabStyle(activeTab === "register")}
          >
            {t("auth.register")}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#1a1a1a",
          color: "#f0f0f0",
        }}
      >
        {activeTab === "login" ? (
          <Form.Group>
            <Form.Label style={{ color: "#ffcc00" }}>
              <i>{t("auth.email")}</i>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder={t("auth.email").toLowerCase()}
              onChange={handleLoginChange}
              autoComplete="email"
              style={darkInputStyle}
            />
            <Form.Label className="mt-2" style={{ color: "#ffcc00" }}>
              <i>{t("auth.password")}</i>
            </Form.Label>
            <PasswordInput
              name="password"
              placeholder={t("auth.password")}
              onChange={handleLoginChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLoginSubmit();
              }}
              autoComplete="current-password"
              style={darkInputStyle}
            />
            <Form.Label className="mt-2">
              <Link
                to="/forgotPassword"
                onClick={onHide}
                style={{ color: "#00e5ff" }}
              >
                {t("auth.forgotPassword")}
              </Link>
            </Form.Label>
          </Form.Group>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <img
                alt="Avatar"
                src={avatarPreview}
                style={{
                  border: "2px solid #ffcc00",
                  borderRadius: "50%",
                  width: "6rem",
                  height: "6rem",
                  objectFit: "cover",
                }}
              />
              <br />
              <input
                type="file"
                name="avatar"
                accept="image/jpg, image/jpeg, image/png"
                onChange={handleFile}
                style={{ fontSize: "0.85rem", color: "#f0f0f0" }}
              />
            </div>

            <Form.Group>
              <Form.Label style={{ color: "#ffcc00" }}>
                (*) {t("auth.email")}:
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("auth.email").toLowerCase()}
                onChange={handleRegisterChange}
                autoComplete="email"
                style={darkInputStyle}
              />
              <Form.Label className="mt-2" style={{ color: "#ffcc00" }}>
                (*) {t("auth.password")}:
              </Form.Label>
              <PasswordInput
                name="password"
                placeholder={t("auth.password")}
                onChange={handleRegisterChange}
                autoComplete="new-password"
                style={darkInputStyle}
              />
              <Form.Label className="mt-2" style={{ color: "#ffcc00" }}>
                (*) {t("auth.username")}:
              </Form.Label>
              <Form.Control
                name="username"
                placeholder={t("auth.username").toLowerCase()}
                onChange={handleRegisterChange}
                autoComplete="username"
                style={darkInputStyle}
              />
              <Form.Label className="mt-2" style={{ color: "#ffcc00" }}>
                {t("auth.info")}
              </Form.Label>
              <Form.Control
                type="text"
                name="info"
                placeholder={t("auth.personalInfo")}
                onChange={handleRegisterChange}
                style={darkInputStyle}
              />
            </Form.Group>
          </>
        )}
      </div>

      <Modal.Footer
        style={{
          backgroundColor: "#0d0d0d",
          borderTop: "2px solid #333",
        }}
      >
        <button onClick={onHide} style={buttonStyle("danger")}>
          {t("auth.close")}
        </button>
        <button
          onClick={
            activeTab === "login" ? handleLoginSubmit : handleRegisterSubmit
          }
          style={buttonStyle("success")}
        >
          {activeTab === "login" ? t("auth.accept") : t("auth.submit")}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuthModal;
