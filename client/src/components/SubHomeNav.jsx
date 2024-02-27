/* eslint-disable react/jsx-pascal-case */
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import "../index.css";

function SubHomeNav() {
 
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

        <Nav className="me-auto my-2 my-lg-2" navbarScroll>
          <Nav.Link style={{ fontSize: "x-large" }} href="/suppoters">
            Supporters
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} href="/contacto">
            Contacto
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} href="/sketches">
            Bocetos
          </Nav.Link>
          <Nav.Link style={{ fontSize: "x-large" }} href="/users">
            Usuarios
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubHomeNav;
