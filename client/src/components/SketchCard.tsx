import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import UserModal from '../components/UserModal'

// import UserModel from "../../../server/models/userModels.js";



function SketchCard(props: any) {
const { user, login, logout } = useContext(AuthContext);
   const [show, setShow] = useState(false);

    const datum = props.props.createdAt;
    const shortdatum = datum.substring(0, 10);
  
    const [numberLikes, setNumberLikes] = useState<any>(props.props.likes.lenght ? props.props.likes.lenght : 0)
    
    // console.log('props.props.likes.lenght  :>> ', props.props.likes[0] );
    // console.log('numberLikes :>> ', numberLikes);

const likeSketch = async (_id: any) => {
  
const myHeaders = new Headers();
    
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();
urlencoded.append("sketch", _id);

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};
    
try {
    const response = await fetch("http://localhost:5000/api/sketches/like", requestOptions)
    const result = await response.json();
    console.log(result);

  
    } catch (error) {
      console.log('error', error)
    }
  }
  
const unlikeSketch = async (_id: any) => {
  
const myHeaders = new Headers();
    
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();
urlencoded.append("sketch", _id);

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};
    
try {
    const response = await fetch("http://localhost:5000/api/sketches/unlike", requestOptions)
    const result = await response.json();
    console.log(result);
  
    } catch (error) {
      console.log('error', error)
    }
}
  
  
  return (
    <Card style={{ width: '18rem', height:'auto' }}>
      <Card.Img variant="top" alt ="Sketch" src={props.props.url} />
      <Card.Body>
              <Card.Title>{props.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment ? props.props.comment : "Hier we can see some info about the Sketch"}
        </Card.Text>
        
        {props.props.owner.username ?
          <Card.Footer className="text-muted"> <i>Created by: </i> <Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)}><b>{props?.props.owner.username ? props?.props.owner.username : user?.username}</b></Card.Link> 

          </Card.Footer> : <Card.Footer><i className="material-icons" style={{ cursor: "pointer" }}>delete_forever</i></Card.Footer>}
          <Card.Footer className="text-muted"><i>Upload: {shortdatum}</i>
            
        </Card.Footer> 
        <Card.Footer style={{ display: "Flex", flexDirection: "row" }}>
           <div style={{alignSelf:"flex-start"}}>
            <i className="material-icons" style={{ cursor: "pointer" }} onClick={likeSketch}>thumb_up</i>
            <i className="material-icons" style={{ cursor: "pointer" }} onClick={unlikeSketch}>thumb_down</i>
          </div> 
                
          {/* <div style={{alignSelf:"flex-end", justifySelf: "right", justifyContent:"right"}}>
            <h6>{numberLikes} likes</h6>
          </div> */}
               
          </Card.Footer>  
       
      </Card.Body>
      <UserModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </Card>
  );
}

export default SketchCard;

function done(arg0: null, arg1: boolean) {
  throw new Error('Function not implemented.');
}
