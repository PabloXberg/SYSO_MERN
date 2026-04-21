import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DefaultImage from "../avatar-placeholder.gif";
import Logo1 from "../images/IMG-20231228-WA0004-removebg-preview.png";
import Logo2 from "../images/IMG-20231228-WA0005-removebg-preview.png";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import SpraySpinner from "./SprySpinner";
import LanguageSwitcher from "./LanguageSwitcher";
import "../index.css";

const PLACEHOLDER_AVATAR_URL =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

function NavStrap() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Single auth modal — opens with 'login' or 'register' tab pre-selected
  const [authModal, setAuthModal] = useState({ show: false, tab: "login" });
  const openAuth = (tab) => setAuthModal({ show: true, tab });
  const closeAuth = () => setAuthModal({ show: false, tab: "login" });

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
            style={{ height: "5em", width: "5em" }}
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
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="navbar-desktop__auth">
              <button
                className="navbar-desktop__auth-btn"
                onClick={() => openAuth("login")}
              >
                {t("nav.login")} / {t("nav.register")}
              </button>
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
            style={{ height: "3em", width: "3em" }}
          />
        </Link>

        <div className="navbar-mobile__right">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* =========================================================
          SIDEBAR — slides from the left (mobile only)
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
          {/* Main sections */}

{/* User / auth section */}
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
            <button
              className="sidebar__link entrar"
              onClick={() => {
                openAuth("login");
                closeSidebar();
              }}
            >
              {t("nav.login")} / {t("nav.register")}
            </button>
          )}

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
          <Link to="/news" className="sidebar__link" onClick={closeSidebar}>
            {t("nav.news")}
          </Link>

          <div className="sidebar__divider" />

          {/* Secondary sections (formerly in SubHomeNavDown) */}
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.supporters")}
          </span>
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.contact")}
          </span>
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.shop")}
          </span>

          <div className="sidebar__divider" />

          
        </nav>
      </aside>

      {/* Single combined auth modal */}
      <AuthModal
        show={authModal.show}
        onHide={closeAuth}
        initialTab={authModal.tab}
        onLoadingChange={setLoading}
      />
    </>
  );
}

export default NavStrap;
