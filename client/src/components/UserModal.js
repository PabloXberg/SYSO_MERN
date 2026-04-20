import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

function UserModal(props) {
  const { t } = useTranslation();

  if (!props.show) return null;

  // Null-safe: if owner is missing, don't render (prevents crashes)
  const owner = props.character?.owner;
  if (!owner) return null;

  const datum = owner.createdAt?.substring(0, 10) || "";
  const partesFecha = datum.split("-");
  const fechaTransformada =
    partesFecha.length === 3
      ? `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`
      : t("common.unknownDate");

  // Safe length calculation
  const sketchCount = owner.sketchs?.length ?? 0;

  // Add spaces between letters for graffiti-style display
  const nombre = owner.username || "";
  const nombreConEspacios = nombre.split("").join(" ");

  return (
    <div className="userModal">
      <div className="modal-conta userModal" onClick={props.onClose}>
        <div
          className="modal-content userModal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" style={{ color: "White" }}>
            <h3 style={{ fontFamily: "MiFuente", fontSize: "xxx-large" }}>
              {nombreConEspacios}
            </h3>
          </div>
          <div>
            <img
              className="modal-picture"
              src={owner.avatar}
              alt="User Avatar"
            />
          </div>
          <div style={{ color: "White" }}>
            <br />
            <h5>{t("users.personalInfo")}:</h5>
            <p>
              <i>{owner.info || t("users.noInfo")}</i>
            </p>
            <h5>{t("subNav.sketches")}:</h5>
            <p>
              <i>{sketchCount}</i>
            </p>
            <h5>{t("users.registeredOn")}:</h5>
            <p>
              <i>{fechaTransformada}</i>
            </p>
          </div>
          <div className="modal-footer">
            <Button
              title={t("auth.close")}
              onClick={props.onClose}
              className="modal-close-btn"
            >
              {t("auth.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
