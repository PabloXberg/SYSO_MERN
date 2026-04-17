import Card from "react-bootstrap/Card";
import { useContext, useState } from "react";
import DefaultImage from "../avatar-placeholder.gif";
import SketchModal from "./SketchModal";
import { AuthContext } from "../contexts/AuthContext";
import { User } from "../@types/models";

const PLACEHOLDER_AVATAR_URL =
  "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

interface UserCardProps {
  props: User;
}

function UserCard({ props: userData }: UserCardProps) {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  // Format date: "YYYY-MM-DD..." -> "DD-MM-YYYY"
  const rawDate = userData.createdAt?.substring(0, 10) || "";
  const fechaTransformada = rawDate
    ? rawDate.split("-").reverse().join("-")
    : "Fecha desconocida";

  // Pick avatar: fall back to default if empty or placeholder
  const avatarSrc =
    !userData.avatar || userData.avatar === PLACEHOLDER_AVATAR_URL
      ? DefaultImage
      : userData.avatar;

  // BUG FIX: original code crashed if userData.sketchs was undefined
  const sketchCount = userData.sketchs?.length ?? 0;
  const canOpenModal = sketchCount > 0 && !!user;

  return (
    <div className="usercard">
      <Card className="UserCard">
        <Card.Img
          variant="top"
          src={avatarSrc}
          alt={`${userData.username} avatar`}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            padding: "1rem",
            borderRadius: "50%",
          }}
        />

        <Card.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "13rem",
          }}
        >
          <Card.Title style={{ textAlign: "center" }}>
            {userData.username || "Nombre de Usuario"}
          </Card.Title>

          <Card.Text style={{ textAlign: "center" }}>
            {userData.info ||
              "Aquí podríamos ver alguna información del usuario..."}
          </Card.Text>

          <Card.Footer
            className="text-muted"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {canOpenModal ? (
              <Card.Link
                style={{ cursor: "pointer" }}
                onClick={() => setShow(true)}
              >
                <i>{sketchCount} Bocetos Subidos</i>
              </Card.Link>
            ) : (
              <i>{sketchCount} Bocetos Subidos</i>
            )}
            <i>Registrado el: {fechaTransformada}</i>
          </Card.Footer>
        </Card.Body>
      </Card>

      <SketchModal
        onClose={() => setShow(false)}
        show={show}
        character={userData}
      />
    </div>
  );
}

export default UserCard;
