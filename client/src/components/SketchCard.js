import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import UserModal from './UserModal'

// import UserModel from "../../../server/models/userModels.js";



function SketchCard(props) {
  const { user } = useContext(AuthContext);
  console.log('user :>> ', user._id);
const [show, setShow] = useState(false);
  // const [data, setData] = useState([])
  console.log('props :>> ', props);
const datum = props.props.createdAt;
const shortdatum = datum.substring(0, 10);
  
  const likesArray = props?.props?.likes
  console.log('likesArray :>> ', likesArray);
    
    // console.log('props.props.likes.lenght  :>> ', props.props.likes );
    // console.log('numberLikes :>> ', numberOfLikes);

  

const likeSketch= async (props) => {
const myHeaders = new Headers();
    
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();
urlencoded.append("sketch", props);

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};
    
try {
    const response = await fetch("http://localhost:5000/api/sketches/like", requestOptions)
    const result = await response.json();
    console.log(result);
  
   // const newData = data.map((item) => {
  //   console.log('item :>> ', item);
  //   console.log('result :>> ', result);
  //   if (item._id == result._id) {
  //       return result
  //   } else {
  //     return item
  //     }
  //   })

  
    } catch (error) {
      console.log('error', error)
    }
}
  
    
const unlikeSketch = async (props) => {
const myHeaders = new Headers();
    
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();
urlencoded.append("sketch", props);

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};
    
try {
    const response = await fetch("http://localhost:5000/api/sketches/unlike", requestOptions)
    const result = await response.json();
    console.log(result);
  
  
  // const newData = data.map((item) => {
  //   console.log('item :>> ', item);
  //   console.log('result :>> ', result);
  //   if (item._id == result._id) {
  //       return result
  //   } else {
  //     return item
  //     }
  //   })
  
    } catch (error) {
      console.log('error', error)
    }
}
  
  const _id = props.props._id
  // console.log('_id :>> ', _id);
  const isLiked = (likesArray) => {
    if (likesArray?.includes(user._id)) {
      console.log("true");
      return true
    } else {
      console.log("false");
    return false}
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
          <div style={{ alignSelf: "flex-start" }}>
            
            {/* {props?.props?.likes?.includes(user?.id) */}
            {likesArray?.includes(user?._id)
              ?
             <>
             <i className="material-icons" style={{ cursor: "pointer" }} onClick={()=> unlikeSketch(_id)}>thumb_down</i>
        
                {console.log("%cdown", "color:red",likesArray?.includes(user?.id))}
                {console.log("%cdown", "color:red",typeof likesArray[0])}
              </> 
            : 
              <>
                <i className="material-icons" style={{ cursor: "pointer" }} onClick={()=> likeSketch(_id)}>thumb_up</i>
               
                 {console.log("%cup", "color:verde",likesArray?.includes(user?.id))}
              </>
              
            }  
            
             {/* {isLiked(likesArray) */}
             {/* {likesArray?.includes(user?._id)
              ?
           <i className="material-icons" style={{ cursor: "pointer" }} onClick={()=> unlikeSketch(_id)}>thumb_down</i>
            : 
              <i className="material-icons" style={{ cursor: "pointer" }} onClick={()=> likeSketch(_id)}>thumb_up</i>
              
              }   */}
            
           
            
          </div> 
          
          <div style={{ alignSelf: "flex-end", justifySelf: "right", justifyContent: "right" }}>

          { props?.props?.likes &&  <h6>{props?.props?.likes?.length} likes</h6>}
          </div> 
          </Card.Footer>  
       
      </Card.Body>
      <UserModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </Card>
  );
}

export default SketchCard;

