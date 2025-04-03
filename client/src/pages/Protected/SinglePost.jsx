import React from "react";
import UserImg from "../../assets/userImg.jpg";
import Img from "../../assets/img.jpg";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
const SinglePost = () => {
  return (
    <div className="w-xl mx-auto flex justify-center h-screen items-center flex-col">
      <div className="w-full mx-auto flex justify-center items-center py-5">
        <span className="font-bold">Thread</span>
      </div>
      <div className="scrollbar-hidden w-full h-full rounded-t-2xl overflow-y-scroll dark:bg-[#181818] bg-white border border-gray-400 dark:border-gray-400/30 ">
        <div className="border-b border-gray-300 w-full py-3 px-5">
          <div className="w-full flex items-center justify-between gap-2">
            <div className="relative w-11 h-10 rounded-full">
              <img
                src={UserImg}
                alt=""
                className="w-full h-full rounded-full"
              />
              <CiCirclePlus className="absolute bottom-0 right-0 bg-white rounded-full" />
            </div>

            <div className="flex gap-2 w-full justify-start">
              <span className="font-bold text-sm hover:underline">
                Username
              </span>
              <span className="text-gray-500 text-sm">4h</span>
            </div>
            <div className="flex gap-2 items-center">
              <HiDotsHorizontal />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>hello guys</span>
            <img src={Img} alt="" loading="lazy" className="h-76 w-56" />
          </div>
          <div className="w-full flex py-4">
            <span className="flex gap-1 p-2 rounded-3xl hover:bg-gray-100 items-center text-gray-500/80">
              <FaRegHeart size={20} className="text-gray-500/80" />
              <span>10</span>
            </span>
            <span className="flex gap-1 p-2 rounded-3xl hover:bg-gray-100 items-center text-gray-500/80">
              <FaRegComment size={20} className="text-gray-500/80" />
              <span>10</span>
            </span>
            <span className="flex gap-1 p-2 rounded-3xl hover:bg-gray-100 items-center text-gray-500/80">
              <FaRetweet size={20} className="text-gray-500/80" />
              <span>10</span>
            </span>
            <span className="flex gap-1 p-2 rounded-3xl hover:bg-gray-100 items-center text-gray-500/80">
              <IoMdSend size={20} className="text-gray-500/80" />
              <span>10</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
