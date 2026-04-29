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
import TagChip from "./TagChip";
import TagSelector from "./TagSelector";
import { useCurrentBattle } from "../hooks/useCurrentBattle";

function SketchCard(props) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { battle: currentBattle, refetch: refetchBattle } = useCurrentBattle();

  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addingToBattle, setAddingToBattle] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const sketch = props.props;
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarPreview, setAvatarPreview] = useState(sketch?.url);

  // Resolve battleId — could be a populated object or a plain string id.
  const sketchBattleId =
    sketch?.battleId?._id || sketch?.battleId || null;

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    url: "",
    battleId: sketchBattleId,
    tags: sketch?.tags || [],
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
      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("_id", sketch._id);
      submitData.append("owner", sketch.owner._id);
      submitData.append("name", formData.name || sketch.name);
      submitData.append("comment", formData.comment || sketch.comment);
      submitData.append("url", formData.url);
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

  /**
   * Quick action: attach this sketch to the current battle without opening
   * the full edit modal. Sends just the battleId so name/comment/tags/url
   * stay untouched on the server (the controller updates only fields present
   * in the request body).
   */
  const handleAddToBattle = async () => {
    if (!currentBattle || !user || addingToBattle) return;
    setAddingToBattle(true);
    try {
      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("battleId", currentBattle._id);

      const res = await fetch(`${serverURL}sketches/update/${sketch._id}`, {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      });
      if (!res.ok) throw new Error("Failed to add to battle");
      // Refresh both the parent list and the cached battle (in case the
      // server affected something we'd display from it).
      props.onUpdate?.();
      refetchBattle();
    } catch (err) {
      console.error("handleAddToBattle error:", err);
      alert(t("sketch.addToBattleError"));
    } finally {
      setAddingToBattle(false);
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

  // ─── Battle integration logic ──────────────────────────────────────
  const isOwner = !!user && user._id === sketch?.owner?._id;
  const isInCurrentBattle =
    !!currentBattle && sketchBattleId === currentBattle._id;
  const isInPastBattle = !!sketchBattleId && !isInCurrentBattle;
  // The "Add to battle" shortcut only makes sense when:
  //   - this user owns the sketch
  //   - there's a current battle still open for submissions
  //   - the sketch isn't already in it
  const canAddToBattle =
    isOwner &&
    !!currentBattle &&
    currentBattle.state === "open" &&
    !isInCurrentBattle;

  // For edit modal
  const canJoinBattle =
    !!currentBattle && currentBattle.state === "open";
  const editingIsInCurrentBattle =
    !!formData.battleId &&
    !!currentBattle &&
    formData.battleId === currentBattle._id;

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

              {/* Battle status block — three mutually exclusive states */}
              {isInCurrentBattle && currentBattle && (
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.3rem 0.7rem",
                    backgroundColor: "#3a2a00",
                    color: "#ffcc00",
                    border: "2px solid #ffcc00",
                    borderRadius: "0.3rem",
                    fontSize: "0.8rem",
                    fontFamily: "MiFuente2, MiFuente, cursive",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                    boxShadow: "1px 1px 0 rgba(0,0,0,0.6)",
                  }}
                  title={currentBattle.theme}
                >
                  ⚔ {t("sketch.inCurrentBattle")}
                </div>
              )}
              {isInPastBattle && !isInCurrentBattle && (
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    backgroundColor: "#222",
                    color: "#aaa",
                    border: "1px solid #555",
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

              {/* Quick-action: add this sketch to the current battle */}
              {canAddToBattle && (
                <div style={{ marginBottom: "0.6rem" }}>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={handleAddToBattle}
                    disabled={addingToBattle}
                    style={{
                      fontFamily: "MiFuente2, MiFuente, cursive",
                      letterSpacing: "0.05em",
                      fontWeight: "bold",
                    }}
                    title={`${t("sketch.addToBattle")}: "${currentBattle.theme}"`}
                  >
                    {addingToBattle
                      ? t("sketch.adding")
                      : `⚔ ${t("sketch.addToBattle")}`}
                  </Button>
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

                        {canJoinBattle && currentBattle && (
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
                              checked={editingIsInCurrentBattle}
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
