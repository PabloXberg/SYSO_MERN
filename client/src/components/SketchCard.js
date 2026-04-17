import Card from "react-bootstrap/Card";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { serverURL } from "../serverURL";
import SpraySpinner from "./SprySpinner";
import Likes from "../components/likes";

/**
 * SketchCard
 *
 * Props:
 *   - props: the sketch object (legacy naming, kept to avoid breaking parents)
 *   - onUpdate: optional callback fired after a successful edit/delete,
 *               so the parent page can refetch its list without a full reload.
 */
function SketchCard({ props: sketch, onUpdate }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(sketch?.url);

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    url: "",
    battle: "",
  });

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  // Format date: "YYYY-MM-DD" -> "DD-MM-YYYY"
  const rawDate = sketch?.createdAt?.substring(0, 10) || "";
  const fechaTransformada = rawDate
    ? rawDate.split("-").reverse().join("-")
    : "Fecha desconocida";

  const handleChangeEdit = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, url: e.target.files[0] });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // BUG FIX: was `sketch?.props.owner._id` — sketch has no `.props`
    if (user?._id !== sketch?.owner?._id) {
      alert("No tienes permiso para editar este boceto");
      return;
    }

    setLoading(true);

    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const submitData = new FormData();
    submitData.append("_id", sketch._id);
    submitData.append("owner", sketch.owner._id);
    submitData.append("name", formData.name);
    submitData.append("comment", formData.comment);
    submitData.append("url", formData.url);
    submitData.append("battle", formData.battle || "0");

    try {
      const response = await fetch(
        `${serverURL}sketches/update/${sketch._id}`,
        { method: "POST", headers: myHeaders, body: submitData }
      );
      await response.json();
      handleCloseEdit();
      // Replaces window.location.reload() — keeps SPA behavior
      onUpdate?.();
    } catch (error) {
      console.error(error);
      alert("Algo salió mal, intentalo nuevamente...");
    } finally {
      setLoading(false);
    }
  };

  const handleSketchDelete = async (sketchToDelete) => {
    handleCloseDelete();
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", sketchToDelete._id);
    urlencoded.append("owner", sketchToDelete.owner._id);

    try {
      const response = await fetch(
        `${serverURL}sketches/delete/${sketchToDelete._id}`,
        { method: "DELETE", headers: myHeaders, body: urlencoded }
      );
      await response.json();
      // Replaces window.location.reload() — keeps SPA behavior
      onUpdate?.();
    } catch (error) {
      console.error(error);
      alert("Algo salió Mal - Intentalo otra vez...");
    } finally {
      setLoading(false);
    }
  };

  const _id = sketch?._id;
  const page = "/sketchdetail/";

  if (loading) return <SpraySpinner />;

  return (
    <div className="SketchCardPage">
      <div style={{ display: "flex", flexDirection: "column-reverse" }}>
        <Card className="SketchCard">
          {user ? (
            <Link to={page + _id} key={_id}>
              <Card.Img
                title="Click para ampliar.."
                className="sketchCardImg"
                variant="top"
                alt="Sketch"
                src={sketch?.url}
                style={{
                  cursor: "pointer",
                  width: "24rem",
                  height: "24rem",
                  objectFit: "cover",
                }}
              />
            </Link>
          ) : (
            <Card.Img
              title="Click para ampliar.."
              className="sketchCardImg"
              variant="top"
              alt="Sketch"
              src={sketch?.url}
              style={{
                width: "24rem",
                height: "24rem",
                objectFit: "cover",
              }}
            />
          )}

          <Card.Body className="sketchCardBody">
            <Card.Title>{sketch?.name}</Card.Title>
            <Card.Text>
              {sketch?.comment ||
                "(...aqui normalmente hay informacion sobre el boceto...)"}
            </Card.Text>

            {/* Footer varies depending on the page we're on */}
            {location.pathname === "/sketches" ? (
              <Card.Footer className="text-muted">
                <i>Creado por: </i>{" "}
                <i>{sketch?.owner?.username || user?.username}</i>
              </Card.Footer>
            ) : location.pathname === "/mysketchs" ? (
              <>
                <Card.Footer
                  className="sketchCardFooter"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Creado por mí</div>
                  <div>
                    <i
                      title="Editar Boceto"
                      className="material-icons Bedit"
                      onClick={handleShowEdit}
                      style={{ cursor: "pointer" }}
                    >
                      edit
                    </i>
                    <i
                      title="Eliminar Boceto"
                      className="material-icons Bedit"
                      style={{ cursor: "pointer" }}
                      onClick={handleShowDelete}
                    >
                      delete_forever
                    </i>
                  </div>
                </Card.Footer>

                {/* Delete confirmation modal */}
                <Modal
                  style={{ height: "20rem" }}
                  show={showDelete}
                  onHide={handleCloseDelete}
                  centered
                  scrollable
                >
                  <Modal.Header closeButton>
                    <Modal.Title>ATENCION</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Modal.Header>
                      <Modal.Title>
                        Estas seguro de eliminar este Boceto?
                      </Modal.Title>
                    </Modal.Header>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        title="Cancelar"
                        variant="success"
                        onClick={handleCloseDelete}
                      >
                        Cancelar
                      </Button>
                      <Button
                        title="Eliminar"
                        onClick={() => handleSketchDelete(sketch)}
                        variant="danger"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>

                {/* Edit sketch modal */}
                <Modal
                  className="userRegisterModal xl"
                  show={showEdit}
                  onHide={handleCloseEdit}
                  backdrop="static"
                  keyboard={false}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  size="md"
                  fullscreen={"xl-down"}
                >
                  <Modal.Header style={{ fontSize: "medium" }} closeButton>
                    <Modal.Title style={{ fontSize: "large" }}>
                      Editar Boceto
                    </Modal.Title>
                  </Modal.Header>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt="User Sketch"
                        style={{
                          border: "black 2px solid",
                          padding: "3px",
                          width: "18rem",
                          height: "14rem",
                          alignSelf: "center",
                          objectFit: "cover",
                        }}
                        src={avatarPreview || sketch?.url}
                      />
                      <br />
                      <input
                        style={{ padding: "0.3rem" }}
                        type="file"
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
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder={sketch?.name}
                          defaultValue={sketch?.name}
                          onChange={handleChangeEdit}
                        />

                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                          type="text"
                          name="comment"
                          placeholder={sketch?.comment}
                          defaultValue={sketch?.comment}
                          onChange={handleChangeEdit}
                        />

                        <Form.Label>
                          Batalla n°: #{" "}
                          <i style={{ fontSize: "small" }}>
                            dejar vacío si no participa...
                          </i>
                        </Form.Label>
                        {/* BUG FIX: name was "batlle" — typo meant battle was never saved */}
                        <Form.Control
                          style={{ maxWidth: "10rem" }}
                          type="text"
                          name="battle"
                          placeholder={sketch?.battle}
                          defaultValue={sketch?.battle}
                          onChange={handleChangeEdit}
                        />
                      </Form.Group>
                      <br />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        title="Cancelar"
                        variant="danger"
                        onClick={handleCloseEdit}
                      >
                        Cancelar
                      </Button>
                      <Button
                        title="Guardar cambios"
                        style={{ cursor: "pointer" }}
                        onClick={handleSubmitEdit}
                        variant="success"
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                </Modal>
              </>
            ) : (
              <Card.Footer className="text-muted">
                <i>Creado por: </i>{" "}
                <b>{sketch?.owner?.username || user?.username}</b>
              </Card.Footer>
            )}

            <Card.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
              }}
              className="text-muted"
            >
              <i> Subido el: {fechaTransformada}</i>
            </Card.Footer>

            {!user ? (
              /* Logged out: show like count + hint to log in */
              <Card.Footer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "row" }}>
                    <i
                      title="Iniciar sesion para esta funcion"
                      className="material-icons Bedit"
                    >
                      favorite
                    </i>
                    {sketch?.likes && <h6>{sketch.likes.length}</h6>}
                  </span>
                  <Form.Label disabled>
                    <i>Iniciar sesión para estas funciones</i>
                  </Form.Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      gap: "2px",
                    }}
                  >
                    <i
                      title="Iniciar sesion para esta funcion"
                      className="material-icons Bedit"
                    >
                      message
                    </i>
                  </div>
                </div>
              </Card.Footer>
            ) : (
              /* Logged in: show like button + link to comments */
              <Card.Footer
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ alignSelf: "flex-start" }}>
                  <Likes key={sketch._id} props={sketch} />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "2px",
                  }}
                >
                  <h6>
                    {/* BUG FIX: was sketch?.props?.comments — double-props bug */}
                    <b style={{ color: "#0066FF" }}>
                      {sketch?.comments?.length}
                    </b>
                  </h6>
                  <Link
                    title="Comentarios"
                    to={page + _id}
                    key={_id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <i
                      className="material-icons Bedit"
                      style={{ cursor: "pointer" }}
                    >
                      message
                    </i>
                  </Link>
                </div>
              </Card.Footer>
            )}
          </Card.Body>

          <UserModal
            onClose={() => setShow(false)}
            show={show}
            character={sketch}
          />
        </Card>
      </div>
    </div>
  );
}

export default SketchCard;
