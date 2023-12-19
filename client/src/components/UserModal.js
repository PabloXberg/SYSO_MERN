import Button from "react-bootstrap/Button";

function UserModal(props) {
  if (!props.show) {
    return null;
  }
  // console.log('props :>> ', props);

  const datum = props.character.owner.createdAt;
  const shortdatum = datum.substring(0, 10);
  const partesFecha = shortdatum.split("-");
  const fechaTransformada =
    partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

  let longi;
  if (
    props.character.owner.sketchs !== undefined ||
    props.character.owner.sketchs !== null ||
    props.character.owner.sketchs !== 0
  ) {
    longi = props.character.owner.sketchs.length;
  } else {
    longi = "0";
  }

  function agregarEspacios(str) {
    return str.split("").join(" ");
  }
  const nombre = props.character.owner.username;
  const nombreConEspacios = agregarEspacios(nombre);
  // console.log('longi :>> ', longi);
  // console.log('props  lalalala :>> ', props);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div
        className="modal-conta"
        style={{
          height: "50rem",
          width: "40rem",
          alignSelf: "center",
        }}
        onClick={props.onClose}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header" style={{ color: "White" }}>
            <h3 style={{ fontFamily: "MiFuente", fontSize: "xxx-large" }}>
              {nombreConEspacios}
            </h3>
          </div>
          <div>
            <img
              className="modal-picture"
              src={props.character.owner.avatar}
              alt="User Avatar"
            />
          </div>
          <div style={{ color: "White" }}>
            {" "}
            <br />
            <h5>Información Personal: </h5>
            <p>
              <i>{props.character.owner.info}</i>
            </p>
            <h5>Bocetos subidos: </h5>{" "}
            <p>
              <i>{longi ? longi : props.characters.owner.sketchs.length}</i>
            </p>
            <h5>Registrado el: </h5>{" "}
            <p>
              <i>{fechaTransformada}</i>
            </p>
          </div>
          <div className="modal-footer">
            <Button onClick={props.onClose} className="modal-close-btn">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserModal;