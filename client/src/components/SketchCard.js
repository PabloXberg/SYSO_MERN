import Card from "react-bootstrap/Card";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { serverURL } from "../serverURL";
import SpraySpinner from "./SprySpinner";
import Likes from "../components/likes";
import TagChip from "./TagChip";
import TagSelector from "./TagSelector";

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

  // Current battle, fetched lazily — only needed when the edit modal opens.
  const [currentBattle, setCurrentBattle] = useState(null);

  // formData.battleId is the source of truth for the toggle:
  //   null  → not participating
  //   "<id>" → participating in that battle
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    url: "",
    battleId: sketch?.battleId?._id || sketch?.battleId || null,
    tags: sketch?.tags || [],
  });

  // Fetch the current battle once when the edit modal opens
  useEffect(() => {
    if (!showEdit || currentBattle !== null) return;
    fetch(`${serverURL}battles/current`)
      .then((r) => r.json())
      .then((data) => setCurrentBattle(data || { _id: null }))
      .catch(() => setCurrentBattle({ _id: null }));
  }, [showEdit, currentBattle]);

  const datum = props.props.createdAt?.substring(0, 10) || t("common.unknownDate");
  const partesFecha = datum.split("-");
  const fechaTransformada =
    partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

  const location = useLocation();

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (user?._id === sketch?.owner._id) {
      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("_id", sketch._id);
      submitData.append("owner", sketch.owner._id);
      submitData.append("name", formData.name || sketch.name);
      submitData.append("comment", formData.comment || sketch.comment);
      submitData.append("url", formData.url);
      // battleId can be null (sent as empty string → backend treats as null)
      submitData.append("battleId", formData.battleId || "");
      submitData.append("tags", (formData.tags || []).join(","));

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

  const handleTagsChange = (tags) => {
    setFormData({ ...formData, tags });
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
    }
  };

  // eslint-disable-next-line
  const [likesArray, setLikesArray] = useState(sketch?.likes || []);

  const _id = props?.props._id;
  const page = "/sketchdetail/";

  // Tags visible on the card
  const tagsToShow = sketch?.tags || [];

  // Battle toggle helpers ------------------------------------------------
  // Can the user join (or stay in) the current battle? Only if it exists
  // and is still in "open" state for new submissions.
  const canJoinBattle =
    currentBattle && currentBattle._id && currentBattle.state === "open";
  // Is this sketch currently participating in the active battle?
  const isInCurrentBattle =
    formData.battleId && currentBattle && formData.battleId === currentBattle._id;

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

              {tagsToShow.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.3rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {tagsToShow.map((tagValue) => (
                    <TagChip key={tagValue} tag={tagValue} size="sm" />
                  ))}
                </div>
              )}

              <Card.Text>
                {props.props.comment
                  ? props.props.comment
                  : t("sketchDetail.noDescription")}
              </Card.Text>

              {/* Show a small badge if this sketch is in the current battle */}
              {sketch?.battleId && (
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    backgroundColor: "#3a2a00",
                    color: "#ffcc00",
                    border: "1px solid #ffcc00",
                    borderRadius: "0.3rem",
                    fontSize: "0.75rem",
                    fontFamily: "MiFuente2, MiFuente, cursive",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  ⚔ {t("sketch.inBattle")}
                </div>
              )}

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
                        delete
                      </i>
                    </div>
                  </Card.Footer>

                  {/* Delete confirmation modal */}
                  <Modal show={showDelete} onHide={handleCloseDelete} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>{t("sketch.deleteTitle")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{t("sketch.deleteConfirm")}</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseDelete}>
                        {t("mySketches.cancel")}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleSketchDelete(sketch)}
                      >
                        {t("sketch.delete")}
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* Edit modal */}
                  <Modal
                    show={showEdit}
                    onHide={handleCloseEdit}
                    backdrop="static"
                    keyboard={false}
                    centered
                    size="lg"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{t("sketch.editTitle")}</Modal.Title>
                    </Modal.Header>
                    <div style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
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
                        className="mb-3"
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

                        {/* Battle toggle — replaces the old "número de batalla" text input.
                            Only enabled if the current battle is open for submissions. */}
                        {canJoinBattle && (
                          <div
                            style={{
                              marginTop: "1rem",
                              padding: "0.75rem 1rem",
                              border: "2px solid #ffcc00",
                              borderRadius: "0.3rem",
                              backgroundColor: "#1a1a1a",
                              color: "#ffcc00",
                            }}
                          >
                            <Form.Check
                              type="switch"
                              id={`battle-toggle-${sketch._id}`}
                              checked={!!isInCurrentBattle}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  battleId: e.target.checked
                                    ? currentBattle._id
                                    : null,
                                })
                              }
                              label={
                                <span
                                  style={{
                                    fontFamily: "MiFuente2, MiFuente, cursive",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {t("mySketches.participateInBattle")}:{" "}
                                  <b>"{currentBattle.theme}"</b>
                                </span>
                              }
                            />
                          </div>
                        )}
                        {/* Helpful explanation when there's no joinable battle */}
                        {!canJoinBattle && (
                          <i style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.5rem" }}>
                            {t("sketch.noActiveBattle")}
                          </i>
                        )}
                      </Form.Group>

                      <TagSelector
                        selected={formData.tags}
                        onChange={handleTagsChange}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: "1rem",
                        }}
                      >
                        <Button variant="danger" onClick={handleCloseEdit}>
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
