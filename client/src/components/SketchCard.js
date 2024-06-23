import Card from "react-bootstrap/Card";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import UserModal from "./UserModal";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { serverURL } from "../serverURL";
import SpraySpinner from "./SprySpinner";
import nogusta from '../images/LogoShare.png'
import Likes from "../components/likes";

function SketchCard(props) {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseDelete = () => {
    setShowDelete(false);

  }
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => {
    setShowEdit(false);
    
  }
  const handleShowEdit = () => setShowEdit(true);
  const sketch = props;
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(sketch?.props.url);

  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    comment: "",
    url: "",
    battle:""
  });

  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);
  const partesFecha = shortdatum.split("-");
  const fechaTransformada =
    partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];

  const likesArray = props?.props?.likes;
  const location = useLocation();

  //////////////////////////////////////////////////////////////////////////////////// USE EFFECT PARA RECARCAR LA PAGINA::: NO FUNCIONA; SOLUCIONAR ESTO

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
      setLoading(true);   ///// FUTURE SPINNER

    if (user?._id === sketch?.props.owner._id) {
      console.log("props and sketch on edit sketch page:>> ", props, sketch);
      if (formData.battle === ""){formData.battle = "0"}
      
      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const submitData = new FormData();
      submitData.append("_id", sketch.props._id);
      submitData.append("owner", sketch.props.owner._id);
      submitData.append("name", formData.name);
      submitData.append("comment", formData.comment);
      submitData.append("url", formData.url);
      submitData.append("battle", formData.battle);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      };

      try {
        const response = await fetch(
          `${serverURL}sketches/update/${sketch?.props._id}`,
          requestOptions
        );
        const result = await response.json();
        console.log(result);
        // alert("Success!!! User Updated");
       
        handleCloseEdit();
         setLoading(false);
        window.location.reload(); //// CAMBIAR POR ALGO MEJOR
      } catch (error) {
        console.log(error);
        alert("Algo salió mal, intentalo nuevamente...");
        setLoading(false);
      }
    }
  };

  const handleChangeEdit = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData :>> ", formData);
  };

  const handleSketchDelete = async (sketch) => {
    // e.preventDefault();
    handleCloseDelete();
     setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", sketch._id);
    urlencoded.append("owner", sketch.owner._id);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${serverURL}sketches/delete/${sketch._id}`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
        setLoading(false);
        
        window.location.reload();///// PROVISORIO
    } catch (error) {
      console.log(error);
      alert("Algo salió Mal - Intentalo otra vez...");
    }
  };

  const handleFile = (e) => {
    // console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormData({ ...formData, url: e.target.files[0] });
    } else {
      setFormData({ ...formData, url: "" });
    }
  };

  useEffect(() => {
    // setLoading(false);
  }, [refresh, loading]);
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const likeSketch = async (props) => {
    const myHeaders = new Headers();
    setLoading(true);
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
      const response = await fetch(
        `${serverURL}sketches/like`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      setLoading(false);
      setRefresh(true);
      ///fetchActiveUser(localStorage.getItem("token"));
      window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
      setLoading(false);
       alert("algo salió mal...")
    }
  };

  const unlikeSketch = async (props) => {
    
    setLoading(true);
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
      const response = await fetch(
        `${serverURL}sketches/unlike`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      setLoading(false);
      setRefresh(true);
      /// fetchActiveUser(localStorage.getItem("token"));
      window.location.reload(); ///////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      alert("algo salió mal...")
    }
  };

  const _id = props?.props._id;
  const page = "/sketchdetail/";


  return (
    /////////////////////////////////////////////////////////////////////////COMIENZA LA CARD
    <div className="SketchCardPage">
      
      {loading ? (
        // <SpinnerShare/>
        <SpraySpinner />
      ) : (<Card className="SketchCard">

      {user ? (<Link to={page + _id} params={_id} key={_id}>
        <Card.Img
          title="Click para ampliar.."
          className="sketchCardImg"
          variant="top"
          alt="Sketch"
          src={props.props.url}
          style={{ cursor: "pointer", width: "26rem",
            height: "26rem" }}
        />
      </Link>)
        :
        
        (<Card.Img
          title="Click para ampliar.."
          className="sketchCardImg"
          variant="top"
          alt="Sketch"
          src={props.props.url}
          style={{  width: "26rem",
            height: "26rem" }}
        />
      )}
      

      <Card.Body
        className="sketchCardBody"
        // style={{
        //   width: "18rem",
        //   display: "flex",
        //   flexDirection: "column",
        //   justifyContent: "space-between",
        // }}
      >
        <Card.Title>{props?.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment
            ? props.props.comment
            : "(...aqui normalmente hay informacion sobre el boceto...)"}
        </Card.Text>

        {/* LA POROXIMA CONDICIONAL/LOGICA ES PARA MOSTRAR O NO MOSTRAR; DEPENDIENDO DEW LA PAGINA; EL FOOTER CON EL NOMBRE DEL CREADOR */}

        {location.pathname === "/sketches" ? (
          <Card.Footer className="text-muted">
            {" "}
            <i>Creado por: </i>{" "} <i>  {props?.props.owner.username
                  ? props?.props.owner.username
                  : user?.username}</i>
            {/* <Card.Link
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            >
              <b>
                {" "}
                {props?.props.owner.username
                  ? props?.props.owner.username
                  : user?.username}
              </b>
            </Card.Link> */}
          </Card.Footer>
        ) : location.pathname === "/mysketchs" ? (
          <>
            {" "}
              <Card.Footer 
                className="sketchCardFooter"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>Creado por mí</div>
              <div>
                  <i
                  title="Editar Boceto"
                  className="material-icons Bedit"
                  onClick={handleShowEdit}
                  placeholder="edit"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  edit
                </i>
                  <i
                    title="Eliminar Boceto"
                  className="material-icons Bedit"
                  style={{ cursor: "pointer" }}
                  onClick={handleShowDelete}
                >
                  {" "}
                  delete_forever
                </i>
              </div>
            </Card.Footer>
            <Modal
              style={{ height: "20rem" }}
              show={showDelete}
              onHide={handleCloseDelete}
                    centered
                    scrollable
            >
              <Modal.Header closeButton>
                <Modal.Title>ATENCION</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {" "}
                <Modal.Header>
                  <Modal.Title>
                    Estas seguro de eliminar este Boceto?
                  </Modal.Title>
                </Modal.Header>{" "}
                <br></br>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {" "}
                    <Button
                      title="Cancelar"
                      variant="success" onClick={handleCloseDelete}>
                    Cancelar
                  </Button>
                    <Button
                      title="Eliminar"
                       onClick={() => handleSketchDelete(props.props)}
                       variant="danger"
                  >
                    Eliminar
                  </Button>
                </div>
              </Modal.Body>
              </Modal>
              
            {/*//////////////////////////////// EDITAR SKETCH MODAL   /////////////////////////// */}
            
              <Modal
              className="userRegisterModal xl"
              show={showEdit}
              onHide={handleCloseEdit}
              backdrop="static"
              keyboard={false}
              aria-labelledby="contained-modal-title-vcenter"
              centered
                size="md"
                fullscreen={'xl-down'}
            >
              <Modal.Header style={{fontSize:"medium"}} closeButton>
                <Modal.Title style={{fontSize:"large"}}>Editar Boceto</Modal.Title>
              </Modal.Header>

              <div>
                  <div
                    // className="avatar"
                                              style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                  >
                  {/* {console.log('avatarPreview :>> ', avatarPreview)}
                     {console.log('sketch :>> ', sketch)} */}
                  <img
                    alt="User Sketch"
                    style={{
                      border: "black 2px solid",
                      padding: "3px",
                      width: "18rem",
                      height: "14rem",
                      alignSelf: "center",
                    }}
                    src={avatarPreview ? avatarPreview : sketch?.url}
                  />
                  <br />

                  {/* eslint-disable-next-line react/jsx-pascal-case */}
                  <input
                    style={{ padding: "0.3rem" }}
                    type="file"
                    name="loading..."
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={handleFile}
                  />
                </div>

                <div className="dataform">
                  <Form.Group
                    className="mb-6"
                    controlId="formBasicEmail"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "space-between",
                    }}
                  >
                    <Form.Label>Nombre:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder={props.props.name}
                      defaultValue={props.props.name}
                        onChange={handleChangeEdit}
                      />
                      
                    <Form.Text className="text-muted"></Form.Text>

                    <Form.Label>Descripción:</Form.Label>
                    <Form.Control
                      type="text"
                      name="comment"
                      placeholder={props.props.comment}
                      defaultValue={props.props.comment}
                        //  onKeyDown={(e) => {
                        //     if (e.key === "Enter") {
                        //       handleSubmitEdit();
          
                        //     }
                        //   }}
                        onChange={handleChangeEdit}
                                         
                      />
                      
                      <Form.Label>Batalla n°:  # <i style={{fontSize:"small"}}>dejar vacío si no participa...</i></Form.Label>
                      <Form.Control
                        style={{maxWidth:"10rem"}}
                      type="text"
                      name="batlle"
                      placeholder={props.props.battle}
                      defaultValue={props.props.battle}
                      onChange={handleChangeEdit}
                      />
               
                  </Form.Group>
                  <br />
                </div>
                <div    style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
           
                  }}>
               
                  <Button title="Cancelar" variant="danger" onClick={handleCloseEdit}>
                    Cancelar
                  </Button>
                    <Button
                      title="Guardar cambios"
                    style={{ cursor: "pointer" }}
                    onClick={handleSubmitEdit}
                    variant="success"
                  >
                    Guardar
                  </Button>
               </div>
              </div>
            </Modal>
          </>
        ) : (
          /// AQUI ES DONDE TENDRIA QUE MOSTRARLO EN MIS SKETCHES PROPIOS
          //AQUI DEVERIA IR EL FOOTER CON EL NOMBRE DEL CREADOR; EN LA PAGINA DE MIS FAVORITOS

          <Card.Footer className="text-muted">
            {" "}
            <i>Creado por: </i>{" "}
            <b>
              {" "}
              {props?.props?.owner?.username
                ? props?.props?.owner?.username
                : user?.username}
            </b>
            {/* <Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)}>
               
            </Card.Link> */}
          </Card.Footer>
        )}

        <Card.Footer
          style={{display:"flex", flexDirection:"row", justifyContent:"Space-around"}}
          className="text-muted">
         <i> Subido el: {fechaTransformada}</i>
        </Card.Footer>

        {!user ? ( //// SI NO HAY USUARIO LOGEADO; MUESTRA ESTO
          <Card.Footer>
                          
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
            >
              <span  style={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                {" "}
                <i
                  title="Iniciar sesion para esta funcion"
                  className="material-icons Bedit"
                  // style={{ cursor: "pointer" }}
                //  onClick={alert("Debes iniciar sesion para usar esta función")}
                >
                  favorite
                </i>
                {props?.props?.likes && (
                  <h6>
                    {props?.props.likes?.length}{" "}
                    {props?.props.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{" "}
              
                   </span>    
                    <Form.Label disabled><i>Iniciar sesión para estas funciones</i></Form.Label>
                   <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "2px",
            }}
          >
                
                
            <i
              style={{
                disply: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
                  <i
                    title="Iniciar sesion para esta funcion"
                className="material-icons Bedit"
                    // style={{ cursor: "pointer" }}
                    // onClick={alert("Debes iniciar sesion para usar esta función")}
              >
                message
              </i>
            </i>
              </div>
        </div>

          </Card.Footer>
        )
          :
          ( /////SI HAY UN USUARIO LOAGEADO//////////////////////////////////
            <Card.Footer
          style={{
            display: "Flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignSelf: "flex-start" }}>
                      <Likes  bolean={false} key={sketch._id} props={sketch}/>

            {/* {likesArray.includes(user?._id) ? (
              // ME GUSTA Y NO ME  GUSTA
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: "5px",
                }}
              >
                {" "}
                        <Card.Img
                          alt="megusta"
                          src={nogusta}
                      title="ya no me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => unlikeSketch(_id)}
                ></Card.Img>
                  
                
                {props?.props?.likes && (
                  <h6 style={{color:"#0066FF"}}> 
                    {props?.props.likes?.length}{" "}
                    {props?.props.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{" "}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                {" "}
                          <Card.Img
                          alt="megusta"
                          src={gusta}
                      title="me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => likeSketch(_id)}
                ></Card.Img>
                {props?.props?.likes && (
                  <h6 style={{color:"#0066FF"}}>
                    {props?.props.likes?.length}{" "}
                    {props?.props.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{"  "}
              </div>
            )} */}
          </div>

          {/* <div >
              
              {props?.props?.likes && (<h6>{props?.props.likes?.length}{" "}{props?.props.likes?.length === 1 ? <i></i> : <i></i> }</h6>)}              
            </div> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "2px",
            }}
          >
            <h6>
              <b style={{color:"#0066FF"}}>{sketch?.props?.comments?.length} </b>{" "}
            </h6>
            
                <Link
                  title="Comentarios"
              to={page + _id}
              params={_id}
              key={_id}
              style={{
                disply: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <i
                className="material-icons Bedit"
                to="/sketchdetail"
                style={{ cursor: "pointer" }}
              >
                message
              </i>
            </Link>
          </div>
        </Card.Footer>
      )}
       
      </Card.Body>

      <UserModal
        style={{ cursor: "pointer" }}
        onClose={() => setShow(false)}
        show={show}
        character={props?.props}
      />
      </Card>)}
      
    
    </div>
    
  );
}

export default SketchCard;
