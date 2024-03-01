/* eslint-disable react/jsx-pascal-case */
import Container from "react-bootstrap/Container";
import { AuthContext } from "../contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../index.css";

function SubUserNav() {
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

  const { logout } = useContext(AuthContext);

  return (

    <div >
      <Navbar className="NavtrapBar">
      <Container>
        <Nav navbarScroll>
          <Nav.Link
            style={{
              fontSize: "x-large",
              color: segmentValue === "mysketchs" ? "red" : "black",
            }}
            href="/mysketchs"
          >
            Mis Bocetos
          </Nav.Link>
          <Nav.Link
            style={{
              fontSize: "x-large",
              color: segmentValue === "myfav" ? "red" : "black",
            }}
            href="/myfav"
          >
            Favoritos
          </Nav.Link>
          <Nav.Link
            style={{
              fontSize: "x-large"
              // ,color: segmentValue === "edit" ? "red" : "black",
            }}
            href="/edit" disabled>
            Editar
          </Nav.Link>
          {/* <Nav.Link
            style={{ fontSize: "x-large", color: "black" }}
            href="/"
            onClick={logout}
          >
            Salir
          </Nav.Link> */}
          
        </Nav>
      </Container>
    </Navbar></div>
   
  );
}

export default SubUserNav;
