import "../index.css";
import SubHomeNav from "../components/SubHomeNav";
import UserCard from "../components/UserCard";
import { serverURL } from "../serverURL";
import { useFetch } from "../hooks/useFetch";
import { User } from "../@types/models";

const UsersPage = () => {
  const { data: users } = useFetch<User[]>(
    `${serverURL}users/all`,
    (raw) => raw.users.reverse()
  );

  return (
    <div>
      <SubHomeNav />
      <div className="cardcontainer">
        {users?.map((user) => (
          <UserCard key={user._id} props={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
