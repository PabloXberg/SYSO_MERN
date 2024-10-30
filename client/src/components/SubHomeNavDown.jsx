import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "../index.css";

function SubHomeNavDown() {
  const getLastSegment = () => {
    const url = new URL(window.location.href);
    const lastSegment = url.pathname
      .split("/")
      .filter((segment) => segment !== "")
      .pop();
    return lastSegment;
  };

  const [segmentValue, setSegmentValue] = useState(getLastSegment());

  useEffect(() => {
    setSegmentValue(getLastSegment());
    console.log(segmentValue);
  },
    // eslint-disable-next-line
    []);

  return (
    <Navbar
      className="NavtrapBar"
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav navbarScroll>
  
          <Nav.Link style={{ fontSize: "x-large" }} title="Colaboradores" href="/suppoters" disabled>
            Supporters
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} title="Vías de comunicación" href="/contacto" disabled>
            Contacto
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} title="tienda Online" href="/shop" disabled>
            Shop
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubHomeNavDown;
