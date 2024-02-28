import Card from "react-bootstrap/Card";
// import SketchModal from "./SketchModal";
// import { useState } from "react";

function UserCard(props: any) {
  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);
  // const [show, setShow] = useState(false);


  return (
    <div style={{ display: "Flex" }}>
      <Card className="UserCard">
        <Card.Img
          className="UserAvatar"
          variant="top"
          src={props.props.avatar}
          style={{
        
            width: "23rem",
            height: "23rem",
             alignSelf: "center",
               padding: "1rem",
            borderRadius:"50%"
          }}
        />
        <Card.Body

          style={{
            width: "23rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Card.Title
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {props.props.username ? props.props.username : "Nombre de Usuario"}
          </Card.Title>

          <Card.Text
            style={{
                 width: "22rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            
            {props.props.info
              ? props.props.info
              : "Aqui podríamos ver alguna informacion del usuario..."}
          </Card.Text>
          <div>
       
            <Card.Footer
              style={{
                   width: "22rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              className="text-muted"
            > <i>{props.props.sketchs.length} Bocetos Subidos</i>
              <i>Registrado el: {shortdatum}</i>
            </Card.Footer>
          </div>

          {/* <Button variant="primary">Details</Button> */}
        </Card.Body>
      </Card>
      {/* <SketchModal
        style={{ cursor: "pointer" }}
        onClose={() => setShow(false)}
        show={show}
        character={props.props}
      /> */}
    </div>
  );
}

export default UserCard;
