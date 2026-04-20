import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button, Form, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { AuthContext } from "../contexts/AuthContext";
import "../index.css";
import { serverURL } from "../serverURL";

const SketchDetail = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [sketch, setSketch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentEditInput, setCommentEditInput] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deleteStates, setDeleteStates] = useState({});
  const [editStates, setEditStates] = useState({});

  // Format a date using the current language's locale
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
    return `${wasEdited ? t("sketchDetail.editedOn") : t("sketchDetail.saidOn")} ${fechaStr} ${horaStr}`;
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
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>{t("sketchDetail.unableToLoad")}</h3>
        {errorMsg && (
          <p style={{ color: "#888", fontStyle: "italic" }}>{errorMsg}</p>
        )}
        <p>
          <a href="/sketches">{t("sketchDetail.backToSketches")}</a>
        </p>
      </div>
    );
  }

  const uploadDate = sketch.createdAt?.substring(0, 10) || "";

  return (
    <div className="sketchDetails sketchDetailsBody">
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

        <div className="sketchDetailsBody">
          {[...(sketch.comments || [])].reverse().map((comment) => {
            const wasEdited = comment.createdAt !== comment.updatedAt;
            const textDatum = formatDate(
              wasEdited ? comment.updatedAt : comment.createdAt,
              wasEdited
            );

            return (
              <div key={comment._id} style={{ padding: "3px" }}>
                <div className="commentFlex">
                  <div className="commentOwner">
                    <p style={{ color: "black", margin: 0 }}>
                      <b>{comment.owner?.username || "?"}</b>{" "}
                      <i style={{ fontSize: "0.8rem" }}>{textDatum}</i>
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
                          style={{ cursor: "pointer" }}
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
                          style={{ cursor: "pointer" }}
                        >
                          delete_forever
                        </i>
                      </div>
                    )}
                  </div>

                  <p style={{ margin: "0.25rem 0" }}>
                    <i>{comment.comment}</i>
                  </p>
                </div>

                {/* Delete comment modal */}
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

                {/* Edit comment modal */}
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
