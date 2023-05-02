import React, {useState} from 'react'

type Props = {}
type Avatar = undefined | File
// interface FormData{
//     email: string,
//     password:string,
//     username:string
// }
const Register = (props: Props) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        avatar: ""
    });
    
  const handleChange = (e: { target: { name: any; value: any} }) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e: { preventDefault: () => void }) => {
        e.preventDefault();
        // console.log('formData :>> ', formData);
        // const myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        // const urlencoded = new URLSearchParams(); // URL ENCODED HAVE TO BE STRINGS (NOT FOR FILES)

        const submitData = new FormData()
        submitData.append("email", formData.email);
        submitData.append("username", formData.username);
        submitData.append("password", formData.password);
        submitData.append("avatar", formData.avatar);

        const requestOptions = {
            method: 'POST',
            // headers: myHeaders
            body: submitData,
        };
        try {
            
            const response = await fetch("http://localhost:5000/api/users/new", requestOptions)
            const result = await response.json();
            console.log('result :>> ', result);      
            alert("Register Successful!!!!")
        } catch (error) {
            console.log(error);
            alert("Something went wrong...! - Check console")
            
        }
    }

//    const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/users/new`, requestOptions) // PARA CAMBIAR EL FETCH ARRIBA POR UNA VARIABLE GLOBAL 

    const handleFile = (e: any) => {
        // console.log(typeof e.target.files[0]);
        setFormData({ ...formData, avatar: e.target.files[0] });
    }
   


    return (
      
        <div>
            
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
              <input type='email' name='email' placeholder='email' onChange={handleChange} />
              <input type='password' name='password' placeholder='password' onChange={handleChange}/>
                <input type='text' name='username' placeholder='username' onChange={handleChange} />
                <input type='file' name ='avatar' accept="image/png, image/jpeg, image/jpg" onChange={handleFile}/>
              <button type='submit'>Register!</button>
          </form>
    </div>
  )
}

export default Register