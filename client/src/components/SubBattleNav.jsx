/* eslint-disable react/jsx-pascal-case */
import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../index.css";

function SubBatlleNav() {
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
  }, []);

  return (
    <Navbar
      collapseOnSelect
      // bg="dark"
      // variant="dark"
      // expand="lg"
      className="bg-body-tertiary NavtrapBar"
      
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav className="me-auto my-2 my-lg-2" navbarScroll>
          <Nav.Link style={{ fontSize: "x-large",
              color: segmentValue === "Battle" ? "red" : "black" }} href="/battle">
            Bases
          </Nav.Link>
       
          <Nav.Link style={{ fontSize: "x-large" }} href="/battlehistory" disabled>
            Battle History
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubBatlleNav;
