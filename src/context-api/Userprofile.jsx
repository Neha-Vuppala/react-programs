import { useContext } from "react";
import UserContext from "./UserContext";

function UserProfile() {
  const username = useContext(UserContext);

  return (
    <div>
      <h2>User Profile</h2>
      <p>Welcome, {username}!</p>
    </div>
  );
}

export default UserProfile;