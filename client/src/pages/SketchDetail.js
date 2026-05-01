import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button, Form, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { AuthContext } from "../contexts/AuthContext";
import ShareButtons from "../components/ShareButtons";
import "../index.css";
import { serverURL } from "../serverURL";

const SketchDetail = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [sketch, setSketch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentEditInput, setCommentEditInput] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deleteStates, setDeleteStates] = useState({});
  const [editStates, setEditStates] = useState({});

  /**
   * Back-button handler.
   * If there's history to go back to (the user navigated here from somewhere
   * inside the app), use navigate(-1) which preserves scroll position.
   * Otherwise fall back to /sketches so we never strand the user on an
   * orphan tab they opened directly via URL.
   */
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/sketches");
    }
  };

  const formatDate = (dateStr, wasEdited) => {
    if (!dateStr) return "";
    const fecha = new Date(dateStr);
    const locale = i18n.language.startsWith("en") ? "en-US" : "es-ES";
    const fechaStr = fecha.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const horaStr = fecha.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${
      wasEdited ? t("sketchDetail.editedOn") : t("sketchDetail.saidOn")
    } ${fechaStr} ${horaStr}`;
  };

  const getSketchById = async (sketchId) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${serverURL}sketches/id/${sketchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(
          result.error ||
            result.message ||
            t("sketchDetail.serverError", { status: response.status })
        );
        setSketch(null);
        return;
      }

      if (!result?._id) {
        setErrorMsg(t("sketchDetail.malformedResponse"));
        setSketch(null);
        return;
      }

      setSketch(result);
    } catch (error) {
      console.error("getSketchById error:", error);
      setErrorMsg(t("sketchDetail.connectionError"));
      setSketch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSketchById(id);
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refresh]);

  const commentSubmit = async () => {
    if (!commentInput.trim()) return;
    try {
      await fetch(`${serverURL}comments/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: new URLSearchParams({
          comment: commentInput,
          owner: user._id,
          sketch: sketch._id,
        }),
      });
      setCommentInput("");
      setRefresh(true);
    } catch (error) {
      console.error(error);
      alert(t("sketchDetail.commentError"));
    }
  };

  const commentDelete = async (comment) => {
    if (user._id !== comment.owner._id) return;
    try {
      await fetch(`${serverURL}comments/delete/${comment._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: new URLSearchParams({
          _id: comment._id,
          owner: comment.owner,
          sketch: sketch._id,
        }),
      });
      setDeleteStates((prev) => ({ ...prev, [comment._id]: false }));
      setRefresh(true);
    } catch (error) {
      console.error(error);
      alert(t("sketch.updateError"));
    }
  };

  const handleCommentEdit = async (comment) => {
    try {
      await fetch(`${serverURL}comments/update/${comment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: new URLSearchParams({
          comment: commentEditInput,
          _id: comment._id,
          owner: comment.owner,
          sketch: sketch._id,
        }),
      });
      setEditStates((prev) => ({ ...prev, [comment._id]: false }));
      setRefresh(true);
    } catch (error) {
      console.error(error);
      alert(t("sketch.updateError"));
    }
  };

  /**
   * Reusable back-button styled to match the dark theme.
   * Rendered at the top of every state (loading, error, normal) so the
   * user always has a way out.
   */
  const BackButton = () => (
    <button
      onClick={goBack}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.85rem",
        margin: "0.75rem 0 0.5rem 0.75rem",
        backgroundColor: "transparent",
        color: "#ffcc00",
        border: "2px solid #ffcc00",
        borderRadius: "0.3rem",
        fontFamily: "MiFuente2, MiFuente, cursive",
        fontSize: "0.9rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.15s ease",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#3a2a00";
        e.currentTarget.style.boxShadow = "0 0 8px rgba(255,204,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.boxShadow = "none";
      }}
      title={t("sketchDetail.back", "Volver")}
    >
      ← {t("sketchDetail.back", "Volver")}
    </button>
  );

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border custom-spinner" role="status">
          <span className="visually-hidden">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (!sketch) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#f0f0f0" }}>
        <BackButton />
        <h3>{t("sketchDetail.unableToLoad")}</h3>
        {errorMsg && (
          <p style={{ color: "#aaa", fontStyle: "italic" }}>{errorMsg}</p>
        )}
        <p>
          <a href="/sketches" style={{ color: "#ffcc00" }}>
            {t("sketchDetail.backToSketches")}
          </a>
        </p>
      </div>
    );
  }

  const uploadDate = sketch.createdAt?.substring(0, 10) || "";
  const sketchUrl = `${window.location.origin}/sketchdetail/${sketch._id}`;
  const shareTitle = sketch.name
    ? `🎨 "${sketch.name}" by ${sketch.owner?.username || "?"} on Share Your Sketch`
    : `🎨 Share Your Sketch`;

  return (
    <div className="sketchDetails sketchDetailsBody">
      <BackButton />

      <div className="detailsImage">
        <Card className="bg-light">
          {sketch.url ? (
            <Card.Img
              className="sketchDetailsImg"
              variant="top"
              src={sketch.url}
              alt={sketch.name || "Sketch"}
            />
          ) : (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                background: "#f0f0f0",
              }}
            >
              <p>{t("sketchDetail.imageUnavailable")}</p>
            </div>
          )}

          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              padding: "0.5rem",
            }}
          >
            <h1 className="DetailsTitle">
              {sketch.name || t("sketchDetail.noTitle")}
            </h1>
            <Card.Text className="DetailsOwner">
              {t("common.uploadDate")}{" "}
              <i>
                <b>{uploadDate || "?"}</b>
              </i>{" "}
              {t("common.by")}{" "}
              <i>
                <b>
                  {sketch.owner?.username || t("sketchDetail.unknownUser")}
                </b>
              </i>
            </Card.Text>
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0.5rem",
            }}
          >
            <Card.Text className="detailsText">
              {sketch.comment || <i>{t("sketchDetail.noDescription")}</i>}
            </Card.Text>
            {sketch.likes?.length > 0 && (
              <span>
                <h6>
                  {sketch.likes.length}{" "}
                  <i className="small material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                </h6>
              </span>
            )}
          </div>

          <div style={{ padding: "0.5rem" }}>
            <ShareButtons
              url={sketchUrl}
              title={shareTitle}
              description={sketch.comment}
            />
          </div>

          {user && (
            <FloatingLabel
              controlId="floatingTextarea2"
              label={t("sketchDetail.addComment")}
              style={{ padding: "0.5rem" }}
            >
              <Form.Control
                as="textarea"
                name="comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commentSubmit();
                  }
                }}
              />
            </FloatingLabel>
          )}
        </Card>

        {/* COMMENTS SECTION — dark theme readable */}
        <div className="sketchDetailsBody">
          {[...(sketch.comments || [])].reverse().map((comment) => {
            const wasEdited = comment.createdAt !== comment.updatedAt;
            const textDatum = formatDate(
              wasEdited ? comment.updatedAt : comment.createdAt,
              wasEdited
            );

            return (
              <div
                key={comment._id}
                style={{
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "0.3rem",
                  color: "#f0f0f0",
                }}
              >
                <div className="commentFlex">
                  <div
                    className="commentOwner"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <p style={{ color: "#f0f0f0", margin: 0 }}>
                      <b style={{ color: "#ffcc00" }}>
                        {comment.owner?.username || "?"}
                      </b>{" "}
                      <i style={{ fontSize: "0.8rem", color: "#aaa" }}>
                        {textDatum}
                      </i>
                    </p>

                    {comment.owner?._id === user?._id && (
                      <div className="commentIcons">
                        <i
                          className="large material-icons Bedit"
                          onClick={() =>
                            setEditStates((prev) => ({
                              ...prev,
                              [comment._id]: true,
                            }))
                          }
                          style={{
                            cursor: "pointer",
                            color: "#ffcc00",
                            fontSize: "1.1rem",
                            marginRight: "0.5rem",
                          }}
                          title={t("sketch.editTooltip")}
                        >
                          edit
                        </i>
                        <i
                          className="large material-icons Bedit"
                          onClick={() =>
                            setDeleteStates((prev) => ({
                              ...prev,
                              [comment._id]: true,
                            }))
                          }
                          style={{
                            cursor: "pointer",
                            color: "#ff3b3b",
                            fontSize: "1.1rem",
                          }}
                          title={t("sketch.deleteTooltip")}
                        >
                          delete_forever
                        </i>
                      </div>
                    )}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#ddd",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {comment.comment}
                  </p>
                </div>

                <Modal
                  className="detailsEditModal"
                  show={deleteStates[comment._id] || false}
                  onHide={() =>
                    setDeleteStates((prev) => ({
                      ...prev,
                      [comment._id]: false,
                    }))
                  }
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {t("sketchDetail.deleteCommentConfirmTitle")}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{t("sketchDetail.deleteCommentConfirm")}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        variant="success"
                        onClick={() =>
                          setDeleteStates((prev) => ({
                            ...prev,
                            [comment._id]: false,
                          }))
                        }
                      >
                        {t("mySketches.cancel")}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => commentDelete(comment)}
                      >
                        {t("sketch.delete")}
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>

                <Modal
                  className="detailsEditModal"
                  show={editStates[comment._id] || false}
                  onHide={() =>
                    setEditStates((prev) => ({
                      ...prev,
                      [comment._id]: false,
                    }))
                  }
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {t("sketchDetail.editCommentTitle")}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Control
                      style={{ height: "5rem" }}
                      type="text"
                      name="comment"
                      placeholder={comment.comment}
                      defaultValue={comment.comment}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCommentEdit(comment);
                      }}
                      onChange={(e) => setCommentEditInput(e.target.value)}
                    />
                    <br />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        variant="danger"
                        onClick={() =>
                          setEditStates((prev) => ({
                            ...prev,
                            [comment._id]: false,
                          }))
                        }
                      >
                        {t("mySketches.cancel")}
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleCommentEdit(comment)}
                      >
                        {t("sketch.saveChanges")}
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SketchDetail;
