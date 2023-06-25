import Card from "react-bootstrap/Card";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { serverURL } from "../serverURL";

function SketchCard(props) {
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const sketch = props;
  // console.log('user :>> ', user);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(sketch?.props.url);

  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    comment: "",
    url: "",
  });

  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);
  const partesFecha = shortdatum.split("-");
  const fechaTransformada =
    partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

  const likesArray = props?.props?.likes;

  const location = useLocation();
  // console.log('location :>> ', location);
  //////////////////////////////////////////////////////////////////////////////////// USE EFFECT PARA RECARCAR LA PAGINA::: NO FUNCIONA; SOLUCIONAR ESTO

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    ///  setLoading(true);   ///// FUTURE SPINNER

    if (user?._id === sketch?.props.owner._id) {
      console.log("props and sketch on edit sketch page:>> ", props, sketch);

      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("_id", sketch.props._id);
      submitData.append("owner", sketch.props.owner._id);
      submitData.append("name", formData.name);
      submitData.append("comment", formData.comment);
      submitData.append("url", formData.url);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      };

      try {
        const response = await fetch(
          `${serverURL}sketches/update/${sketch?.props._id}`,
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
    }
  };

  const handleChangeEdit = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData :>> ", formData);
  };

  const handleSketchDelete = async (sketch) => {
    console.log("sketch :>> ", sketch);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", sketch._id);
    urlencoded.append("owner", sketch.owner._id);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${serverURL}sketches/delete/${sketch._id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      setLoading(true);
      setRefresh(true);
      handleCloseDelete();
      ////    window.location.reload();///// PROVISORIO
    } catch (error) {
      console.log(error);
      alert("Algo salió Mal - Intentalo otra vez...");
    }
  };

  const handleFile = (e) => {
    // console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormData({ ...formData, url: e.target.files[0] });
    } else {
      setFormData({ ...formData, url: "" });
    }
  };

  useEffect(() => {
    setRefresh(false);
    setLoading(false);
  }, [refresh, loading]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const likeSketch = async (props) => {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("sketch", props);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${serverURL}sketches/like`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      setLoading(true);
      setRefresh(true);
      ///fetchActiveUser(localStorage.getItem("token"));
      window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
    }
  };

  const unlikeSketch = async (props) => {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("sketch", props);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${serverURL}sketches/unlike`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      setLoading(true);
      setRefresh(true);
      /// fetchActiveUser(localStorage.getItem("token"));
      window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
    }
  };

  const _id = props?.props._id;
  const page = "/sketchdetail/";
  return (
    ////////////////////////////////////////////////////////////////////////////////////COMIENZA LA CARD
    <Card style={{ width: "18rem", height: "auto" }}>
      <Link to={page + _id} params={_id} key={_id}>
        <Card.Img
          variant="top"
          alt="Sketch"
          src={props.props.url}
          style={{ cursor: "pointer", height: "18rem", width: "18rem" }}
        />
      </Link>

      <Card.Body
        style={{
          width: "18rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Card.Title>{props?.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment
            ? props.props.comment
            : "(...aqui normalmente hay informacion sobre el boceto...)"}
        </Card.Text>

        {/* LA POROXIMA CONDICIONAL/LOGICA ES PARA MOSTRAR O NO MOSTRAR; DEPENDIENDO DEW LA PAGINA; EL FOOTER CON EL NOMBRE DEL CREADOR */}

        {location.pathname === "/sketches" ? (
          <Card.Footer className="text-muted">
            {" "}
            <i>Creado por: </i>{" "}
            <Card.Link
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            >
              <b>
                {" "}
                {props?.props.owner.username
                  ? props?.props.owner.username
                  : user?.username}
              </b>
            </Card.Link>
          </Card.Footer>
        ) : location.pathname === "/mysketchs" ? (
          <>
            {" "}
            <Card.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>Creado por mí</div>
              <div>
                <i
                  className="material-icons Bedit"
                  onClick={handleShowEdit}
                  placeholder="edit"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  edit
                </i>
                <i
                  className="material-icons Bedit"
                  style={{ cursor: "pointer" }}
                  onClick={handleShowDelete}
                >
                  {" "}
                  delete_forever
                </i>
              </div>
            </Card.Footer>
            <Modal
              style={{ height: "20rem" }}
              show={showDelete}
              onHide={handleCloseDelete}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>ATENCION</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {" "}
                <Modal.Header>
                  <Modal.Title>
                    Estas seguro de eliminar este Sketch???
                  </Modal.Title>
                </Modal.Header>{" "}
                <br></br>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {" "}
                  <Button variant="success" onClick={handleCloseDelete}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleSketchDelete(props.props)}
                    variant="danger"
                  >
                    Eliminar
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/*//////////////////////////////// EDITAR SKETCH MODAL   /////////////////////////// */}
            <Modal
              className="userRegisterModal dark"
              show={showEdit}
              onHide={handleCloseEdit}
              backdrop="static"
              keyboard={false}
              aria-labelledby="contained-modal-title-vcenter"
              centered
              // style={{ height: "70rem" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Editar Sketch</Modal.Title>
              </Modal.Header>

              <div>
                <div className="avatar">
                  {/* {console.log('avatarPreview :>> ', avatarPreview)}
                     {console.log('sketch :>> ', sketch)} */}
                  <img
                    alt="User Sketch"
                    style={{
                      border: "black 2px solid",
                      padding: "3px",
                      width: "20rem",
                      height: "12rem",
                      alignSelf: "center",
                    }}
                    src={avatarPreview ? avatarPreview : sketch?.url}
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
                  <Form.Group
                    className="mb-6"
                    controlId="formBasicEmail"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "space-between",
                    }}
                  >
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder={props.props.name}
                      defaultValue={props.props.name}
                      onChange={handleChangeEdit}
                    />
                    <Form.Text className="text-muted"></Form.Text>

                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                      type="text"
                      name="comment"
                      placeholder={props.props.comment}
                      defaultValue={props.props.comment}
                      onChange={handleChangeEdit}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                  <br />
                </div>

                <Modal.Footer
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: "8rem",
                  }}
                >
                  <Button variant="danger" onClick={handleCloseEdit}>
                    Cancelar
                  </Button>
                  <Button
                    style={{ cursor: "pointer" }}
                    onClick={handleSubmitEdit}
                    variant="success"
                  >
                    Guardar
                  </Button>
                </Modal.Footer>
              </div>
            </Modal>
          </>
        ) : (
          /// AQUI ES DONDE TENDRIA QUE MOSTRARLO EN MIS SKETCHES PROPIOS
          //AQUI DEVERIA IR EL FOOTER CON EL NOMBRE DEL CREADOR; EN LA PAGINA DE MIS FAVORITOS

          <Card.Footer className="text-muted">
            {" "}
            <i>Creado por: </i>{" "}
            <b>
              {" "}
              {props?.props?.owner?.username
                ? props?.props?.owner?.username
                : user?.username}
            </b>
            {/* <Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)}>
               
            </Card.Link> */}
          </Card.Footer>
        )}

        <Card.Footer className="text-muted">
          Subido el: <i>{fechaTransformada}</i>
        </Card.Footer>

        <Card.Footer
          style={{
            display: "Flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignSelf: "flex-start" }}>
            {/* {console.log('likesArray :>> ', likesArray)}
              {console.log('user._id >> ', user?._id)}
              {console.log('props :>> ', props)} */}
            {/* {props.props.likes._id === user?._id */}

            {likesArray.includes(user?._id) ? (
              // ME GUSTA Y NO ME  GUSTA
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: "5px",
                }}
              >
                {" "}
                <i
                  className="material-icons Bedit"
                  style={{ cursor: "pointer" }}
                  onClick={() => unlikeSketch(_id)}
                >
                  thumb_down
                </i>
                {props?.props?.likes && (
                  <h6>
                    {props?.props.likes?.length}{" "}
                    {props?.props.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{" "}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                {" "}
                <i
                  className="material-icons Bedit"
                  style={{ cursor: "pointer" }}
                  onClick={() => likeSketch(_id)}
                >
                  thumb_up
                </i>
                {props?.props?.likes && (
                  <h6>
                    {props?.props.likes?.length}{" "}
                    {props?.props.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{" "}
              </div>
            )}
          </div>

          {/* <div >
              
              {props?.props?.likes && (<h6>{props?.props.likes?.length}{" "}{props?.props.likes?.length === 1 ? <i></i> : <i></i> }</h6>)}              
            </div> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "2px",
            }}
          >
            <h6>
              <b>{sketch?.props?.comments?.length} </b>{" "}
            </h6>

            <Link
              to={page + _id}
              params={_id}
              key={_id}
              style={{
                disply: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <i
                className="material-icons Bedit"
                to="/sketchdetail"
                style={{ cursor: "pointer" }}
              >
                message
              </i>
            </Link>
          </div>
        </Card.Footer>
      </Card.Body>

      <UserModal
        style={{ cursor: "pointer" }}
        onClose={() => setShow(false)}
        show={show}
        character={props?.props}
      />
    </Card>
  );
}

export default SketchCard;
