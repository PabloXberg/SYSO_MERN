/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
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
    console.log(segmentValue)
  }, []);
 
  return (
    <Navbar
      // collapseOnSelect
      // bg="dark"
      // variant="dark"
      // expand="lg"
      className="NavtrapBar"
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav navbarScroll>
           {/* <Nav.Link style={{ fontSize: "x-large",
              color: segmentValue === undefined ? "red" : "black"}} href="/">
            Home
          </Nav.Link> */}
           <Nav.Link style={{ fontSize: "x-large",
              color: segmentValue === "sketches" ? "red" : "black"}} href="/sketches">
            Bocetos
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large",
              color: segmentValue === "users" ? "red" : "black" }} href="/users">
            Usuarios
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} href="/suppoters" disabled>
            Supporters
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} href="/contacto" disabled>
            Contacto
          </Nav.Link>
         
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubHomeNav;
