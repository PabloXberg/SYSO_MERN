import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../index.css";

/**
 * Generic sub-navigation bar.
 * Receives an array of links and renders them as SPA-safe Links.
 * The active link is auto-highlighted in red based on the current route.
 *
 * Usage:
 *   <SubNav links={[
 *     { to: "/sketches", label: "Bocetos", title: "..." },
 *     { to: "/users", label: "Usuarios", title: "..." },
 *   ]} />
 */
function SubNav({ links }) {
  const { pathname } = useLocation();

  return (
    <Navbar className="NavtrapBar">
      <Container>
        <Nav navbarScroll>
          {links.map(({ to, label, title, disabled }) => {
            const isActive = pathname === to;
            return (
              <Nav.Link
                key={to}
                as={Link}
                to={to}
                title={title}
                disabled={disabled}
                style={{
                  fontSize: "x-large",
                  color: isActive ? "red" : "black",
                }}
              >
                {label}
              </Nav.Link>
            );
          })}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubNav;
