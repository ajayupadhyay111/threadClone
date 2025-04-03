import React from "react";
import UserImg from "../../assets/userImg.jpg";
import Img from "../../assets/img.jpg";
import { FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";

const Post = ({e}) => {
  console.log(e)
  return (
    <div className="w-full flex items-start py-2 px-5 gap-2 border-b border-gray-300">
      <div className="relative w-11 h-10 rounded-full">
        <img src={e.admin?.profilePic} alt="" className="w-full h-full rounded-full" />
        <CiCirclePlus size={20} className="absolute -bottom-1 right-0 bg-white rounded-full dark:text-black dark:border-black" />
      </div>

      <div className="w-full relative flex flex-col">
        <div className="flex gap-2">
          <span className="font-bold">{e.admin?.username}</span>
          <span className="text-gray-500">{new Date(e.createdAt)?.getUTCHours()}h</span>
        </div>
        <div className="flex flex-col gap-2">
          <Link to={`/post/2`}>
          <span>{e.text}</span>
          </Link> 
          <img src={e.media} alt="" loading="lazy" className="aspect-auto border rounded-md" />
        </div>
        <div className="w-full flex py-4">
          <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 dark:text-white hover:bg-gray-100 items-center text-gray-500/80">
            <FaRegHeart size={20} className="text-gray-500/80 dark:text-white/80" />
            <span>{e?.likes?.length}</span>
          </span>
          <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80">
            <FaRegComment size={20} className="text-gray-500/80 dark:text-white/80" />
            <span>{e?.comments?.length}</span>
          </span>
          <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80">
            <FaRetweet size={20} className="text-gray-500/80 dark:text-white/80" />
            <span>10</span>
          </span>
          <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80">
            <IoMdSend size={20} className="text-gray-500/80 dark:text-white/80" />
            <span>10</span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <HiDotsHorizontal />
      </div>
    </div>
  );
};

export default Post;
