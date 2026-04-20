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

  const userAvatar =
    !user?.avatar || user.avatar === PLACEHOLDER_AVATAR_URL
      ? DefaultImage
      : user.avatar;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <SpraySpinner />;

  return (
    <div className="NavTrap">
      <Navbar
        collapseOnSelect
        bg="dark"
        variant="dark"
        expand="lg"
        className="bg-body-tertiary NavtrapBar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/news" style={{ cursor: "pointer" }}>
            <img
              title={t("nav.newsTitle")}
              alt="Share Your Sketch"
              src={isHovered ? Logo2 : Logo1}
              className="navTrapImg"
              style={{ height: "5em", width: "5em" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </Navbar.Brand>

          <Nav className="me-auto my-2 my-lg-2" navbarScroll>
            <Nav.Link
              as={Link}
              to="/homepage"
              title={t("nav.home")}
              className="news"
              style={{ fontSize: "x-large" }}
            >
              {t("nav.home")}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/battle"
              title={t("nav.battle")}
              className="battle"
              style={{ fontSize: "x-large" }}
            >
              {t("nav.battle")}
            </Nav.Link>
          </Nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LanguageSwitcher />

            {user ? (
              <Nav>
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="NavAtar"
                  style={{
                    marginLeft: "1em",
                    maxHeight: "2.5rem",
                    maxWidth: "2.5rem",
                    borderRadius: "50%",
                  }}
                />
                <Nav.Link
                  as={Link}
                  to="/mysketchs"
                  title={t("nav.userMenu")}
                  style={{ fontSize: "x-large" }}
                >
                  {user.username}
                </Nav.Link>
                <Button
                  title={t("nav.logout")}
                  variant="outline-danger"
                  onClick={handleLogout}
                >
                  {t("nav.logout")}
                </Button>
              </Nav>
            ) : (
              <div style={{ display: "flex" }}>
                <Navbar.Brand
                  title={t("nav.register")}
                  className="registrarse"
                  style={{ cursor: "pointer", fontSize: "large" }}
                  onClick={() => setShowRegister(true)}
                >
                  {t("nav.register")}
                </Navbar.Brand>
                <Navbar.Brand
                  title={t("nav.login")}
                  className="entrar"
                  style={{ cursor: "pointer", fontSize: "large" }}
                  onClick={() => setShowLogin(true)}
                >
                  {t("nav.login")}
                </Navbar.Brand>
              </div>
            )}
          </div>
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
