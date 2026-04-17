import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button, Form, Modal } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { AuthContext } from "../contexts/AuthContext";
import "../index.css";
import { serverURL } from "../serverURL";

// Helper: format a date string into "DD/MM/YYYY HH:MM:SS"
const formatDate = (dateStr, wasEdited) => {
  if (!dateStr) return "";
  const fecha = new Date(dateStr);
  const fechaStr = fecha.toLocaleDateString("es-ES", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const horaStr = fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  return `${wasEdited ? "editado el" : "dijo el"} ${fechaStr} ${horaStr}`;
};

const SketchDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [sketch, setSketch] = useState(null);
  const [loading, setLoading] = useState(true);   // FIX: loading state
  const [commentInput, setCommentInput] = useState("");
  const [commentEditInput, setCommentEditInput] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deleteStates, setDeleteStates] = useState({});
  const [editStates, setEditStates] = useState({});

  const getSketchById = async (sketchId) => {
    setLoading(true);
    try {
      const response = await fetch(`${serverURL}sketches/id/${sketchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      setSketch(result);
    } catch (error) {
      console.error("getSketchById error:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    getSketchById(id);
    setRefresh(false);
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
      alert("Something went wrong — message not saved");
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
      alert("Algo salió Mal - Intentalo otra vez...");
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
      alert("Algo salió Mal - Intentalo otra vez...");
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  // FIX: previously `sketch` started as undefined and the component tried to
  // render sketch.url before the fetch completed → broken image + possible crash.
  // Now we show a spinner while loading and nothing if the fetch failed.
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border custom-spinner" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!sketch) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>No se pudo cargar el boceto.</h3>
      </div>
    );
  }

  // ── Date formatting ────────────────────────────────────────────────────────
  const uploadDate = sketch.createdAt?.substring(0, 10) || "";

  return (
    <div className="sketchDetails sketchDetailsBody">
      <div className="detailsImage">
        <Card className="bg-light">

          {/* ── Sketch image ──────────────────────────────────────────────── */}
          <Card.Img
            className="sketchDetailsImg"
            variant="top"
            src={sketch.url}
            alt={sketch.name}
          />

          {/* ── Title + upload info ───────────────────────────────────────── */}
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
            <h1 className="DetailsTitle">{sketch.name}</h1>
            <Card.Text className="DetailsOwner">
              Subido el <i><b>{uploadDate}</b></i> por{" "}
              <i><b>{sketch.owner?.username}</b></i>
            </Card.Text>
          </span>

          {/* ── Description + likes ──────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0.5rem",
            }}
          >
            <Card.Text className="detailsText">{sketch.comment}</Card.Text>
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

          {/* ── Comment input (only for logged-in users) ─────────────────── */}
          {user && (
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Agrega un comentario..."
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

        {/* ── Comments list ─────────────────────────────────────────────── */}
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
                      <b>{comment.owner?.username}</b>{" "}
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
                    <Modal.Title>ATENCIÓN</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>¿Estás seguro de borrar el comentario?</p>
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
                        Cancelar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => commentDelete(comment)}
                      >
                        Eliminar
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
                    <Modal.Title>Editar Comentario</Modal.Title>
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
                        Cancelar
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleCommentEdit(comment)}
                      >
                        Guardar
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
