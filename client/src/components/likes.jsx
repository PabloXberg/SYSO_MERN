import { useContext, useEffect, useState } from "react";
   import { serverURL } from "../serverURL";
//import Card from "react-bootstrap/Card";
//import nogusta from '../images/LogoShare.png'
//import gusta from '../images/LOGO.png.png'
import { AuthContext } from "../contexts/AuthContext";
//import SpraySpinner from "./SprySpinner"

function Likes(props) {
  const [refresh, setRefresh] = useState(false);
  //const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [likesArray, setlikesArray] = useState(props?.props?.likes || []);


//    const geSketchbyID = async (ID) => {
//     const myHeaders = new Headers();
//     myHeaders.append(
//       "Authorization",
//       `Bearer ${localStorage.getItem("token")}`
//     );
// // eslint-disable-next-line
//     // const urlencoded = new URLSearchParams();

//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//     };

//     try {
//       const response = await fetch(
//         `${serverURL}sketches/id/${ID}`,
//         requestOptions
//       );
//       const result = await response.json();
//       // console.log("single Sketch:", result);
//       setSketch(result);
//     } catch (error) {
//       console.log(error);
//     }
//   };

  const [likeArry, setlikeArry] = useState(props.props.likes)
 useEffect(() => {
    // Código que obtenga los likes actualizados desde el servidor si es necesario

  //  geSketchbyID(user?._id)
  //  console.log('sketch :>> ', sketch);
   console.log("Refresh triggered. Updating likes count.");
   console.log('likesArray :>> ', likesArray);
   console.log('props :>> ', props);
setlikeArry(props.props.likes)
  }, [refresh]);
  ///////////////////////////////////////////////////////////////////////////////////////////////////



  // Función para dar "like"
  const likeSketch = async (props) => {
    ///setLoading(true);
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
      const response = await fetch(`${serverURL}sketches/like`, requestOptions);
      const result = await response.json();
      console.log(result);

      // Actualizar el array de likes en el estado
      setlikesArray([...likesArray, user._id]);
     // setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log("error", error);
     // setLoading(false);
      alert("algo salió mal...");
    }
  };

  // Función para quitar "like"
  const unlikeSketch = async (props) => {
  //  setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization",`Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("sketch", props);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${serverURL}sketches/unlike`,requestOptions);
      const result = await response.json();
      console.log(result);

      // Actualizar el array de likes en el estado
       setlikesArray(likesArray.filter((id) => id !== user._id));
    //  setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log("error", error);
     // setLoading(false);
      alert("algo salió mal...");
    }
  };
 
     return (
       <div >
         
            <div style={{ alignSelf: "flex-start" }}>
                  {/* <Likes onClick={() => setRefresh(!refresh)}  key={sketch._id} props={sketch}/> */}

                  {likesArray.includes(user?._id) ? (
                    // ME GUSTA Y NO ME  GUSTA
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: "5px",
                      }}
                    >
                      {" "}
                      {/* <Card.Img
                          alt="megusta"
                          src={nogusta}
                      title="ya no me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => unlikeSketch(_id) && setRefresh(!refresh)}
                        ></Card.Img> */}
                      <i
                        alt="megusta"
                        title="ya no me gusta"
                        className="material-icons"
                        style={{
                          cursor: "pointer",
                          maxWidth: "1.5rem",
                          maxHeight: "1.5rem",
                        }}
                        onClick={() =>
                          unlikeSketch(props?.props._id)&& setRefresh(!refresh)
                        }
                      >
                        favorite
                      </i>
                      {props?.props?.likes && (
                  <h6 style={{color:"#0066FF"}}> 
                    {likesArray.length}{" "}
                    {likesArray.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{" "}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      {" "}
                      {/* <Card.Img
                          alt="megusta"
                          src={gusta}
                          title="me gusta"
                    //  className="material-icons"
                  style={{ cursor: "pointer", maxWidth:"1.5rem", maxHeight:"1.5rem"}}
                  onClick={() => likeSketch(_id) && setRefresh(!refresh)}
                          ></Card.Img> */}
                      <i
                        alt="megusta"
                        title="me gusta"
                        className="material-icons"
                        style={{
                          cursor: "pointer",
                          maxWidth: "1.5rem",
                          maxHeight: "1.5rem",
                        }}
                        onClick={() => likeSketch(props?.props._id)&&setRefresh(!refresh)}
                      >
                        favorite_border
                      </i>
                      {likesArray && (
                  <h6 style={{color:"#0066FF"}}>
                    {likesArray.length}{" "}
                    {likesArray.length === 1 ? <i></i> : <i></i>}
                  </h6>
                )}{"  "}
                    </div>
                  )}
                </div>

       </div>
     )
   }
   
   export default Likes
