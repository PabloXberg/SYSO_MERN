import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { serverURL } from "../serverURL";
import SpraySpinner from "./SprySpinner";
import Likes from "../components/likes";
import TagChip from "./TagChip";
import TagSelector from "./TagSelector";
import { useCurrentBattle } from "../hooks/useCurrentBattle";

/**
 * Sketch card — dark theme matching UserCard / WinnerCard.
 * Replaces bootstrap <Card> with custom <div>s for full visual control.
 */
function SketchCard(props) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { battle: currentBattle, refetch: refetchBattle } = useCurrentBattle();

  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addingToBattle, setAddingToBattle] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const sketch = props.props;
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarPreview, setAvatarPreview] = useState(sketch?.url);

  const sketchBattleId = sketch?.battleId?._id || sketch?.battleId || null;

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    url: "",
    battleId: sketchBattleId,
    tags: sketch?.tags || [],
  });

  const datum =
    props.props.createdAt?.substring(0, 10) || t("common.unknownDate");
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
  const tagsToShow = sketch?.tags || [];
  const ownerName = sketch?.owner?.username || user?.username || "?";

  const isOwner = !!user && user._id === sketch?.owner?._id;
  const isInCurrentBattle =
    !!currentBattle && sketchBattleId === currentBattle._id;
  const isInPastBattle = !!sketchBattleId && !isInCurrentBattle;
  const canAddToBattle =
    isOwner &&
    !!currentBattle &&
    currentBattle.state === "open" &&
    !isInCurrentBattle;

  const canJoinBattle = !!currentBattle && currentBattle.state === "open";
  const editingIsInCurrentBattle =
    !!formData.battleId &&
    !!currentBattle &&
    formData.battleId === currentBattle._id;

  const onMySketchsPage = location.pathname === "/mysketchs";

  if (loading) return <SpraySpinner />;

  return (
    <div className="SketchCardPage">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "24rem",
          backgroundColor: "#1a1a1a",
          border: "2px solid #ffcc00",
          borderRadius: "0.4rem",
          overflow: "hidden",
          color: "#f0f0f0",
          boxShadow: hovered
            ? "5px 5px 0 rgba(0,0,0,0.7), 0 0 18px rgba(255,204,0,0.3)"
            : "3px 3px 0 rgba(0,0,0,0.6)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* IMAGE */}
        {user ? (
          <Link to={`/sketchdetail/${_id}`}>
            <img
              title={t("sketch.clickToOpen")}
              alt="Sketch"
              src={props.props.url}
              style={{
                cursor: "pointer",
                width: "100%",
                height: "24rem",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Link>
        ) : (
          <img
            title={t("sketch.clickToOpen")}
            alt="Sketch"
            src={props.props.url}
            style={{
              width: "100%",
              height: "24rem",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* BODY */}
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
          }}
        >
          {/* TITLE */}
          <h3
            style={{
              margin: 0,
              fontFamily: "MiFuente2, MiFuente, cursive",
              fontSize: "1.4rem",
              color: "#ffcc00",
              letterSpacing: "0.04em",
              textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
              wordBreak: "break-word",
            }}
          >
            {props?.props.name}
          </h3>

          {/* TAGS */}
          {tagsToShow.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3rem",
              }}
            >
              {tagsToShow.map((tagValue) => (
                <TagChip key={tagValue} tag={tagValue} size="sm" />
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <p
            style={{
              margin: 0,
              color: props.props.comment ? "#ddd" : "#777",
              fontStyle: props.props.comment ? "normal" : "italic",
              fontSize: "0.9rem",
              wordBreak: "break-word",
              lineHeight: 1.4,
            }}
          >
            {props.props.comment || t("sketchDetail.noDescription")}
          </p>

          {/* BATTLE STATUS BADGES */}
          {isInCurrentBattle && currentBattle && (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "0.3rem 0.7rem",
                backgroundColor: "#3a2a00",
                color: "#ffcc00",
                border: "2px solid #ffcc00",
                borderRadius: "0.3rem",
                fontSize: "0.8rem",
                fontFamily: "MiFuente2, MiFuente, cursive",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
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
                alignSelf: "flex-start",
                padding: "0.2rem 0.6rem",
                backgroundColor: "#222",
                color: "#aaa",
                border: "1px solid #555",
                borderRadius: "0.3rem",
                fontSize: "0.75rem",
                fontFamily: "MiFuente2, MiFuente, cursive",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ⚔ {t("sketch.inBattle")}
            </div>
          )}

          {/* QUICK ADD-TO-BATTLE BUTTON */}
          {canAddToBattle && (
            <Button
              size="sm"
              variant="warning"
              onClick={handleAddToBattle}
              disabled={addingToBattle}
              style={{
                alignSelf: "flex-start",
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
          )}

          {/* OWNER + ACTIONS ROW */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.6rem",
              borderTop: "1px solid #333",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ color: "#ccc", fontStyle: "italic" }}>
              {t("sketch.uploadedBy")}: <b style={{ color: "#fff" }}>{ownerName}</b>
            </div>
            {onMySketchsPage && (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <i
                  title={t("sketch.editTooltip")}
                  className="material-icons"
                  onClick={handleShowEdit}
                  style={{ cursor: "pointer", color: "#ffcc00" }}
                >
                  edit
                </i>
                <i
                  title={t("sketch.deleteTooltip")}
                  className="material-icons"
                  onClick={handleShowDelete}
                  style={{ cursor: "pointer", color: "#ff3b3b" }}
                >
                  delete
                </i>
              </div>
            )}
          </div>

          {/* DATE */}
          <div
            style={{
              fontSize: "0.75rem",
              color: "#888",
              fontStyle: "italic",
            }}
          >
            {t("common.uploadDate")}: {fechaTransformada}
          </div>

          {/* LIKES + COMMENTS */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.55rem",
              borderTop: "1px solid #333",
            }}
          >
            {user ? (
              <Likes
                onClick={() => setRefresh(!refresh)}
                key={sketch._id}
                props={sketch}
                likesArray={likesArray}
              />
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: "#ccc",
                }}
              >
                <i className="material-icons" style={{ color: "#ff3b3b" }}>
                  favorite
                </i>
                <span>{props?.props?.likes?.length || 0}</span>
              </span>
            )}

            <Link
              to={`/sketchdetail/${_id}`}
              title={t("sketch.comments")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "#00aaff",
                textDecoration: "none",
              }}
            >
              <span style={{ color: "#00aaff", fontWeight: "bold" }}>
                {sketch?.comments?.length || 0}
              </span>
              <i className="material-icons">message</i>
            </Link>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
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

      {/* EDIT MODAL */}
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
                  checked={!!editingIsInCurrentBattle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      battleId: e.target.checked ? currentBattle._id : null,
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
              <i
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginTop: "0.5rem",
                }}
              >
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

      <UserModal
        onClose={() => setShow(false)}
        show={show}
        character={props?.props}
      />
    </div>
  );
}

export default SketchCard;
