import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../contexts/AuthContext";
import { Image } from "react-bootstrap";
import "../index.css";
import Modal from "react-bootstrap/Modal";
// import { serverURL } from '../serverURL' 

type Props = {};

const EditProfile = (props: Props) => {
  const { user } = useContext(AuthContext);

  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);

  const [formData, setFormData] = useState<SubmitUpdateData>({
    email: "",
    password: "",
    username: "",
    info: "",
    avatar: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target :>> ", e.target.files);
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, avatar: "" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); ///// FUTURE SPINNER
    const user_ID = user?._id;

    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const submitData = new FormData();
    submitData.append("email", formData.email);
    submitData.append("username", formData.username);
    submitData.append("password", formData.password);
    submitData.append("info", formData.info);
    submitData.append("avatar", formData.avatar);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: submitData,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}users/update/${user_ID}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      alert("Success!!! User Updated");
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong - Try again...");
      setLoading(false);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="updateuser">
        <div className="avatar">
          <Form>
            <Image
              alt="User Avatar"
              style={{
                border: "black 2px solid",
                padding: "5px",
                borderRadius: "50%",
                width: "20rem",
                height: "auto",
              }}
              src={avatarPreview ? avatarPreview : user?.avatar}
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
          </Form>
        </div>

        <div className="dataform">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo electrónico:</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                placeholder={user?.email}
                defaultValue={user?.email}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                <i>Obligatorio</i>
                <br />
                <br />
              </Form.Text>

              <Form.Label>Nombre de Usuario:</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder={user?.username}
                defaultValue={user?.username}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                <i>Obligatorio</i>
                <br />
                <br />
              </Form.Text>

              <Form.Label>Informacion Personal:</Form.Label>
              <Form.Control
                type="text"
                name="info"
                placeholder={user?.info}
                defaultValue={user?.info}
                onChange={handleChange}
              />
              {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group> */}
            <div className="botones">
              <Button variant="dark" disabled onClick={handleShow}>
                Cambiar Contraseña
              </Button>
              <Button variant="success" type="submit">
                Guardar
              </Button>

              <Modal
                style={{ height: "30rem" }}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="text-muted">
                      <i>Contraseña actual</i>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña actual"
                    />{" "}
                    <br />
                    <Form.Label className="text-muted">
                      <i>Nueva Contraseña</i>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nueva Contraseña"
                    />
                    <br />
                    <Form.Label className="text-muted">
                      <i>Repite la nueva Contraseña</i>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Repite la nueva Contraseña"
                    />
                    <Modal.Footer>
                      <Button variant="danger" onClick={handleClose}>
                        Cancelar
                      </Button>
                      <Button variant="success">Guardar</Button>
                    </Modal.Footer>
                  </Form.Group>
                </Modal.Body>
              </Modal>
            </div>
          </Form>
        </div>
      </div>
      <div className="background-image"></div>
    </>
  );
};

export default EditProfile;
