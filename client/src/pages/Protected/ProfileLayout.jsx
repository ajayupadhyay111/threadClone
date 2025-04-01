import React, { useState } from "react";
import UserImg from "../../assets/userImg.jpg";
import { Button } from "@/components/ui/button";
import { NavLink, Outlet } from "react-router-dom";
import EditProfile from "@/components/Modals/EditProfilt";

const ProfileLayout = () => {
  const [OpenEditProfile, setOpenEditProfile] = useState(false);
  return (
    <div className=" w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col ">
      <div className=" hidden sm:flex w-full mx-auto justify-center items-center py-5 ">
        <span className="font-bold">Profile</span>
      </div>
      <div className="scrollbar-hidden w-full h-screen rounded-t-2xl overflow-y-scroll bg-white dark:bg-[#181818] sm:border sm:border-gray-400">
        <div className="p-4 ">
          <div className="flex items-start justify-between ">
            <div className="flex flex-col justify-start items-start">
              <h2 className="text-2xl font-bold">ajay upadhyay</h2>
              <span className="text-md text-black dark:text-white/90">ajjugamer171</span>
              <p className="w-48 mt-3">
                this is bisdf fsdf fklsdj fkwejf iosklvf sklehf uiowej hklsjf
                oiwejhfklasjkj
              </p>
            </div>
            <div>
              <img src={UserImg} alt="" className="size-[90px] rounded-full" />
            </div>
          </div>
          <div className="mt-2 mb-4">
            <span className="text-gray-400">0 followers</span>
            {/* icons */}
          </div>
          <div
            onClick={() => setOpenEditProfile(true)}
            className="w-full flex items-center justify-center"
          >
            <Button variant={"outline"} className="w-full">
              Edit Profile
            </Button>
          </div>
        </div>
        <div className="mt-7">
          <div className="flex border-b ">
            <NavLink
              to="/profile/threads"
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive ? "border-b border-black dark:border-white dark:text-white" : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Threads
            </NavLink>

            <NavLink
              to={"/profile/replies/1"}
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive ? "border-b border-black dark:border-white dark:text-white" : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Replies
            </NavLink>
            <NavLink
              to={"/profile/reposts/1"}
              className={({ isActive }) =>
                `flex-1 py-3 text-center ${
                  isActive ? "border-b border-black dark:border-white dark:text-white " : "border-none dark:text-neutral-500"
                } font-semibold`
              }
            >
              Reposts
            </NavLink>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
      {/* edit profile component */}
      <EditProfile
        isOpen={OpenEditProfile}
        handleOpen={(value) => setOpenEditProfile(value)}
      />
    </div>
  );
};

export default ProfileLayout;
