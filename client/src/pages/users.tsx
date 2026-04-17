// import "../index.css";
import SubHomeNav from "../components/SubHomeNav";
import UserCard from "../components/UserCard";
import { serverURL } from "../serverURL";
import { useFetch } from "../hooks/useFetch";
import { User } from "../@types/models";

const UsersPage = () => {
  // Both old and new backend return { users: [...] }.
  // The new one also adds `pagination` and sorts DESC server-side.
  const { data: users } = useFetch<User[]>(
    `${serverURL}users/all`,
    (raw: any) => {
      const list = raw?.users || [];
      // If there's no pagination field, it's the old backend → reverse client-side
      return raw?.pagination ? list : [...list].reverse();
    }
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
