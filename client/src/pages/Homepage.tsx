import  { Key, useEffect} from 'react'
import '../../src/index.css'
import SubHomeNav from '../components/SubHomeNav'
import SubHomeNavDown from '../components/SubHomeNavDown'


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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Users = User[]

const Homepage = (props: Props) => {

  useEffect(() => {

  }, [])

  return (
    <><SubHomeNav />
        <div className='homeContainer'>

      {/* WIDget para instagram */}
      {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

      <div className="homeInfo">
        <h2 className='tituloFuente'>Asociacion artistica sin animo de lucro.  </h2><br />
          <h3>Somos un colectivo en pleno desarrollo, como objetivo principal, la realizacion de eventos relacionados con la cultura Hip Hop,<br /><br />
            dando oportunidad y ofreciendo espacios a toda persona que desee expresar su arte con total libertad. <br /><br />
          Organizamos tanto quedadas de bocetos como exposiciones, exhibiciones de Graffiti, conciertos y batallas de freestyle. <br /><br />
          Estamos abiertos a todo tipo de propuestas de quien quiera colaborar con nosotros a nivel local o nacional. <br /><br />
          Varios Sponsors y locales en la ciudad de Valencia nos apoyan en este movimiento y nos facilitan dichas actividades. <br /><br />
          Publicitamos los artistas invitados a traves de contenido visual en varios de los proyectos realizados</h3><br />
      </div>
      

    </div>
    <SubHomeNavDown/>
    </>
   )

 

}

export default Homepage