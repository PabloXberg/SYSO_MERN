import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';
import '../index.css';


function NavStrap() {

const { user, login, logout } = useContext(AuthContext);


  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Share Your Sketch Online</Navbar.Brand>
  
                      
        

                <div style={{ display: "flex", gap: "1em" }}>
                          
                  <div>{user ? <div>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                             <Navbar.Collapse id="navbarScroll">
                  
                          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                                 <Nav.Link href="#action6" disabled>
                                  {<img className='NavAtar' style={{gap:"1em", height:"2em", width:"2em", borderRadius:"50%"} } alt="User Avatar" src={user.avatar}></img>}{user.username}
                              </Nav.Link>
                                    <Nav.Link href="/events">Events</Nav.Link>
                                    <Nav.Link href="/sketches">Sketches</Nav.Link>
                                    <Nav.Link href="/users">Users</Nav.Link>
                                      <NavDropdown title="Profile" id="navbarScrollingDropdown">
                                        <NavDropdown.Item  href="/mysketchs">My Sketchs</NavDropdown.Item>
                                        <NavDropdown.Item  href="/myfav">
                                            My Favourites
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/edit">
                                            Edit Profile
                                        </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="#action6" disabled>
                                    Shop
                              </Nav.Link>
                                 </Nav>
                        <Form className="d-flex">
                            <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            />
                              {/* <Button variant="outline-success"></Button> */}
                              <Button variant="outline-danger" onClick={logout}>logout</Button> 
                    </Form>
                    </Navbar.Collapse>
                          </div>
                              :
                      <div style={{ display: "flex", gap: "1em" }}>{
                          <><Navbar.Brand href="/register">Register</Navbar.Brand>
                            <Navbar.Brand href="/login">Login!</Navbar.Brand></>
                        }</div>
                  
                  
                  }
                  
                  
                  
                  </div>
                </div>
            
                          

   
      </Container>
    </Navbar>
  );
}

export default NavStrap;