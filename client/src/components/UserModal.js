import Button from "react-bootstrap/Button";

/**
 * UserModal
 * Shows info about the OWNER of a sketch (used from SketchCard).
 *
 * Props:
 *   - show:     boolean
 *   - onClose:  () => void
 *   - character: a sketch object (its .owner is what we display)
 */
function UserModal({ show, onClose, character }) {
  if (!show || !character?.owner) return null;

  const owner = character.owner;

  // Format date: "2024-05-23T..." -> "23-05-2024"
  const rawDate = owner.createdAt?.substring(0, 10) || "";
  const fechaTransformada = rawDate
    ? rawDate.split("-").reverse().join("-")
    : "Fecha desconocida";

  // BUG FIX: previous code was `!== undefined || null || 0` which is always true,
  // then on the else branch referenced `props.characters` (plural, doesn't exist)
  // → guaranteed crash. Null-safe now.
  const sketchCount = owner.sketchs?.length ?? 0;

  return (
    <div className="modal-container" onClick={onClose}>
      <div
        className="modal-content userModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ fontFamily: "MiFuente", fontSize: "xxx-large" }}>
            {owner.username}
          </h3>
        </div>

        <div>
          <img
            className="modal-picture"
            src={owner.avatar}
            alt={`${owner.username} avatar`}
          />
        </div>

        <div>
          <h5>Información Personal</h5>
          <p>
            <i>{owner.info || "Sin información"}</i>
          </p>

          <h5>Bocetos subidos</h5>
          <p>
            <i>{sketchCount}</i>
          </p>

          <h5>Registrado el</h5>
          <p>
            <i>{fechaTransformada}</i>
          </p>
        </div>

        <div className="modal-footer">
          <Button
            title="Cerrar"
            onClick={onClose}
            variant="dark"
            className="modal-close-btn"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
