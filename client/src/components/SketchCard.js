import Card from "react-bootstrap/Card";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { serverURL } from "../serverURL";
import SpraySpinner from "./SprySpinner";
import Likes from "../components/likes";

function SketchCard(props) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const sketch = props.props;
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarPreview, setAvatarPreview] = useState(sketch?.url);

  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    comment: "",
    url: "",
    battle: "",
  });

  const datum = props.props.createdAt?.substring(0, 10) || t("common.unknownDate");
  const partesFecha = datum.split("-");
  const fechaTransformada =
    partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

  const location = useLocation();

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (user?._id === sketch?.owner._id) {
      if (formData.battle === "") formData.battle = "0";

      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("_id", sketch._id);
      submitData.append("owner", sketch.owner._id);
      submitData.append("name", formData.name);
      submitData.append("comment", formData.comment);
      submitData.append("url", formData.url);
      submitData.append("battle", formData.battle);

      try {
        await fetch(`${serverURL}sketches/update/${sketch?._id}`, {
          method: "POST",
          headers: myHeaders,
          body: submitData,
        });
        handleCloseEdit();
        setLoading(false);
        props.onUpdate?.();
      } catch (error) {
        console.error(error);
        alert(t("sketch.updateError"));
        setLoading(false);
      }
    }
  };

  const handleChangeEdit = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      await fetch(`${serverURL}sketches/delete/${sketchToDelete._id}`, {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
      });
      setLoading(false);
      props.onUpdate?.();
    } catch (error) {
      console.error(error);
      alert(t("sketch.updateError"));
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormData({ ...formData, url: e.target.files[0] });
    } else {
      setFormData({ ...formData, url: "" });
    }
  };

  // eslint-disable-next-line
  const [likesArray, setLikesArray] = useState(sketch?.likes || []);

  const _id = props?.props._id;
  const page = "/sketchdetail/";

  return (
    <div className="SketchCardPage">
      {loading ? (
        <SpraySpinner />
      ) : (
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          <Card className="SketchCard">
            {user ? (
              <Link to={page + _id} params={_id} key={_id}>
                <Card.Img
                  title={t("sketch.clickToOpen")}
                  className="sketchCardImg"
                  variant="top"
                  alt="Sketch"
                  src={props.props.url}
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
                title={t("sketch.clickToOpen")}
                className="sketchCardImg"
                variant="top"
                alt="Sketch"
                src={props.props.url}
                style={{ width: "24rem", height: "24rem", objectFit: "cover" }}
              />
            )}

            <Card.Body className="sketchCardBody">
              <Card.Title>{props?.props.name}</Card.Title>
              <Card.Text>
                {props.props.comment
                  ? props.props.comment
                  : t("sketchDetail.noDescription")}
              </Card.Text>

              {location.pathname === "/sketches" ? (
                <Card.Footer className="text-muted">
                  <i>{t("sketch.uploadedBy")}: </i>
                  <i>
                    {props?.props.owner?.username
                      ? props?.props.owner.username
                      : user?.username}
                  </i>
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
                    <div>{t("sketch.uploadedBy")}: {user?.username}</div>
                    <div>
                      <i
                        title={t("sketch.editTooltip")}
                        className="material-icons Bedit"
                        onClick={handleShowEdit}
                        style={{ cursor: "pointer" }}
                      >
                        edit
                      </i>
                      <i
                        title={t("sketch.deleteTooltip")}
                        className="material-icons Bedit"
                        onClick={handleShowDelete}
                        style={{ cursor: "pointer" }}
                      >
                        delete_forever
                      </i>
                    </div>
                  </Card.Footer>

                  {/* DELETE CONFIRMATION MODAL */}
                  <Modal
                    show={showDelete}
                    onHide={handleCloseDelete}
                    backdrop="static"
                    keyboard={false}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{t("sketch.deleteConfirmTitle")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>{t("sketch.deleteConfirmText")}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button variant="success" onClick={handleCloseDelete}>
                          {t("mySketches.cancel")}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleSketchDelete(sketch)}
                        >
                          {t("sketch.delete")}
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>

                  {/* EDIT SKETCH MODAL */}
                  <Modal
                    show={showEdit}
                    onHide={handleCloseEdit}
                    backdrop="static"
                    keyboard={false}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{t("sketch.editTitle")}</Modal.Title>
                    </Modal.Header>
                    <div style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img
                          alt="preview"
                          src={avatarPreview}
                          style={{
                            maxWidth: "12rem",
                            maxHeight: "12rem",
                            objectFit: "cover",
                          }}
                        />
                        <br />
                        <Form.Control
                          type="file"
                          name="url"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={handleFile}
                        />
                      </div>
                      <br />
                      <Form.Group
                        className="mb-6"
                        controlId="formBasicEmail"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "space-between",
                        }}
                      >
                        <Form.Label>{t("sketch.name")}:</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder={props.props.name}
                          defaultValue={props.props.name}
                          onChange={handleChangeEdit}
                        />

                        <Form.Label>{t("sketch.description")}:</Form.Label>
                        <Form.Control
                          type="text"
                          name="comment"
                          placeholder={props.props.comment}
                          defaultValue={props.props.comment}
                          onChange={handleChangeEdit}
                        />

                        <Form.Label>
                          {t("sketch.battleNumber")}{" "}
                          <i style={{ fontSize: "small" }}>
                            ({t("sketch.battleHint")})
                          </i>
                        </Form.Label>
                        <Form.Control
                          style={{ maxWidth: "10rem" }}
                          type="text"
                          name="battle"
                          placeholder={props.props.battle}
                          defaultValue={props.props.battle}
                          onChange={handleChangeEdit}
                        />
                      </Form.Group>
                      <br />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="danger"
                          onClick={handleCloseEdit}
                        >
                          {t("mySketches.cancel")}
                        </Button>
                        <Button
                          style={{ cursor: "pointer" }}
                          onClick={handleSubmitEdit}
                          variant="success"
                        >
                          {t("sketch.saveChanges")}
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </>
              ) : (
                <Card.Footer className="text-muted">
                  <i>{t("sketch.uploadedBy")}: </i>
                  <b>
                    {props?.props?.owner?.username
                      ? props?.props?.owner?.username
                      : user?.username}
                  </b>
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
                <i>
                  {t("common.uploadDate")}: {fechaTransformada}
                </i>
              </Card.Footer>

              {!user ? (
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
                        title={t("sketch.likeTooltip")}
                        className="material-icons Bedit"
                      >
                        favorite
                      </i>
                      {props?.props?.likes && (
                        <h6>{props?.props.likes?.length}</h6>
                      )}
                    </span>
                    <Form.Label disabled>
                      <i>{t("auth.login")}</i>
                    </Form.Label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        gap: "2px",
                      }}
                    >
                      <i>
                        <i
                          title={t("sketch.likeTooltip")}
                          className="material-icons Bedit"
                        >
                          message
                        </i>
                      </i>
                    </div>
                  </div>
                </Card.Footer>
              ) : (
                <Card.Footer
                  style={{
                    display: "Flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ alignSelf: "flex-start" }}>
                    <Likes
                      onClick={() => setRefresh(!refresh)}
                      key={sketch._id}
                      props={sketch}
                      likesArray={likesArray}
                    />
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
                      <b style={{ color: "#0066FF" }}>
                        {sketch?.comments?.length}{" "}
                      </b>
                    </h6>

                    <Link
                      title={t("sketch.comments")}
                      to={page + _id}
                      params={_id}
                      key={_id}
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
              style={{ cursor: "pointer" }}
              onClose={() => setShow(false)}
              show={show}
              character={props?.props}
            />
          </Card>
        </div>
      )}
    </div>
  );
}

export default SketchCard;
