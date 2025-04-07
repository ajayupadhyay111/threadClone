import { Link } from "react-router-dom";

const ProfileBar = ({ user }) => {
  return (
    <Link to={`/profile/threads/${user._id}`}>
      <div key={user._id} className="flex items-center gap-3">
        <img
          src={user.profilePic}
          alt=""
          className="size-10  ml-4 rounded-full"
        />
        <div className="flex w-full py-5 items-center border-b border-gray-500/70">
          <div className="w-full ">
            <h3 className="font-semibold text-md">{user.email}</h3>
            <span className="text-gray-400 text-sm">{user.username}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileBar;
