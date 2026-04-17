import { useContext, useState } from "react";
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
import "../index.css";

const PLACEHOLDER_AVATAR_URL =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

function NavStrap() {
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
              title="Noticias del Share"
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
              title="Home Page"
              className="news"
              style={{ fontSize: "x-large" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/battle"
              title="Batallas"
              className="battle"
              style={{ fontSize: "x-large" }}
            >
              Battle
            </Nav.Link>
          </Nav>

          <div style={{ display: "flex", alignContent: "space-between" }}>
            {user ? (
              <Nav>
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="NavAtar"
                  style={{
                    marginLeft: "2em",
                    gap: "1rem",
                    maxHeight: "2.5rem",
                    maxWidth: "2.5rem",
                    borderRadius: "50%",
                  }}
                />
                <Nav.Link
                  as={Link}
                  to="/mysketchs"
                  title="Opciones de usuario"
                  style={{ fontSize: "x-large" }}
                >
                  {user.username}
                </Nav.Link>
                <Button
                  title="Cerrar Sesión"
                  variant="outline-danger"
                  onClick={handleLogout}
                >
                  Salir
                </Button>
              </Nav>
            ) : (
              <div style={{ display: "flex" }}>
                <Navbar.Brand
                  title="Registrar nuevo Usuario"
                  className="registrarse"
                  style={{ cursor: "pointer", fontSize: "large" }}
                  onClick={() => setShowRegister(true)}
                >
                  Registrar
                </Navbar.Brand>
                <Navbar.Brand
                  title="Iniciar Sesión"
                  className="entrar"
                  style={{ cursor: "pointer", fontSize: "large" }}
                  onClick={() => setShowLogin(true)}
                >
                  Entrar
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
