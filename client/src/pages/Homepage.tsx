import React, { Key, useEffect, useState } from 'react'
import '../../src/index.css'
//import { InstagramEmbed } from 'react-social-media-embed';

type Props = {}

interface User {
  _id: Key | null | undefined
  email: String,
  username: String,
  password: String,
  info: String,
  sketchs: [],
  likes: [],
  comments:[]

}

type Users = User[]

const Homepage = (props: Props) => {
  //const [users, setUsers] = useState<Users>([]);
  //const [user, setUser] = useState<User | null>(null);

  // const getUsers = async() => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/users/all");
  //     const result = await response.json();
  //     setUsers(result);
  //     console.log("all users:", result)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  // +++++++++++ PARA BUSCAR UN USUARIO EN PARTICULAR
  // const getUserById = async() => {
  //   const id = "6447a2bc1362e69f068f823b";
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/users/id/${id}`);
  //     const result = await response.json();
  //     console.log("single user:", result);
  //     setUser(result);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    // getUsers();
    // getUserById();
  }, [])

  return (
    
    <> <div className='homeContainer'>

      {/* WIDget para instagram */}
      {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

      <div className="homeInfo">
        <h1>Quienes Somos: </h1><br />
          <h3>Para introducirles en este proyecto y para quien todavía no nos conozca, voy a hacerles una breve introducción de quienes somos y a que nos dedicamos. <br/>
          Somos un colectivo artístico que desde hace 3 años venimos realizando diversos eventos en el mundo del arte urbanoy de la expresión artística en varias de sus facetas. <br />
          Organizamos tanto quedadas de bocetos como exposiciones, exhibiciones de Graffiti, conciertos musicales y batallas de freestyle. <br />
          Estamos abiertos a todo tipo de propuestas de quien quiera colaborar con nosotros a nivel nacional. <br />
          Varios Sponsors y locales en la ciudad de Valencia nos apoyan en este movimiento y nos facilitan dichas actividades, que hoy por hoy arrastra cada vez mas público. <br />
          Publicitamos los artistas invitados a través de contenido visual en varios de los proyectos realizados</h3>
      </div>
      
      
    </div>
                  
   </>
   )

 

}

export default Homepage