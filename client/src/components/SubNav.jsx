import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../index.css";

/**
 * Generic sub-navigation bar.
 * Receives an array of links and renders them as SPA-safe Links.
 *
 * COLOR SCHEME (matches the new dark page backgrounds):
 *   active   → bright red, glows a bit
 *   inactive → off-white with a subtle dark text-shadow (graffiti look)
 *   disabled → mid gray (visible but clearly "not for clicking")
 */
function SubNav({ links }) {
  const { pathname } = useLocation();

  return (
    <Navbar className="NavtrapBar">
      <Container>
        <Nav navbarScroll>
          {links.map(({ to, label, title, disabled }) => {
            const isActive = pathname === to;

            // Calculate color and shadow per-state to keep the JSX readable
            let color = "#f0f0f0";
            let shadow = "1px 1px 0 rgba(0,0,0,0.7)";
            if (disabled) {
              color = "#666";
              shadow = "none";
            } else if (isActive) {
              color = "#ff3b3b";
              shadow = "1px 1px 0 rgba(0,0,0,0.7), 0 0 8px rgba(255,59,59,0.35)";
            }

            return (
              <Nav.Link
                key={to}
                as={Link}
                to={to}
                title={title}
                disabled={disabled}
                style={{
                  fontSize: "x-large",
                  color,
                  textShadow: shadow,
                  // Keep link clickable area honest even with the shadow
                  textDecoration: "none",
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
