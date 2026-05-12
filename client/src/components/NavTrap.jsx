import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import DefaultImage from "../avatar-placeholder.gif";
import Logo1 from "../images/IMG-20231228-WA0004-removebg-preview.png";
import Logo2 from "../images/IMG-20231228-WA0005-removebg-preview.png";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import SpraySpinner from "./SprySpinner";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";
import "../index.css";

const PLACEHOLDER_AVATAR_URL =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

function NavStrap() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
      {/* DESKTOP NAVBAR */}
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
          {user && <NotificationBell />}
          {user ? (
            <div className="navbar-desktop__user">
              <img
                src={userAvatar}
                alt="Avatar"
                className="NavAtar"
                style={{ height: "2.5rem", width: "2.5rem", borderRadius: "50%" }}
              />
              <Link to="/mysketchs" className="navbar-desktop__link">
                {user.username}
              </Link>
              <button
                className="navbar-desktop__signout"
                onClick={handleLogout}
              >
                {t("nav.logout")}
              </button>
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

      {/* MOBILE NAVBAR */}
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

        <div className="navbar-mobile__right" style={{ gap: "0.4rem" }}>
          {user && <NotificationBell />}
          <LanguageSwitcher />
        </div>
      </nav>

      {/* SIDEBAR — reorganized:
            - Auth section (login button or user info) lives AT THE TOP for
              quick access. It's what people want first when they open the
              sidebar.
            - Then the main navigation links.
            - Disabled future-page placeholders below.
            - Sign-out pushed to the BOTTOM with margin-top: auto so it's
              well separated from the navigation links (avoids accidental
              clicks while reaching for "Inicio"). */}
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

        <nav
          className="sidebar__nav"
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {/* ─── TOP: Auth section (user info OR login button) ─── */}
          {user ? (
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
                  marginRight: "0.6rem",
                  flexShrink: 0,
                }}
              />
              <span className="sidebar__username">{user.username}</span>
            </Link>
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

          <div className="sidebar__divider" />

          {/* ─── MIDDLE: Main navigation ─── */}
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

          {/* ─── FUTURE pages — disabled placeholders ───
              When the info for these pages is ready, swap each <span> for
              a real <Link to="/sponsors|/contact|/shop">. */}
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.supporters")}
          </span>
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.contact")}
          </span>
          <span className="sidebar__link sidebar__link--disabled">
            {t("subNav.shop")}
          </span>

          {/* ─── BOTTOM: Sign out (logged-in only) ───
              `marginTop: auto` pushes this block to the bottom of the flex
              column, so the user has clear visual separation from the
              navigation links above. Less chance of mis-tapping logout. */}
          {user && (
            <div style={{ marginTop: "auto" }}>
              <div className="sidebar__divider" />
              <button
                className="sidebar__link sidebar__link--logout"
                onClick={handleLogout}
              >
                {t("nav.logout")}
              </button>
            </div>
          )}
        </nav>
      </aside>

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
