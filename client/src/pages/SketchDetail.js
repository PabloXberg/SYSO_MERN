import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { Button, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { AuthContext } from '../contexts/AuthContext'
import '../index.css'


const SketchDetail = () => {
const { user } = useContext(AuthContext);
const { id } = useParams();
const [sketch, setSketch] = useState();
const [commentImput, setCommentInput] = useState("");
const [resultado, setResultado] = useState("");

const handleChange = (e) => {
  setCommentInput( e.target.value );
  }
  
const geSketchbyID = async (ID) => {
const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();

const requestOptions = {
  method: 'GET',
  headers: myHeaders,

  };
  
 try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}sketches/id/${ID}`, requestOptions)
      const result = await response.json();
      // console.log("single Sketch:", result);
      setSketch(result);
  } catch (error) {
   console.log(error)
   
  }
  }

  const commentSubmit = async() => {
    
   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
   myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    
  const urlencoded = new URLSearchParams();
  urlencoded.append("comment", commentImput);
  urlencoded.append("owner", user._id);
    urlencoded.append("sketch", sketch._id);
  // console.log('commentImput :>> ', commentImput);
    
  const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/new`, requestOptions);
      setResultado (await response.json())
      console.log(resultado);
      setCommentInput("")
      // setLoading(false);
    } catch (error) {
      console.log(error)
      alert("Something went wrong - message did't save")
      // setLoading(false);
    }

  }
  
useEffect(() => {
    geSketchbyID(id)
  }, [resultado]);

  const datum = sketch?.createdAt;
  const shortdatum = datum?.substring(0, 10);


  // console.log('sketch :>> ', sketch);
  // Contenido y lógica del componente
  return (
     <div className="sketchDetails">

       <div className='detailsImage'>
           <Card className="bg-light ">
          <Card.Img variant="top" src={sketch?.url} alt={sketch?.name} />
          <Card.ImgOverlay style={{border: "solid 2px white"}}>
            <h1 className='detailsTitle'>{sketch?.name}</h1>
            <Card.Text className='detailsText2'><i>Upload on {shortdatum}</i></Card.Text>
                    
            
          </Card.ImgOverlay>
            <Card.Text className='detailsText1'>{sketch?.comment}</Card.Text>
          
          
          <div>
           
            {sketch?.comments?.length >= 0
              
              ?
              <>
              {sketch.comments && sketch.comments.map((comment, index) => {
                const commentdatum = comment.createdAt;
                const commentshortdatum = commentdatum.substring(0, 10);
  
                return (

                <div className='commentGrid'>
                    

                    <div key={comment._id} >
                      
                    {/* {console.log('comment :>> ', comment)} */}
                      <div> <p style={{ color: "black" }}><b>{comment?.owner?.username}</b> <i> on: {commentshortdatum}</i></p>  </div> 
                      {comment?.owner._id === user?._id
                        ? 
                     <><i class="small material-icons">edit</i><i class="material-icons">delete_forever</i></> 
                        
                        :
                      ""
                  }
                    </div>
                    <div className="commentText"><p style={{
                        display:"flex", flexDirection: "column"}}>{comment.comment}</p></div>
                      
                    
                </div>
               
    );
})}
              </>
             
            :
            ""}
          </div>


                  <FloatingLabel controlId="floatingTextarea2" label="add a comment..">
                            <Form.Control
                                  as="textarea"
                                  placeholder="Leave a comment here"
                                  style={{ height: '70px', width: "100%" }}
                                  name="comment"
                                  onChange={handleChange}
                                  value={commentImput}
                                  // onSubmit={commentSubmit}
                                />
            <Button onClick={commentSubmit} variant='success'>enviar</Button>
                   </FloatingLabel>
        </Card>
        


        
      </div>

        
      {/* <div className="opciones">
         <Form onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target)
        }}>
          <input type="text" placehodler={"add a comment..."}></input>
        </Form>

      </div> */}
     
       
     </div>
   

  );
};

export default SketchDetail;