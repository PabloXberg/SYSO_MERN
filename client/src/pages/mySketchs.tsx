import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../default-placeholder.png";
import SubUserNav from "../components/SubUserNav";

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

  // console.log('ID :>> ', ID);

  const getUserById = async () => {
    //  console.log('id :>> ', id);
    const id = user?._id;
    setID(id);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/id/${id}`);
      const result = await response.json();

      setActiveUser(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserById();
  }, [user, SketchCard]);

  ////////////////////////////////////////////////////////////////////////////////// HANDLE CHANGE ON MODAL IMPUTS
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData :>> ", formData);
  };

  //////////////////////////////////////////////////////////////////////////////////// HANDLE SUBMIT - SAVE A NEEW SKETCH
  const handleSubmit = async (e: { preventDefault: () => void }) => {
   e.preventDefault();
   // setLoading(true); /// FUTURE SPINNER

    ////////////////////////////////////////////////////////////// HEADERS
    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);
    console.log('token :>> ', token);
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

 console.log('ID :>> ', ID);
    console.log('formData :>> ', formData);
      console.log('submitData :>> ', submitData);
    console.log('requestOptions :>> ', requestOptions);
    console.log('FormData :>> ', FormData);
    console.log('requestOptions.body :>> ', requestOptions.body);


    /// FETCH
    try {
      const response = await fetch(
        'http://localhost:5000/api/sketches/new',        requestOptions
      );
      const result = await response.json();
      console.log(result);
      alert("Success!!! Your new Sketch is uploaded in our data base");
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong - check console");
      setLoading(false);
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
    <>
      
    <SubUserNav/>
      <div
        // className="user-conteiner"
      >
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="title"
      >,
        
       
        <Button onClick={handleShow} style={{gap: "1em", fontFamily:'Mifuente2', fontSize:'large'}} variant="success">
          <b>Subir Nuevo Boceto</b>
        </Button>

        <Modal
          size="lg"
          className="userRegisterModal"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Subir un Boceto</Modal.Title>
          </Modal.Header>

          <div >
            <div className="avatar">
              <img
                alt="User Avatar"
                style={{
                  border: "black 2px solid",
                  padding: "5px",
                  width: "15rem",
                  height: "auto",
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
                  placeholder="name"
                  onChange={handleChange}
                />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Label>Comentario sobre el boceto:</Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="comment"
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
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
            return <SketchCard bolean={true} key={sketch._id} props={sketch} />;
          })}
      </div>
      </div>
      </>
  );
};

export default MySketchs;
