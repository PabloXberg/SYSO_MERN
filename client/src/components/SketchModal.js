import Button from "react-bootstrap/Button";
import SketchCard from "./SketchCard";

/**
 * SketchModal
 * Displays all sketches of a given user in a modal.
 *
 * Props:
 *   - show:      boolean
 *   - onClose:   () => void
 *   - character: a user object (its .sketchs array is listed)
 */
function SketchModal({ show, onClose, character }) {
  if (!show) return null;

  const sketches = character?.sketchs || [];

  return (
    <div className="modal-container" onClick={onClose}>
      <div
        className="modal-content userModal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="modal-footer" style={{ textAlign: "center" }}>
          <Button
            onClick={onClose}
            variant="danger"
            className="modal-close-btn"
          >
            Cerrar
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          {sketches.length === 0 ? (
            <p>
              <i>Este usuario aún no ha subido bocetos.</i>
            </p>
          ) : (
            sketches.map((sketch) => (
              <SketchCard key={sketch._id} props={sketch} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SketchModal;
