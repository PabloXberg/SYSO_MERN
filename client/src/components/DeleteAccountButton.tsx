import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";

/**
 * Self-contained "Delete Account" section.
 * Drop it anywhere inside a logged-in page (e.g. EditProfile).
 *
 * Flow:
 *   1. Red "Delete account" button
 *   2. Confirmation modal with a strong warning
 *   3. The user must type their exact username to enable the final button
 *   4. Final click → DELETE /api/users/delete/:id → logout → redirect to /
 *
 * Why type-the-username instead of password re-entry?
 *   - The user is already authenticated (JWT)
 *   - Typing forces them to actively engage with the destructive action
 *   - Way harder to do by accident than just "click the red button"
 */
const DeleteAccountButton = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleClose = () => {
    setShowModal(false);
    setConfirmInput("");
  };

  const canConfirm =
    !loading && confirmInput.trim() === (user.username || "").trim();

  const handleDelete = async () => {
    if (!canConfirm || !user._id) return;
    setLoading(true);

    try {
      // The route is /users/delete/:id. The :id is required by the route
      // even though the controller uses req.user._id from the JWT.
      const response = await fetch(`${serverURL}users/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        alert(body.error || t("deleteAccount.error"));
        setLoading(false);
        return;
      }

      // Server-side cleanup is done — clear client state and go home.
      logout();
      navigate("/");
    } catch (error) {
      console.error("Delete account failed:", error);
      alert(t("deleteAccount.error"));
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "2px dashed #dc3545",
          borderRadius: "0.3rem",
          backgroundColor: "rgba(220, 53, 69, 0.05)",
          maxWidth: "640px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h5 style={{ color: "#dc3545", marginBottom: "0.5rem" }}>
          ⚠️ {t("deleteAccount.dangerZone")}
        </h5>
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
          {t("deleteAccount.description")}
        </p>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          🗑️ {t("deleteAccount.button")}
        </Button>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#dc3545" }}>
            ⚠️ {t("deleteAccount.confirmTitle")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>{t("deleteAccount.warningHeader")}</strong>
          </p>
          <ul style={{ fontSize: "0.9rem", paddingLeft: "1.2rem" }}>
            <li>{t("deleteAccount.warningSketches")}</li>
            <li>{t("deleteAccount.warningComments")}</li>
            <li>{t("deleteAccount.warningLikes")}</li>
            <li>{t("deleteAccount.warningNotifications")}</li>
            <li>
              <strong>{t("deleteAccount.warningIrreversible")}</strong>
            </li>
          </ul>

          <hr />

          <Form.Label>
            {t("deleteAccount.typeUsername")}{" "}
            <strong>{user.username}</strong>:
          </Form.Label>
          <Form.Control
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={user.username}
            autoFocus
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            {t("deleteAccount.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={!canConfirm}
          >
            {loading
              ? t("deleteAccount.deleting")
              : t("deleteAccount.confirmFinal")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAccountButton;
