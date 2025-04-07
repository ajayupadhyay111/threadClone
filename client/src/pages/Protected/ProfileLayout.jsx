import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EditProfile from "@/components/Modals/EditProfilt";
import { useFollowUserMutation, useUserDetailsQuery } from "@/redux/service";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
const ProfileLayout = () => {
  const { id } = useParams(); // Use useParams instead of parsing from location
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { myInfo } = useSelector((state) => state.service);

  // Get user details
  const { data,refetch } = useUserDetailsQuery(id);
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

  console.log(data?.user)

  useEffect(() => {
    if (followUserData.isSuccess) {
      console.log(followUserData);
    }
    if (followUserData.isError) {
      console.log(followUserData.error);
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
            <span className="text-gray-400/90">
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
    </div>
  );
};

export default ProfileLayout;
