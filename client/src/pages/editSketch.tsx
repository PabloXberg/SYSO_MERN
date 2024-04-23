import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../contexts/AuthContext';
import { Image } from 'react-bootstrap';
import '../index.css'
//import Modal from 'react-bootstrap/Modal';
import { serverURL } from '../serverURL';


type Props = {
  name: string | undefined;
  comment: string | undefined;
  _id: any;
}


const EditSketch= (props: Props) => {

  
  const { user  } = useContext(AuthContext);
  // console.log('user :>> ', user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const[avatarPreview, setAvatarPreview] = useState(user?.avatar) 

  const sketch = props;
  const [formData, setFormData] = useState<SubmitUpdateSketch>({
    owner: "",
    name: "",
    comment: "",
    url: ""
  });
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL)
      setFormData({ ...formData, url: e.target.files[0] })
    } else {
      setFormData({ ...formData, url: "" })
    }
  }
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);   ///// FUTURE SPINNER
 //   const user_ID = user?._id
console.log('props on edit sketch page:>> ', props);
    const myHeaders = new Headers();
    const token = localStorage.getItem("token")
    myHeaders.append("Authorization", `Bearer ${token}`);


    const submitData = new FormData();
    submitData.append("owner", formData.owner);
    submitData.append("name", formData.name);
    submitData.append("comment", formData.comment);
    submitData.append("url", formData.url);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: submitData,
    };

    try {
       const response = await fetch(`${serverURL}sketches/update/${sketch?._id}`, requestOptions);
       const result = await response.json();
       console.log(result);
      alert("Success!!! User Updated");
      setLoading(false);

      
    } catch (error) {
      console.log(error)
      alert("Something went wrong - Try again...")
      setLoading(false);
    }
  }
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show, setShow] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="updateuser">
        <div className="avatar">

          <Form>

            <Image alt='Sketch Avatar' style={{border: "black 2px solid",padding:"5px" ,borderRadius: "50%", width: "20rem", height: "auto"}} src={avatarPreview ? avatarPreview : user?.avatar} />
            <br />

          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <input style={{padding: "1rem"}} placeholder='Sketch' type='file' name='loading...' accept= 'image/jpg, image/jpeg, image/png' onChange={handleFile} />

          </Form>

        </div>

        <div className="dataform">

              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label >Name</Form.Label>
                    <Form.Control type='email' name='owner' placeholder={sketch?.name}  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                      <i>Required</i><br /><br />
                    </Form.Text>

                    <Form.Label >Descripción:</Form.Label>
                    <Form.Control type="text"name='comment' placeholder={sketch?.comment} onChange={handleChange}/>
                 </Form.Group>
   </Form>
               
            <div className="botones">
                  <Button variant="dark" onClick={handleShow}>
                Cancelar</Button>
                  <Button variant="success" type="submit" >
                  Guardar
              </Button>
             
              
            </div> 
          
          
{/* 
          </Form> */}
        </div>


      </div>
      <div className="background-image">
        

    </div>
      
  </>
  );
}

export default EditSketch