import React, { Key, useEffect, useState } from 'react'
import '../../src/index.css'
import SubHomeNav from '../components/SubHomeNav'


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

  useEffect(() => {

  }, [])

  return (
    <><SubHomeNav/>
      <div className='homeContainer'>

      {/* WIDget para instagram */}
      {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

      <div className="homeInfo">
        <h1 style={{ fontFamily: 'MiFuente' }}>Quienes Somos ? </h1><br />
        <h3>Para introducirles en este proyecto y para quien todavia no nos conozca, vamos a hacerles una breve introduccion de quienes somos y a que nos dedicamos. <br /><br />
          Somos un colectivo artistico, que desde hace 3 años venimos realizando diversos eventos en el mundo del arte urbano y de la expresion artistica en varias de sus facetas. <br /><br />
          Organizamos tanto quedadas de bocetos como exposiciones, exhibiciones de Graffiti, conciertos y batallas de freestyle. <br /><br />
          Estamos abiertos a todo tipo de propuestas de quien quiera colaborar con nosotros a nivel local o nacional. <br /><br />
          Varios Sponsors y locales en la ciudad de Valencia nos apoyan en este movimiento y nos facilitan dichas actividades, que hoy por hoy arrastra cada vez mas publico. <br /><br />
          Publicitamos los artistas invitados a traves de contenido visual en varios de los proyectos realizados</h3><br />
      </div>


    </div>

    </>
   )

 

}

export default Homepage