import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userAvatar =
    !user?.avatar || user.avatar === PLACEHOLDER_AVATAR_URL
      ? DefaultImage
      : user.avatar;

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    closeSidebar();
    logout();
    navigate("/");
  };

  if (loading) return <SpraySpinner />;

  return (
    <>
      {/* =========================================================
          DESKTOP NAVBAR — horizontal, visible on screens >= 992px
         ========================================================= */}
      <nav className="navbar-desktop">
        <Link to="/news" className="navbar-desktop__brand">
          <img
            title={t("nav.newsTitle")}
            alt="Share Your Sketch"
            src={isHovered ? Logo2 : Logo1}
            style={{ height: "4em", width: "4em" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>

        <div className="navbar-desktop__links">
          <Link to="/homepage" className="navbar-desktop__link news">
            {t("nav.home")}
          </Link>
          <Link to="/battle" className="navbar-desktop__link battle">
            {t("nav.battle")}
          </Link>
        </div>

        <div className="navbar-desktop__right">
          <LanguageSwitcher />
          {user ? (
            <div className="navbar-desktop__user">
              <img
                src={userAvatar}
                alt="Avatar"
                className="NavAtar"
                style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  borderRadius: "50%",
                }}
              />
              <Link to="/mysketchs" className="navbar-desktop__link">
                {user.username}
              </Link>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="navbar-desktop__auth">
              <span
                className="registrarse navbar-desktop__link"
                style={{ cursor: "pointer" }}
                onClick={() => setShowRegister(true)}
              >
                {t("nav.register")}
              </span>
              <span
                className="entrar navbar-desktop__link"
                style={{ cursor: "pointer" }}
                onClick={() => setShowLogin(true)}
              >
                {t("nav.login")}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* =========================================================
          MOBILE NAVBAR — thin top bar with hamburger + logo + lang
         ========================================================= */}
      <nav className="navbar-mobile">
        <button
          className="navbar-mobile__hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <Link to="/news" className="navbar-mobile__brand">
          <img
            alt="Share Your Sketch"
            src={Logo1}
            style={{ height: "2.5em", width: "2.5em" }}
          />
        </Link>

        <div className="navbar-mobile__right">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* =========================================================
          MOBILE SIDEBAR — slides from the left
         ========================================================= */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar__header">
          <img
            alt="Share Your Sketch"
            src={Logo1}
            style={{ height: "3em", width: "3em" }}
          />
          <button
            className="sidebar__close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="sidebar__nav">
          <Link
            to="/homepage"
            className="sidebar__link news"
            onClick={closeSidebar}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/battle"
            className="sidebar__link battle"
            onClick={closeSidebar}
          >
            {t("nav.battle")}
          </Link>
          <Link
            to="/news"
            className="sidebar__link"
            onClick={closeSidebar}
          >
            {t("nav.news")}
          </Link>

          <div className="sidebar__divider" />

          {user ? (
            <>
              <Link
                to="/mysketchs"
                className="sidebar__link sidebar__link--user"
                onClick={closeSidebar}
              >
                <img
                  src={userAvatar}
                  alt="Avatar"
                  style={{
                    height: "2rem",
                    width: "2rem",
                    borderRadius: "50%",
                    marginRight: "0.75rem",
                  }}
                />
                {user.username}
              </Link>
              <button
                className="sidebar__link sidebar__link--logout"
                onClick={handleLogout}
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <button
                className="sidebar__link registrarse"
                onClick={() => {
                  setShowRegister(true);
                  closeSidebar();
                }}
              >
                {t("nav.register")}
              </button>
              <button
                className="sidebar__link entrar"
                onClick={() => {
                  setShowLogin(true);
                  closeSidebar();
                }}
              >
                {t("nav.login")}
              </button>
            </>
          )}
        </nav>
      </aside>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onLoadingChange={setLoading}
      />
    </>
  );
}

export default NavStrap;
