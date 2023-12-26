import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import DefaultImage from '../placeholder.png'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
//import { Link } from 'react-router-dom';
import '../index.css';
import logo from '../LogoShare.png'
//import Typewriter from 'typewriter-effect';

function NavStrap() {

  const { user, login, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  

  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);
  const[avatarPreview, setAvatarPreview] = useState(DefaultImage) 
  const [loading, setLoading] = useState(false);
  

  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: "",
  });

    const [formDataRegister, setFormDataRegister] = useState({
     username: "",
      email: "",
      password: "",
      info: "",
      avatar: ""
       });
  
  const handleChangeLogin = (e) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value })
    // console.log('formData :>> ', formDataLogin);
  }
    const handleChangeRegister = (e) => {
    setFormDataRegister({ ...formDataRegister, [e.target.name]: e.target.value })
    // console.log('formData :>> ', formDataRegister);
  }
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    login(formDataLogin.email, formDataLogin.password);
  }


  const handleSubmitRegister = async(e) => {
    e.preventDefault();
        setLoading(true);
    const submitData = new FormData();
        submitData.append("email", formDataRegister.email);
        submitData.append("username", formDataRegister.username);
        submitData.append("password", formDataRegister.password);
        submitData.append("avatar", formDataRegister.avatar);
    const requestOptions = {
      method: 'POST',
      body: submitData,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/new`, requestOptions);
      const result = await response.json();
      console.log(result);
      alert("Success! Check console.");
      setLoading(false);
    } catch (error) {
      console.log(error)
      alert("Something went wrong - check console")
      setLoading(false);
    }
   
  }

  
  const handleFile = (e) => {
    console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      let arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL)
      setFormDataRegister({ ...formDataRegister, avatar: e.target.files[0] })
    } else {
      setFormDataRegister({ ...formDataRegister, avatar: "" })
    }
  }

  
  function agregarEspaciosEntreLetras(nombreUsuario) {
  // Convierte el nombre de usuario en un array de letras
    if (nombreUsuario !== undefined)
    {
      const letras = nombreUsuario.split('');

  // Usa el método join para unir las letras con espacios entre ellas
  const nombreConEspacios = letras.join(' ');

      return nombreConEspacios;
    }

  }
  const nombreConEspacios = agregarEspaciosEntreLetras(user?.username);


  return (
    <Navbar bg="dark" variant="dark" expand="lg" className='NavtrapBar'>
      <Container fluid>
       
         <Navbar.Brand style={{ cursor: "pointer" }} href="/">
          <img style={{ height: "4em", width: "4em" }} alt={"Share Your Sketch"} src={logo}></img> 
               
         </Navbar.Brand>
         <Nav className="me-auto my-2 my-lg-2"  navbarScroll>
        <Nav.Link style={{ fontSize: "xx-large"}} href="/Battle">B a t t l e</Nav.Link>

        </Nav>
                               
        <div style={{ display: "flex" }}>
          
                          
          
          <div>{user ? <div>

            
            
                             <Navbar.Toggle aria-controls="navbarScroll" />
                             <Navbar.Collapse id="navbarScroll">
                  
              <Nav className="me-auto my-2 my-lg-2" style={{ maxHeight: '90px' }} navbarScroll>
                 
                                        {/* <Nav.Link href="/events">Events</Nav.Link> */}
                                    <Nav.Link style={{ fontSize: "xx-large"}} href="/sketches">B o c e t o s   - </Nav.Link>
                <Nav.Link style={{ fontSize: "xx-large"}} href="/users">U s u a r i o s</Nav.Link>
                   <Nav.Link href="#action6" disabled>
                                  {<img className='NavAtar' style={{gap:"1em", height:"2em", width:"2em", borderRadius:"50%"} } alt="User Avatar" src={user.avatar}></img>}
                              </Nav.Link>
                                      <NavDropdown style={{ fontSize: "xx-large"}} title= {nombreConEspacios}id="navbarScrollingDropdown">
                                        <NavDropdown.Item style={{ fontSize: "x-large"}}  href="/mysketchs">Mis Bocetos</NavDropdown.Item>
                                        <NavDropdown.Item  style={{ fontSize: "x-large"}} href="/myfav">
                                            Favoritos
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item style={{ fontSize: "x-large"}} href="/edit">
                                            Editar Usuario
                                        </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link style={{ fontSize: "xx-large", borderRight:'10px', gap: '2rem'}} href="#action6" disabled>
                                    S h o p 
                              </Nav.Link>
                                 </Nav>
                        <Form className="d-flex" style={{borderTop: '1px'}}>
                            {/* <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            /> */}
                              {/* <Button variant="outline-success"></Button> */}
                                  <Button
                                      style={{ fontSize: "xx-large" }}
                                      variant="outline-danger"
                                      href="/"
                                      onClick={logout}
                                    >
                                      Salir
                                  </Button> 
                    </Form>
                    </Navbar.Collapse>
                          </div>
                              :
                      <div style={{ display: "flex", gap: "1em" }}>{
                           <><Navbar.Brand style={{ cursor: "pointer", fontSize: "xx-large" }} className={ "registrarse"} onClick={handleShowRegister}>R e g i s t r a r</Navbar.Brand>
                            <Navbar.Brand style={{cursor: "pointer", fontSize: "xx-large"}}  className={ "entrar"} onClick={handleShowLogin}>E n t r a r</Navbar.Brand></>

              // MODAL PARA LOGIN DE USUSARIO
            }
              <Modal
               size="sm"
                show={showLogin}
                style={{
                  maxHeight: "24rem", padding:"3rem"}}
                onHide={handleCloseLogin}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Iniciar Sesión</Modal.Title>
          </Modal.Header>
                <Modal.Body>
                  
                <Form.Group className="mb-1" controlId="formBasicPassword">
                    <Form.Label ><i>Correo Electrónico</i></Form.Label>
                    <Form.Control type='email' name='email' placeholder='email' onChange={handleChangeLogin}/>
                    <Form.Label className="text-muted"><i>Contraseña</i></Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={handleChangeLogin}/>
                    
                  
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseLogin}>
                      Cerrar
                    </Button>
                  <Button style={{ cursor: "pointer" }} onClick={handleSubmitLogin} variant="success">Aceptar</Button>
                  </Modal.Footer>
                    </Form.Group>
                   </Modal.Body>
            </Modal>
              
              {/* MODAL PARA REGISTRO DE USUSARIO */}

                       
              <Modal
    
                    className='userRegisterModal'
                    show={showRegister}
                    onHide={handleCloseRegister}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                   // style={{height:"70rem"}}
                  >
                  <Modal.Header closeButton>
                    <Modal.Title>Registrar Usuario</Modal.Title>
                  </Modal.Header>
               
                <div >

                  
                  <div className='avatar'>
                   

                      <img alt='Imagen de perfil' style={{border: "black 2px solid",padding:"3px" ,borderRadius: "50%", width: "8rem", height: "auto", alignSelf:"center"}} src={avatarPreview ? avatarPreview : DefaultImage} />
                       <br />

                       {/* eslint-disable-next-line react/jsx-pascal-case */}
                        <input style={{padding: "1rem"}} type='file' name='loading...' accept= 'image/jpg, image/jpeg, image/png' onChange={handleFile} />

                   
                  </div>
                  

              <div className="dataform">
                    
           
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                          <Form.Label >(*) Correo Electrónico:</Form.Label>
                          <Form.Control type='email' name='email' placeholder='email' onChange={handleChangeRegister}/>
                          <Form.Text className="text-muted">
                            
                            </Form.Text>
                          <Form.Label >(*) Contraseña:</Form.Label>
                          <Form.Control type="password" name='password' placeholder="Password" onChange={handleChangeRegister} />
                        <Form.Text className="text-muted"></Form.Text>
                                            
                    <Form.Label >(*) Nombre de Usuario:</Form.Label>
                  <Form.Control   name='username' placeholder="username" onChange={handleChangeRegister}/>
                    <Form.Text className="text-muted">
                     
                    </Form.Text>
                  
                     <Form.Label >Información sobre ti (opcional...)</Form.Label>
                    <Form.Control type='email' name='info' placeholder='Personal Info' onChange={handleChangeRegister}/>
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                  </Form.Group></div>      
                  <Modal.Footer style={{
                    display: "flex", flexDirection: "row", alignContent:"space-around"
                  }}> 
                    <Button variant="danger" onClick={handleCloseRegister}>
                      Cancelar
                    </Button>
                  <Button style={{ cursor: "pointer" }} onClick={handleSubmitRegister} variant="success">Registrar</Button>
                  </Modal.Footer>

                  
                  
          </div>
               
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