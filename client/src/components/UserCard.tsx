import Card from "react-bootstrap/Card";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultImage from "../avatar-placeholder.gif";
import SketchModal from "./SketchModal";
import { AuthContext } from "../contexts/AuthContext";

function UserCard(props: any) {
  const { t } = useTranslation();
  const datum = props.props.createdAt?.substring(0, 10) || t("common.unknownDate");
  const [show, setShow] = useState(false);
  const AVATAR_PLACEHOLDER =
    "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png";

  const AvatarFinal =
    props.props.avatar === "" || props.props.avatar === AVATAR_PLACEHOLDER
      ? DefaultImage
      : props.props.avatar;

  const { user } = useContext(AuthContext);

  return (
    <div className="usercard">
      <Card className="UserCard">
        <Card.Img
          variant="top"
          src={AvatarFinal}
          style={{
            width: "20rem",
            height: "20rem",
            alignSelf: "center",
            padding: "1rem",
            borderRadius: "50%",
          }}
        />
        <Card.Body
          style={{
            height: "auto",
            minHeight: "13rem",
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
            {props.props.username ? props.props.username : t("auth.username")}
          </Card.Title>

          <Card.Text
            style={{
              width: "22rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {props.props.info ? props.props.info : t("users.noInfo")}
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
            >
              {props.props.sketchs?.length > 0 && user ? (
                <Card.Link
                  style={{ cursor: "pointer" }}
                  onClick={() => setShow(true)}
                >
                  <i>
                    {t("users.sketchesUploaded", {
                      count: props.props.sketchs.length,
                    })}
                  </i>
                </Card.Link>
              ) : (
                <i>
                  {t("users.sketchesUploaded", {
                    count: props.props.sketchs?.length || 0,
                  })}
                </i>
              )}

              <i>
                {t("users.registeredOn")}: {datum}
              </i>
            </Card.Footer>
          </div>
        </Card.Body>
      </Card>
      <SketchModal
        onClose={() => setShow(false)}
        show={show}
        character={props.props}
      />
    </div>
  );
}

export default UserCard;
