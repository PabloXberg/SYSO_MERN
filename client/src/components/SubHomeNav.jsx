/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "../index.css";

function SubHomeNav() {
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
   // segmentValue === undefined ? setSegmentValue("sketches"): setSegmentValue(segmentValue)
  },[]);

  return (
    <Navbar
      className="NavtrapBar"
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav navbarScroll>
          {/* <Nav.Link style={{ fontSize: "x-large",
              color: segmentValue === undefined ? "red" : "black"}} href="/">
            Home
          </Nav.Link> */}
          <Nav.Link
            title="Bocetos subidos"
            style={{
              fontSize: "x-large",
              color: segmentValue === "sketches" ? "red" : "black",
            }}
            href="/sketches"
          >
            Bocetos
          </Nav.Link>
          <Nav.Link
            title="Usuarios Registrados"
            style={{
              fontSize: "x-large",
              color: segmentValue === "users" ? "red" : "black",
            }}
            href="/users"
          >
            Usuarios
          </Nav.Link>
  
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubHomeNav;
