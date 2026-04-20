import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import DefaultImage from "../avatar-placeholder.gif";
import Logo1 from "../images/IMG-20231228-WA0004-removebg-preview.png";
import Logo2 from "../images/IMG-20231228-WA0005-removebg-preview.png";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SpraySpinner from "./SprySpinner";
import LanguageSwitcher from "./LanguageSwitcher";
import "../index.css";

const PLACEHOLDER_AVATAR_URL =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

function NavStrap() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const userAvatar =
    !user?.avatar || user.avatar === PLACEHOLDER_AVATAR_URL
      ? DefaultImage
      : user.avatar;

  const handleLogout = () => {
    setExpanded(false);
    logout();
    navigate("/");
  };

  // Auto-close the mobile menu when a link is clicked
  const closeMenu = () => setExpanded(false);

  if (loading) return <SpraySpinner />;

  return (
    <div className="NavTrap">
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="bg-body-tertiary NavtrapBar"
        expanded={expanded}
        onToggle={(isExp) => setExpanded(isExp)}
      >
        <Container fluid>
          {/* Brand logo — always visible */}
          <Navbar.Brand
            as={Link}
            to="/news"
            onClick={closeMenu}
            style={{ cursor: "pointer" }}
          >
            <img
              title={t("nav.newsTitle")}
              alt="Share Your Sketch"
              src={isHovered ? Logo2 : Logo1}
              className="navTrapImg"
              style={{ height: "3.5em", width: "3.5em" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </Navbar.Brand>

          {/* Language switcher — always visible on mobile (outside collapse) */}
          <div className="d-lg-none" style={{ marginLeft: "auto", marginRight: "0.5rem" }}>
            <LanguageSwitcher />
          </div>

          {/* Hamburger toggle button */}
          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            {/* Left side: Home + Battle links */}
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/homepage"
                title={t("nav.home")}
                onClick={closeMenu}
                className="news"
                style={{ fontSize: "x-large" }}
              >
                {t("nav.home")}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/battle"
                title={t("nav.battle")}
                onClick={closeMenu}
                className="battle"
                style={{ fontSize: "x-large" }}
              >
                {t("nav.battle")}
              </Nav.Link>
            </Nav>

            {/* Right side: language + user actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {/* Language switcher — only visible here on desktop */}
              <div className="d-none d-lg-block">
                <LanguageSwitcher />
              </div>

              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="NavAtar"
                    style={{
                      maxHeight: "2.5rem",
                      maxWidth: "2.5rem",
                      borderRadius: "50%",
                    }}
                  />
                  <Nav.Link
                    as={Link}
                    to="/mysketchs"
                    title={t("nav.userMenu")}
                    onClick={closeMenu}
                    style={{ fontSize: "large" }}
                  >
                    {user.username}
                  </Nav.Link>
                  <Button
                    title={t("nav.logout")}
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    {t("nav.logout")}
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Navbar.Brand
                    title={t("nav.register")}
                    className="registrarse"
                    style={{ cursor: "pointer", fontSize: "large", margin: 0 }}
                    onClick={() => {
                      setShowRegister(true);
                      closeMenu();
                    }}
                  >
                    {t("nav.register")}
                  </Navbar.Brand>
                  <Navbar.Brand
                    title={t("nav.login")}
                    className="entrar"
                    style={{ cursor: "pointer", fontSize: "large", margin: 0 }}
                    onClick={() => {
                      setShowLogin(true);
                      closeMenu();
                    }}
                  >
                    {t("nav.login")}
                  </Navbar.Brand>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onLoadingChange={setLoading}
      />
    </div>
  );
}

export default NavStrap;
