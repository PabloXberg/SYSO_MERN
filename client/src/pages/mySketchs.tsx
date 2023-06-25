import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../default-placeholder.png";

type Props = {};

interface Sketch {
  _id: String | null | undefined;
  name: String;
  owner: any;
  comment: String;
  url: String | File;
  likes: [];
  comments: [];
}

interface User {
  _id: String | null | undefined;
  email: String;
  username: String;
  password: String;
  info: String;
  sketchs: [];
  likes: [];
  comments: [];
}

type Users = User[];
type id = any;

const MySketchs = (props: Props) => {
  //////////////////////////////////////////////////////////////////////////////// VARIABLES "STATE"
  // const [users, setUsers] = useState<Users>([]);
  const { user } = useContext(AuthContext);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const sketchsArray = activeUser?.sketchs;
  const [ID, setID] = useState<id>(activeUser?._id);
  const [avatarPreview, setAvatarPreview] = useState(DefaultImage);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    owner: "",
    url: "",
  });

  const getUserById = async () => {
    const id = user?._id;
    setID(id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}users/id/${id}`
      );
      const result = await response.json();

      setActiveUser(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserById();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////// HANDLE CHANGE ON MODAL IMPUTS
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData :>> ", formData);
  };

  //////////////////////////////////////////////////////////////////////////////////// HANDLE SUBMIT - SAVE A NEEW SKETCH
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    ///setLoading(true); /// FUTURE SPINNER

    ////////////////////////////////////////////////////////////// HEADERS
    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    //// DATA TO SAVE - BODY -
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("comment", formData.comment);
    submitData.append("owner", ID);
    submitData.append("url", formData.url);

    //////  OPTION BODY
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: submitData,
    };

    /// FETCH
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}sketches/new`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      alert("Success!!! Your new Sketch is uploaded in our data base");
      setLoading(true);
      handleClose();
    } catch (error) {
      console.log(error);
      alert("Something went wrong - check console");
      setLoading(false);
    }
  };

  /// HANDLE THE FILE FROM THE IMPUT - NEW SKETCH FILE
  const handleFile = (e: any) => {
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="title"
      >
        <h1
          className="NavtrapBar"
          style={{ textAlign: "center", fontSize: "xxx-large" }}
        >
          Mis Bocetos
        </h1>
        <Button onClick={handleShow} className="primary">
          <b>+</b>
        </Button>

        <Modal
          className="userRegisterModal"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Sube un nuevo Boceto</Modal.Title>
          </Modal.Header>

          <div>
            <div className="avatar">
              <img
                alt="newSketch"
                style={{
                  position: "static",
                  border: "black 2px solid",
                  padding: "5px",
                  width: "20rem",
                  height: "15rem",
                }}
                src={avatarPreview ? avatarPreview : DefaultImage}
              />
              <br />

              <input
                style={{ padding: "1rem" }}
                type="file"
                name="loading..."
                accept="image/jpg, image/jpeg, image/png"
                onChange={handleFile}
              />
            </div>

            <div className="dataform">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="nombre..."
                  onChange={handleChange}
                />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Label>
                  Comentario o descripción sobre el boceto:
                </Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="descripción..."
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <Modal.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                style={{ cursor: "pointer" }}
                onClick={handleSubmit}
                variant="success"
              >
                Guardar
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>

      <div className="cardcontainer ">
        {/* background-image ??? */}
        {sketchsArray &&
          sketchsArray.map((sketch: Sketch) => {
            return <SketchCard bolean={true} key={sketch._id} props={sketch} />;
          })}
      </div>
    </div>
  );
};

export default MySketchs;
