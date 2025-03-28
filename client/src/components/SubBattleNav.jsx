/* eslint-disable react/jsx-pascal-case */
import {  useEffect, useState } from "react";
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
    segmentValue === undefined ? setSegmentValue("battle") : setSegmentValue(segmentValue)
  },
    // eslint-disable-next-line
    []);

  return (
    <Navbar
      collapseOnSelect
      className="bg-body-tertiary NavtrapBar"
      
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav className="me-auto my-2 my-lg-2" navbarScroll>
          <Nav.Link
            title="Bases del concurso.."
            style={{
              fontSize: "x-large",
              color: segmentValue === "battle" ? "red" : "black" }} href="/battle">
            Bases
          </Nav.Link>
       
          <Nav.Link 
            title="Batalla Actual"
            style={{
              fontSize: "x-large",
              color: segmentValue === "actualbattle" ? "red" : "black" }}    href="/actualbattle" >
            Actual
          </Nav.Link>
            <Nav.Link style={{ fontSize: "x-large" }}
            title="Batallas anteriores..."
            href="/battlehistory" disabled>
            Anteriores
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SubBatlleNav;
