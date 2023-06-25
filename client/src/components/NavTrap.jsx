import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../placeholder.png";
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../index.css";
import Typewriter from "typewriter-effect";

function NavStrap() {
  const { user, login, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

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

  function validarPassword(password) {
    // Verificar la longitud mínima de 10 caracteres
    if (password.length < 10) {
      return false;
    }

    // Verificar si hay al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Verificar si hay al menos un número
    if (!/\d/.test(password)) {
      return false;
    }

    // // Verificar si hay al menos un carácter especial
    //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   return false;
    // }

    // Si pasa todas las verificaciones, la contraseña es válida
    return true;
  }

  const handleChangeLogin = (e) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value });
    // console.log('formData :>> ', formDataLogin);
  };
  const handleChangeRegister = (e) => {
    setFormDataRegister({
      ...formDataRegister,
      [e.target.name]: e.target.value,
    });
    // console.log('formData :>> ', formDataRegister);
  };
  const handleSubmitLogin = (e) => {
    // e.preventDefault();
    login(formDataLogin.email, formDataLogin.password);
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validarPassword(password)) {
      console.log("Contraseña válida");
      setIsValid(true); //// aqui debo cambiar alguna state variable, para que muestreenable or disable el boton de registrar... y una cruz o tick arriba del input.

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
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}users/new`,
          requestOptions
        );
        const result = await response.json();
        console.log(result);
        ///  alert("Success! Check console.");
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Something went wrong - check console");
        setLoading(false);
      }
    } else {
      alert(
        "Una contraseña debe contener, al menos, 10 caracteres alfanuméricos aleatorios y una Mayúscula."
      ); /// podría agregar en cada IF, informacion mas específica... (El password debe tener Numeros... o caracteres especiales...)
      setIsValid(false);
    }
  };

  const handleFile = (e) => {
    // console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      let arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormDataRegister({ ...formDataRegister, avatar: e.target.files[0] });
    } else {
      setFormDataRegister({ ...formDataRegister, avatar: "" });
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="NavtrapBar">
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: "pointer", fontSize: "xx-large" }}
          href="/"
        >
          {
            <Typewriter
              options={{
                strings: ["Share Your Sketch . . ."],
                autoStart: true,
                loop: true,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Share Your Sketch Online")
                  .callFunction(() => {})
                  .pauseFor(1500)
                  .deleteAll()
                  .callFunction(() => {})
                  .start();
              }}
            />
          }{" "}
        </Navbar.Brand>

        <div style={{ display: "flex", gap: "1em" }}>
          <div>
            {user ? (
              <div>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                  <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: "100px" }}
                    navbarScroll
                  >
                    <Nav.Link href="/battles" disabled>
                      Battles
                    </Nav.Link>
                    <Nav.Link href="#action6" disabled>
                      {" "}
                      Shop{" "}
                    </Nav.Link>
                    <Nav.Link href="/sketches">Sketches</Nav.Link>
                    <Nav.Link href="/users">Usuarios</Nav.Link>---
                    {
                      <img
                        className="NavAtar"
                        style={{
                          gap: "1em",
                          height: "2em",
                          width: "2em",
                          borderRadius: "50%",
                        }}
                        alt="User Avatar"
                        src={user.avatar}
                      ></img>
                    }
                    <NavDropdown
                      title={user?.username}
                      id="navbarScrollingDropdown"
                    >
                      <NavDropdown.Item
                        style={{ fontSize: "xx-large" }}
                        href="/mysketchs"
                      >
                        Mis Bocetos
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        style={{ fontSize: "xx-large" }}
                        href="/myfav"
                      >
                        Mis Favoritos
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        style={{ fontSize: "xx-large" }}
                        href="/edit"
                      >
                        Editar Perfil
                      </NavDropdown.Item>
                    </NavDropdown>
                    {/* <Form className="d-flex">
                                                <Form.Control
                                                type="search"
                                                placeholder="Search"
                                                className="me-2"
                                                aria-label="Search"
                                                />

                                                   <Button variant="outline-success"></Button>
                                                
                                   </Form>  */}
                    <Button
                      style={{ fontSize: "xx-large" }}
                      variant="outline-danger"
                      href="/"
                      onClick={logout}
                    >
                      Salir
                    </Button>
                  </Nav>
                </Navbar.Collapse>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "1em" }}>
                {
                  <>
                    <Navbar.Brand
                      style={{ cursor: "pointer", fontSize: "xx-large" }}
                      onClick={handleShowRegister}
                    >
                      Register !
                    </Navbar.Brand>
                    <Navbar.Brand
                      style={{ cursor: "pointer", fontSize: "xx-large" }}
                      onClick={handleShowLogin}
                    >
                      Login !
                    </Navbar.Brand>
                  </>

                  // MODAL PARA LOGIN DE USUSARIO
                }
                <Modal
                  size="sm"
                  show={showLogin}
                  style={{ height: "23rem" }}
                  onHide={handleCloseLogin}
                  backdrop="static"
                  keyboard={false}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Iniciar sesión</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-1" controlId="formBasicPassword">
                      <Form.Label>
                        <i>Correo electrónico</i>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Correo"
                        onChange={handleChangeLogin}
                      />
                      <Form.Label className="text-muted">
                        <i>Contraseña</i>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        onChange={handleChangeLogin}
                        placeholder="Contraseña"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitLogin();
                          }
                        }}
                      />

                      <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseLogin}>
                          Cancelar
                        </Button>
                        <Button
                          style={{ cursor: "pointer" }}
                          onClick={handleSubmitLogin}
                          variant="success"
                        >
                          Iniciar sesión
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
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  style={{ height: "70rem" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Registrar un nuevo usuario</Modal.Title>
                  </Modal.Header>

                  <div>
                    <div className="avatar">
                      <img
                        alt="User Avatar"
                        style={{
                          border: "black 2px solid",
                          padding: "3px",
                          borderRadius: "50%",
                          width: "8rem",
                          height: "auto",
                          alignSelf: "center",
                          justifySelf: "center",
                        }}
                        src={avatarPreview ? avatarPreview : DefaultImage}
                      />
                      <br />

                      {/* eslint-disable-next-line react/jsx-pascal-case */}
                      <input
                        style={{ padding: "1rem" }}
                        type="file"
                        name="loading..."
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={handleFile}
                      />
                    </div>

                    <div className="dataform">
                      <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label>(*) Correo electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="correo"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>
                        <Form.Label>(*) Contraseña: </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="mínimo 10 caracteres, 1 número y 1 mayuscula"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>

                        <Form.Label>(*) Nombre de Usuario:</Form.Label>
                        <Form.Control
                          name="username"
                          placeholder="nombre de usuario"
                          onChange={handleChangeRegister}
                        />
                        <Form.Text className="text-muted"></Form.Text>

                        <Form.Label>Informacion sobre ti (opcional)</Form.Label>
                        <Form.Control
                          type="email"
                          name="info"
                          placeholder="personal Info"
                          onChange={handleChangeRegister}
                        />
                        {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                      </Form.Group>
                    </div>

                    <Modal.Footer
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
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
                        Registrarse
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
