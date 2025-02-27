import  { Key, useEffect, useState } from 'react'
import '../index.css'
import SubHomeNav from '../components/SubHomeNav'
import UserCard from '../components/UserCard'
import { serverURL } from '../serverURL'
import SubHomeNavDown from '../components/SubHomeNavDown'



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

const UsersPage = (props: Props) => {
  const [users, setUsers] = useState<Users>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);

   console.log('user :>> ', user);
  
  const getUsers = async () => {
    try {
      const response = await fetch(`${serverURL}users/all`)
      const result = await response.json();

    // Invertir el orden de los datos
   const reversedResult = result.users.reverse();
    
   setUsers(reversedResult);


     // setUsers(result.users);
   /// console.log("all users:", reversedResult)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getUsers();

  }, [])

  return (
    <div>

      <><SubHomeNav/>
       
       <div className='cardcontainer'>
           {users && users.map((user: User) => {
            return <UserCard key={user._id} props={user} />
         })}
        </div>
             {/* <SubHomeNavDown/>              */}
      </>
    </div>
  )
}

export default UsersPage