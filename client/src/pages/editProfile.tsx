import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../contexts/AuthContext';
import { Image } from 'react-bootstrap';
import '../index.css'

type Props = {}


const EditProfile = (props: Props) => {

  
  const { user, login, logout } = useContext(AuthContext);
  console.log('user :>> ', user);
  const [loading, setLoading] = useState(false);
  const[avatarPreview, setAvatarPreview] = useState(user?.avatar) 


  const [formData, setFormData] = useState<SubmitUpdateData>({
    email: "",
    password: "",
    username: "",
    info: "",
    avatar: ""
  });
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('e.target :>> ', e.target.files);
    if (e.target.files) {
      const arrayURL = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(arrayURL)
      setFormData({ ...formData, avatar: e.target.files[0] })
    } else {
      setFormData({ ...formData, avatar: "" })
    }
  }
  
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    submitData.append("email", formData.email);
    submitData.append("username", formData.username);
    submitData.append("password", formData.password);
    submitData.append("info", formData.info);
    submitData.append("avatar", formData.avatar);

    const requestOptions = {
      method: 'POST',
      body: submitData,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/update`, requestOptions);
      const result = await response.json();
      console.log(result);
      alert("Success! Check console.");
      setLoading(false);
    } catch (error) {
      console.log(error)
      alert("Something went wrong - check console")
      setLoading(false);
    }
  }


  return (
    <div className="updateuser">
      <div className="avatar">

        <Form>

          <Image alt='User Avatar' style={{border: "black 2px solid",padding:"5px" ,borderRadius: "50%", width: "20rem", height: "auto"}} src={avatarPreview ? avatarPreview : user?.avatar} />
          <br />

         {/* eslint-disable-next-line react/jsx-pascal-case */}
         <input style={{padding: "1rem"}} type='file' name='loading...' accept= 'image/jpg, image/jpeg, image/png' onChange={handleFile} />

        </Form>

      </div>

      <div className="dataform">

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >Email address</Form.Label>
                  <Form.Control type='email' name='email' placeholder={user?.email}  onChange={handleChange}/>
                  <Form.Text className="text-muted">
                    <i>Required</i><br /><br />
                  </Form.Text>

                  
                  <Form.Label >User Name:</Form.Label>
                <Form.Control  name='username' placeholder={user?.username}  onChange={handleChange}/>
                  <Form.Text className="text-muted">
                    <i>Required</i><br /><br />
                  </Form.Text>
                
                  <Form.Label >Personal Info:</Form.Label>
                  <Form.Control type="email" placeholder={user?.info}  onChange={handleChange}/>
                  {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text> */}
                </Form.Group>
    {/* 
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control disabled type="password" placeholder="Password" />
          </Form.Group> */}
        
          {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}
          <div className="botones">
                <Button variant="primary" type="submit" disabled>
              change password
              </Button>
                <Button variant="success" type="submit" >
                Save
              </Button>
          </div> 
        
        

        </Form>
      </div>


    </div>
   
  );
}

export default EditProfile