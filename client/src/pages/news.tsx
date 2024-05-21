import  { useEffect} from 'react'
import '../../src/index.css'
// import SubHomeNav from '../components/SubHomeNav'
import { Card } from 'react-bootstrap'
import cartel from '../images/shareyoursketch.jpg'



//import { InstagramEmbed } from 'react-social-media-embed';

type Props = {}



const News = (props: Props) => {

  useEffect(() => {

  }, [])

  return (
      <>
          {/* <SubHomeNav /> */}
      <div className='newsContainer'>

      {/* WIDget para instagram */}
      {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

  <Card.Img className="sketchDetailsImg" variant="top"
   
            src={cartel} alt={"Share Your Style"} />


    </div>

    </>
   )

 

}

export default News