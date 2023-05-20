import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';

import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';
import '../index.css';


function NavStrap() {

  const { user, login, logout } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  

  const [formDataLogin, setFormDataLogin] = useState<SubmitLoginData>({
    email: "",
    password: "",
  });

    const [formDataRegister, setFormDataRegister] = useState<SubmitUpdateData>({
     username: "",
      email: "",
      password: "",
      info: "",
      avatar: ""
       });
  
  const handleChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value })
    console.log('formData :>> ', formDataLogin);
  }
    const handleChangeRegister = (e: ChangeEvent<HTMLInputElement>) => {
    setFormDataRegister({ ...formDataRegister, [e.target.name]: e.target.value })
    console.log('formData :>> ', formDataRegister);
  }
  const handleSubmitLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    login(formDataLogin.email, formDataLogin.password);
  }
  const handleSubmitRegister = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
   
  }

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
                                    {/* <Nav.Link href="/events">Events</Nav.Link> */}
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
                              <Button variant="outline-danger" href="/" onClick={logout}>logout</Button> 
                    </Form>
                    </Navbar.Collapse>
                          </div>
                              :
                      <div style={{ display: "flex", gap: "1em" }}>{
                          <><Navbar.Brand href="/register">Register</Navbar.Brand>
                            <Navbar.Brand onClick={handleShow}>Login!</Navbar.Brand></>
            }
            <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>User Login</Modal.Title>
          </Modal.Header>
                <Modal.Body>
                  
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label ><i>Email address</i></Form.Label>
                    <Form.Control type='email' name='email' placeholder='email' onChange={handleChangeLogin}/><br />
                    <Form.Label className="text-muted"><i>Password</i></Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={handleChangeLogin}/>
                  </Form.Group>
                  
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                      Close
                    </Button>
                  <Button style={{ cursor: "point" }} onClick={handleSubmitLogin} variant="success">Login</Button>
                  </Modal.Footer>
                </Modal>
            
                 </div>
                  
                  
                  }
                  
                  
                  
                  </div>
                </div>
            
                          

   
      </Container>
    </Navbar>
  );
}

export default NavStrap;