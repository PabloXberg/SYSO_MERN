import { useContext, useEffect, useState } from "react";
   import { serverURL } from "../serverURL";
import Card from "react-bootstrap/Card";
import nogusta from '../images/LogoShare.png'
import gusta from '../images/LOGO.png.png'
import { AuthContext } from "../contexts/AuthContext";


function Likes(props, likesArray) {
  const [refresh, setRefresh] = useState(false);

  const { user } = useContext(AuthContext);

    const likeSketch = async (props) => {
    const myHeaders = new Headers();
    // setLoading(true);
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
    //   setLoading(false);
      //setRefresh(true);
      //fetchActiveUser(localStorage.getItem("token"));
    //   window.location.reload(); ///////////////////////////////////////////////////////////////////// PROVISORIO
    } catch (error) {
      console.log("error", error);
    //   setLoading(false);
       alert("algo salió mal...")
    }
  };

  const unlikeSketch = async (props) => {
    
    // setLoading(true);
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
    //   setLoading(false);
     // setRefresh(true);
      /// fetchActiveUser(localStorage.getItem("token"));
    //   window.location.reload(); ///////////////////////////////////////////////////////// PROVISORIO
    
    } catch (error) {
      console.log("error", error);
    //   setLoading(false);
      alert("algo salió mal...")
    }
  };
    console.log('propsLIKES :>> ', props);
    
  useEffect(() => {
    console.log("prueba useEffect");
   
    }, [refresh]);


     return (
           <div >
                 {props?.props?.props?.likes?.includes(user?._id) ? (
              // ME GUSTA Y NO ME  GUSTA
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: "5px",
                }}
              >
                {"  "}
                        <Card.Img
                          alt="megusta"
                          src={nogusta}
                      title="ya no me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => unlikeSketch(props?.props?.props?._id) && setRefresh(!refresh)}
                ></Card.Img>
                  
                
                {props?.props?.props?.likes && (
                  <h6 style={{color:"Black"}}> 
                    {props?.props?.props?.likes?.length}{"  "}
                    {props?.props?.props?.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{"  "}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                {"  "}
                          <Card.Img
                          alt="megusta"
                          src={gusta}
                      title="me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => likeSketch(props?.props?.props?._id)&& setRefresh(!refresh)}
                ></Card.Img>
                {props?.props?.props?.likes && (
                  <h6 style={{color:"Black"}}>
             {props?.props?.props?.likes?.length}{"  "}
                    {props?.props?.props?.likes?.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{"  "}
              </div>
            )}

       </div>
     )
   }
   
   export default Likes









