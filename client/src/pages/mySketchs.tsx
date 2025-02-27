import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../default-placeholder.png";
import SubUserNav from "../components/SubUserNav";
import { serverURL } from "../serverURL";
// import SpinnerShare from "../components/Spinner";
import SpraySpinner from "../components/SprySpinner";
import "../index.css";

type Props = {};

interface Sketch {
  _id: string;
  name: string;
  owner: string;
  comment: string;
  url: string | File;
  likes: [];
  comments: [];
  battle: string;
}

interface User {
  _id: string | Blob | undefined;
  email: string;
  username: string;
  password: string;
  info: string;
  sketchs: [];
  likes: [];
  comments: [];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Users = User[];
type id = any;

const MySketchs = (props: Props) => {
  //////////////////////////////////////////////////////////////////////////////// VARIABLES "STATE"
  // const [users, setUsers] = useState<Users>([]);
  const { user } = useContext(AuthContext);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const sketchsArray = activeUser?.sketchs;
  const [ID, setID] = useState<id>(activeUser?._id);
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    owner: user?._id,
    url: "",
    battle: "",
  });

  // console.log('ID :>> ', ID);

  const getUserById = async () => {
    //  console.log('id :>> ', id);
    const id = user?._id;
    if (id !== undefined) {
      try {
        const response = await fetch(`${serverURL}users/id/${id}`);
        const result = await response.json();
        setActiveUser(result);
        setFormData({ ...formData, owner: user?._id });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getUserById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, SketchCard]);

  // console.log('process.env.REACT_APP_BASE_URL :>> ', process.env.REACT_APP_BASE_URL);
  ////////////////////////////////////////////////////////////////////////////////// HANDLE CHANGE ON MODAL IMPUTS
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    ID === undefined ? setID(formData.owner) : setID(formData.owner);
    console.log("formData :>> ", formData);
    // console.log("ID :>> ", ID);
  };

  //////////////////////////////////////////////////////////////////////////////////// HANDLE SUBMIT - SAVE A NEEW SKETCH
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    // e.preventDefault();

    if (!formData.name || !formData.comment || !formData.url) {
      alert("Falta rellenar alguno de los campos");
      return;
    }
    if (formData.battle === "") {
      formData.battle = "0";
    }
    setLoading(true); /// FUTURE SPINNER

    ////////////////////////////////////////////////////////////// HEADERS
    if (ID !== undefined) {
      const myHeaders = new Headers();
      const token = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${token}`);
      console.log("token :>> ", token);
      //// DATA TO SAVE - BODY -
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("comment", formData.comment);
      submitData.append("owner", ID);
      submitData.append("url", formData.url);
      submitData.append("battle", formData.battle);

      console.log("submitData :>> ", submitData);
      //////  OPTION BODY
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      };

      /// FETCH

      try {
        const response = await fetch(
          `${serverURL}sketches/new`,
          requestOptions
        );
        const result = await response.json();
        console.log(result);
        // alert("Success!!! Your new Sketch is uploaded in our data base");
        setLoading(false);
        handleClose();
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Something went wrong - check console");
        setLoading(false);
        handleClose();
      }
    }
  };

  /// HANDLE THE FILE FROM THE IMPUT - NEW SKETCH FILE
  const handleFile = (e: any) => {
    e.preventDefault();
    console.log("e.target :>> ", e.target.files);
    if (e.target.files) {
      let arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL);
      setFormData({ ...formData, url: e.target.files[0] });
    } else {
      setFormData({ ...formData, url: "" });
    }
  };

  return (
    <div className="mySketch">
      {loading ? (
        // <SpinnerShare/>
        <SpraySpinner />
      ) : (
        <>
          {" "}
          <SubUserNav />
          <div
          // className="user-conteiner"
          >
            <div
            
              className="title"
            >
              ,
                <Button
                  title="Subir un nuevo Boceto!!"
                onClick={handleShow}
                style={{
                  gap: "1em",
                  fontFamily: "Mifuente2",
                  fontSize: "large",
                }}
                variant="success"
              >
                <b>Subir Nuevo Boceto</b>
              </Button>
              <Modal
                className="userRegisterModal"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header style={{ fontSize: "small" }} closeButton>
                  <Modal.Title style={{ fontSize: "medium" }}>
                    Subir un Boceto
                  </Modal.Title>
                </Modal.Header>

                <div>
                  <div
                    className="Avatar"
                
                  >
                      <img
                        loading="lazy"
                     
                      title="Seleccionar boceto"
                      alt="boceto"
                      src={avatarPreview ? avatarPreview : DefaultImage}
                    />
                    <br />

                    <input
                      placeholder="avatar"
                      title="Seleccionar boceto"
                      // style={{ padding: "1rem" }}
                      type="file"
                      name="loading..."
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={handleFile}
                    />
                  </div>
                  <br />

                  <div className="dataform">
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicEmail"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      {/* <Form.Label>Nombre:</Form.Label> */}
                      <Form.Control
                        style={{ maxWidth: "20rem" }}
                        type="text"
                        name="name"
                        placeholder="nombre"
                        onChange={handleChange}
                      />
                      <Form.Text className="text-muted"></Form.Text>
                      {/* <Form.Label>Descripción del boceto:</Form.Label> */}
                      <Form.Control
                        style={{ maxWidth: "20rem" }}
                        type="text"
                        name="comment"
                        placeholder="Descripcion"
                        onChange={handleChange}
                      />
                      <Form.Label>Battle #: </Form.Label>
                      <i >
                        {" "}
                        * dejar este campo vacío en caso de no participar en
                        ninguna batalla
                      </i>
                      <Form.Control
                        style={{ maxWidth: "10rem" }}
                        type="text"
                        name="battle"
                        placeholder="-"
                        onChange={handleChange}
                      />
                      {/* <Form.Label disabled></Form.Label> */}
                    </Form.Group>
                  </div>
                  <Modal.Footer>
                    <Button
                      title="cancelar"
                      variant="danger"
                      onClick={handleClose}
                    >
                      Cerrar
                    </Button>
                    <Button
                      title="Subir Boceto"
                      style={{ cursor: "pointer" }}
                      onClick={handleSubmit}
                      variant="success"
                    >
                      Subir
                    </Button>
                  </Modal.Footer>
                </div>
              </Modal>
            </div>

            <div className="cardcontainer">
              {sketchsArray &&
                sketchsArray.map((sketch: Sketch) => {
                  return (
                    <SketchCard bolean={true} key={sketch._id} props={sketch} />
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MySketchs;
