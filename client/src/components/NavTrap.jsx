import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../placeholder.png";
import  { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
//import { Link } from 'react-router-dom';
import "../index.css";
import Logo1 from "../images/IMG-20231228-WA0004-removebg-preview.png";
import Logo2 from "../images/IMG-20231228-WA0005-removebg-preview.png";
//import Typewriter from 'typewriter-effect';
import { serverURL } from "../serverURL";

function NavStrap() {
  const { user, login, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);

  //const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: "",
  });

  const [formDataRegister, setFormDataRegister] = useState({
    username: "",
    email: "",
    password: "",
    info: "",
    avatar: "",
  });

  const handleChangeLogin = (e) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value });

  };
  const handleChangeRegister = (e) => {
    setFormDataRegister({
      ...formDataRegister,
      [e.target.name]: e.target.value,
    });

  };
  const handleSubmitLogin = (e) => {
  //  e.preventDefault();
    if ((formDataLogin.password !== undefined || null || "") && (formDataLogin.email !== undefined || null || ""))
    { login(formDataLogin.email, formDataLogin.password); }
    else { 
      if ((formDataRegister.password !== undefined || null || "") && (formDataRegister.email!== undefined || null || "")) {
          login(formDataRegister.email, formDataRegister.password);
      }
      else{
        alert("Falta rellenar alguno de los campos");
      }
      
    }
      
  };

  const handleSubmitRegister = async (e) => {

     if (!formDataRegister.username || !formDataRegister.email || !formDataRegister.password) {
       alert("Falta rellnar alguno de los campos obligatorios (*)") 
       return
  }

   //e.preventDefault();
  // setLoading(true);
    const submitData = new FormData();
    submitData.append("email", formDataRegister.email);
    submitData.append("username", formDataRegister.username);
    submitData.append("password", formDataRegister.password);
    submitData.append("avatar", formDataRegister.avatar);
    const requestOptions = {
      method: "POST",
      body: submitData,
    };
    try {
      const response = await fetch(`${serverURL}users/new`, requestOptions);
      const result = await response.json();
      console.log(result);
     // alert("Usuario Registrado Correctamente");
      handleCloseRegister();
      login(formDataRegister.email, formDataRegister.password);

      //setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Algo salió mal, Usuario no registrado");
      handleCloseRegister();
      //setLoading(false);
    }
  };

  const handleFile = (e) => {
    console.log("e.target :>> ", e.target.files);
    if (e.target.files) {
      let arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormDataRegister({ ...formDataRegister, avatar: e.target.files[0] });
    } else {
      setFormDataRegister({ ...formDataRegister, avatar: "" });
    }
  };

  // function agregarEspaciosEntreLetras(nombreUsuario) {
  //   // Convierte el nombre de usuario en un array de letras
  //   if (nombreUsuario !== undefined) {
  //     const letras = nombreUsuario.split("");

  //     // Usa el método join para unir las letras con espacios entre ellas
  //     const nombreConEspacios = letras.join(" ");

  //     return nombreConEspacios;
  //   }
  // }
  // eslint-disable-next-line no-unused-vars
  //const nombreConEspacios = agregarEspaciosEntreLetras(user?.username);

  return (
    <Navbar
      collapseOnSelect
      bg="dark"
      variant="dark"
      expand="lg"
      className="bg-body-tertiary NavtrapBar"
    >
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
        <Navbar.Brand style={{ cursor: "pointer" }} href="/news">
          <img
            style={{ height: "5em", width: "5em" }}
            alt={"Share Your Sketch"}
            src={isHovered ? Logo2 : Logo1}
            className="navTrapImg"
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          />
        </Navbar.Brand>

        <Nav className="me-auto my-2 my-lg-2" navbarScroll>
   
          <Nav.Link className="news" style={{ fontSize: "x-large" }} href="/" >
            Home
          </Nav.Link>
          <Nav.Link
            style={{ fontSize: "x-large" }}
            className="battle"
            href="/Battle"
          >
            Battle
          </Nav.Link>

          
        </Nav>

        <div style={{ display: "flex", alignContent: "space-between" }}>
          <div>
            {user ? (
              <div>
                {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
                {/* <Navbar.Collapse id="responsive-navbar-nav"> */}
                {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
                <Nav
                // className="me-auto my-2 my-lg-2"
                >
                  {/* <Nav.Link href="/events">Events</Nav.Link> */}

                  {/* <Nav.Link href="#action6" disabled>
                      { */}
                  {/* <img
                          className="NavAtar"
                          style={{
                         
                            height: "2.5rem",
                            width: "2.5rem",
                            borderRadius: "50%",
                          }}
                          alt="User Avatar"
                          src={user.avatar}
                        /> */}
                  {/* }
                    </Nav.Link> */}

                  <img
                    style={{
                      marginLeft: "2em",
                      gap: "1rem",
                      maxHeight: "2.5rem",
                      maxWidth: "2.5rem",
                      borderRadius: "50%",
                    }}
                    src={user.avatar}
                    alt="Avatar"
                    className="NavAtar"
                  />

                  <Nav.Link style={{ fontSize: "x-large" }} href="/mysketchs">
                    {user.username}
                  </Nav.Link>
         
            
                  <Button variant="outline-danger" href="/" onClick={logout}>
                    Salir
                  </Button>
                  {/* </Navbar.Collapse> */}
                </Nav>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                {
                  <>
                    <Navbar.Brand
                      style={{ cursor: "pointer", fontSize: "large" }}
                      className={"registrarse"}
                      onClick={handleShowRegister}
                    >
                      Registrar
                    </Navbar.Brand>
                    <Navbar.Brand
                      style={{ cursor: "pointer", fontSize: "large" }}
                      className={"entrar"}
                      onClick={handleShowLogin}
                    >
                      Entrar
                    </Navbar.Brand>
                  </>

                  // MODAL PARA LOGIN DE USUSARIO
                }
                <Modal
                  size="sm"
                  show={showLogin}
                  style={{
                    maxHeight: "24rem",
                    padding: "3rem",
                  }}
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
                      <Form.Label>
                        <i>Correo Electrónico</i>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={handleChangeLogin}
                      />
                      <Form.Label className="text-muted">
                        <i>Contraseña</i>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                          onChange={handleChangeLogin}
                          onKeyDown={(e) => {
                          
                         if (e.key === "Enter") {
                        handleSubmitLogin(); }}}
                      />

                      <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseLogin}>
                          Cerrar
                        </Button>
                        <Button
                          style={{ cursor: "pointer" }}
                          onClick={handleSubmitLogin}
                          variant="success"
                        >
                          Aceptar
                        </Button>
                      </Modal.Footer>
                    </Form.Group>
                  </Modal.Body>
                </Modal>

                {/* MODAL PARA REGISTRO DE USUSARIO */}

                <Modal
                    className="userRegisterModal"
                    
                  show={showRegister}
                  onHide={handleCloseRegister}
                  backdrop="static"
                  keyboard={false}
                  // aria-labelledby="contained-modal-title-vcenter"
                  centered
                  // style={{height:"70rem"}}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Registrar Usuario</Modal.Title>
                  </Modal.Header>

                    <div>
                      <div
                        // className="avatar"
                      style={{
                            display: "flex",
                            flexDirection: "column",
                          alignItems:"center"
                        }}
                      >
                        <img
                          // className="avatarRegister"
                          alt="Imagen de perfil"
                        style={{
                          border: "black 2px solid",
               
                          borderRadius: "50%",
                          width: "8rem",
                          height: "8rem",
                          alignSelf: "center",
                     
                        }}
                        src={avatarPreview ? avatarPreview : DefaultImage}
                      />
                      <br />

                  
                        <input
                          // style={{gap:"1rem"}}
                        type="file"
                        name="loading..."
                        accept="image/jpg, image/jpeg, image/png"
                          onChange={handleFile}
                          
                      />
                    </div>

                    <div className="dataform">
                        <Form.Group className="mb-4" controlId="formBasicEmail"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          alignItems:"center"
                        }}>
                        <Form.Label>(*) Correo Electrónico:</Form.Label>
                          <Form.Control
                            style={{maxWidth:"20rem"}}
                          type="email"
                          name="email"
                          placeholder="email"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>
                        <Form.Label>(*) Contraseña:</Form.Label>
                          <Form.Control
                             style={{maxWidth:"20rem"}}
                          type="password"
                          name="password"
                          placeholder="Password"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>

                        <Form.Label>(*) Nombre de Usuario:</Form.Label>
                          <Form.Control
                             style={{maxWidth:"20rem"}}
                          name="username"
                          placeholder="username"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>

                        <Form.Label>
                          Información sobre ti (opcional......)
                        </Form.Label>
                          <Form.Control
                             style={{maxWidth:"20rem"}}
                          type="email"
                          name="info"
                          placeholder="Personal Info"
                            onChange={handleChangeRegister}
                        //    onKeyDown={(e) => {
                        //  if (e.key === "Enter") {
                        //  handleSubmitRegister(); }}}
                        />
                          {/* <Form.Text className="text-muted">
                           
                     (*) campos obligatorios
                    </Form.Text> */}
                      </Form.Group>
                    </div>
                    <Modal.Footer
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "space-around",
                      }}
                    >
                      <Button variant="danger" onClick={handleCloseRegister}>
                        Cancelar
                      </Button>
                      <Button
                        style={{ cursor: "pointer" }}
                        onClick={handleSubmitRegister}
                        variant="success"
                      >
                        Registrar
                      </Button>
                    </Modal.Footer>
                  </div>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavStrap;
