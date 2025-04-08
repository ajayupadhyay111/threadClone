import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditProfile from "@/components/Modals/EditProfilt";
import { useFollowUserMutation, useUserDetailsQuery } from "@/redux/service";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserImg from "@/assets/userImg.jpg";

const ProfileLayout = () => {
  const { id } = useParams(); // Use useParams instead of parsing from location
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { myInfo } = useSelector((state) => state.service);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  // Get user details
  const { data, refetch } = useUserDetailsQuery(id);
  const [followUser, followUserData] = useFollowUserMutation();

  const [myAccount, setMyAccount] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const checkIsFollowing = () => {
    if (data && myInfo) {
      const isTrue = data.user.followers.filter(
        (e) => e._id === myInfo.user._id
      );
      if (isTrue.length > 0) {
        setIsFollowing(true);
        return;
      }
      setIsFollowing(false);
    }
  };

  const checkIsMyAccount = () => {
    if (data && myInfo) {
      const isTrue = data.user._id === myInfo.user._id;
      setMyAccount(isTrue);
    }
  };

  const handleFollow = async () => {
    if (data) {
      await followUser(data.user._id);
    }
  };

  useEffect(() => {
    if (followUserData.isSuccess) {
      toast.success(followUserData.data.message);
    }
    if (followUserData.isError) {
      toast.error(followUserData.error.data.message);
    }
  }, [followUserData.isSuccess, followUserData.isError]);
  useEffect(() => {
    if (data) {
      setUser(data);
      checkIsFollowing();
      checkIsMyAccount();
    }
  }, [data]);
  return (
    <div className="w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col">
      {/* Header */}
      <div className="flex w-full mx-auto justify-between px-3 items-center py-5">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="text-black bg-white rounded-full cursor-pointer"
        />
        <span className="font-bold">Profile</span>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="scrollbar-hidden w-full sm:h-full h-[85vh] mb-10 sm:mb-0 sm:rounded-t-2xl overflow-y-scroll bg-white dark:bg-[#181818] sm:border sm:border-gray-400 dark:border-gray-400/30">
        {/* Profile Info */}
        <div className="p-4">
          <div className="flex items-start justify-between ">
            <div className="flex flex-col justify-start items-start">
              <h2 className="text-2xl font-bold">
                {data ? (data.user ? data.user.username : "") : ""}
              </h2>
              <span className="text-md text-black dark:text-white/90">
                {data ? (data.user ? data.user.email : "") : ""}
              </span>
              <p className="w-full mt-6 pb-4">{data?.user?.bio}</p>
            </div>
            <div>
              <img
                src={data ? (data.user ? data.user.profilePic : "") : ""}
                alt=""
                className="size-[90px] rounded-full"
              />
            </div>
          </div>
          <div className="mb-1 hover:underline py-2 ">
            <span
              onClick={() => setShowFollowersModal(true)}
              className="text-gray-400/90"
            >
              {data
                ? data.user
                  ? data.user.followers.length > 0
                    ? `${data?.user?.followers?.length} followers`
                    : "No Follower"
                  : ""
                : ""}
            </span>
          </div>
          {/* Follow/Edit Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={myAccount ? () => setOpenEditProfile(true) : handleFollow}
          >
            {myAccount ? "Edit Profile" : isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
        {/* Tabs Navigation */}
        <div className="mt-7">
          <div className="flex border-b">
            <NavLink
              to={`/profile/threads/${id}`}
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive
                    ? "border-b border-black dark:border-white dark:text-white"
                    : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Threads
            </NavLink>

            <NavLink
              to={`/profile/replies/${id}`}
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive
                    ? "border-b border-black dark:border-white dark:text-white"
                    : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Replies
            </NavLink>

            <NavLink
              to={`/profile/reposts/${id}`}
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive
                    ? "border-b border-black dark:border-white dark:text-white"
                    : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Reposts
            </NavLink>
          </div>

          {/* Outlet for nested routes */}
          <div>
            <Outlet />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={openEditProfile}
        handleOpen={setOpenEditProfile}
        userData={user}
        refetch={refetch}
      />
      {/* follow modal */}
      <FollowersModal
        isOpen={showFollowersModal}
        handleOpen={setShowFollowersModal}
        followers={data?.user?.followers || []}
        following={data?.user?.following || []}
      />
    </div>
  );
};

export default ProfileLayout;

const FollowersModal = ({
  isOpen,
  handleOpen,
  followers = [],
  following = [],
}) => {
  const [activeTab, setActiveTab] = useState("followers");
  const navigate = useNavigate();

  const UserCard = ({ user }) => (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 cursor-pointer"
      onClick={() => {
        navigate(`/profile/threads/${user._id}`);
        handleOpen(false);
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={user.profilePic || UserImg}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "followers"
                ? "border-b-2 border-black dark:border-white"
                : ""
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "following"
                ? "border-b-2 border-black dark:border-white"
                : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === "followers" ? (
            followers.length > 0 ? (
              followers.map((user) => <UserCard key={user._id} user={user} />)
            ) : (
              <div className="text-center py-8 text-gray-500">
                No followers yet
              </div>
            )
          ) : following.length > 0 ? (
            following.map((user) => <UserCard key={user._id} user={user} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              Not following anyone
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
