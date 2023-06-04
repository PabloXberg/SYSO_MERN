import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link , useLocation} from "react-router-dom";

// import UserModel from "../../../server/models/userModels.js";

  function SketchCard(props, bolean) {
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);

  const likesArray = props?.props?.likes;

  const location = useLocation();
  // console.log('location :>> ', location);
  //////////////////////////////////////////////////////////////////////////////////// USE EFFECT PARA RECARCAR LA PAGINA::: NO FUNCIONA; SOLUCIONAR ESTO

  useEffect(() => {
    if (refresh) {
      // Hacer aquí cualquier otra operación necesaria antes de la recarga del componente
      // console.log("%crefresh :>> ", "color:red", refresh);
      // Reiniciar el estado de refresh después de un corto tiempo
      // setTimeout(() => {
      //   setRefresh(false);
      // }, 100);
    }
  }, [refresh]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const likeSketch = async (props) => {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("sketch", props);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}sketches/like`,requestOptions);
      const result = await response.json();
      console.log(result);
      setRefresh(true);
      window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
    }
  };

  const unlikeSketch = async (props) => {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("sketch", props);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}sketches/unlike`,requestOptions);
      const result = await response.json();
      // console.log(result);
      setRefresh(true);
      window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
    }
  };

  const _id = props.props._id;
const page = '/sketchdetail/'
  return (
    <Card style={{ width: "18rem", height: "auto" }}>
      <Link to={page + _id} params={_id}  key={_id}>
        <Card.Img
          variant="top"
          alt="Sketch"
          src={props.props.url}
          style={{ cursor: "pointer", height:"18rem", width:"18rem"}}

        />
      </Link>

      <Card.Body>
        <Card.Title>{props?.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment
            ? props.props.comment
            : "Hier we can see some info about the Sketch"}
        </Card.Text>
    {/* {      console.log('props :>> ', props)} */}
        {location.pathname === '/sketches'
          
          ?
                    

            
          (<Card.Footer className="text-muted">{" "}<i>Created by: </i>{" "}<Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)}>  
              <b>   
                {props?.props.owner.username 
                  ? props?.props.owner.username
                  : user?.username}
              </b>
            </Card.Link>
          </Card.Footer>
        )
          
          
          : 
                  

          (location.pathname === '/mysketchs' ? <Card.Footer> Created by me  <i className="material-icons" style={{ cursor: "pointer" }}> delete_forever</i></Card.Footer>
             /// AQUI ES DONDE TENDRIA QUE MOSTRARLO EN MIS SKETCHES PROPIOS
            : 
                  ""   /// AQUI ES DONDE TENDRIA QUE MOSTRARLO EN MIS FAVORITOS
            )
        
        
        }
        <Card.Footer className="text-muted">
          <i>Upload: {shortdatum}</i>
        </Card.Footer>
        <Card.Footer style={{ display: "Flex", flexDirection: "row" }}>
          <div style={{ alignSelf: "flex-start" }}>
            {likesArray?.includes(user?._id) ? (
              <i
                className="material-icons"
                style={{ cursor: "pointer" }}
                onClick={() => unlikeSketch(_id)}
              >
                thumb_down
              </i>
            ) : (
              <i
                className="material-icons"
                style={{ cursor: "pointer" }}
                onClick={() => likeSketch(_id)}
              >
                thumb_up
              </i>
            )}
          </div>

          <div
            style={{
              alignSelf: "flex-end",
              justifySelf: "right",
              justifyContent: "right",
              
            }}
          >
            {props?.props?.likes && (
              <h6>
                {props?.props?.likes?.length}{" "}
                {props?.props?.likes?.length === 1 ? "Like" : "Likes"}
              </h6>
            )}
          </div>
          {/* <Link to={page + _id} params={_id}  key={_id}>
           <i
            className="material-icons"
            to="/sketchdetail"
            style={{ cursor: "pointer" }}
          >
            message
          </i> 
          </Link> */}
          
        </Card.Footer>
      </Card.Body>

      
      <UserModal
        style={{ cursor: "pointer" }}
        onClose={() => setShow(false)}
        show={show}
        character={props.props}
      />
    </Card>
  );
}

export default SketchCard;
