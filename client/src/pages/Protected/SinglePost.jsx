import React, { useEffect, useState } from "react";
import UserImg from "../../assets/userImg.jpg";
import Img from "../../assets/img.jpg";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa6";
import { IoIosHeart, IoMdSend } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { useLikePostMutation, useSinglePostQuery } from "@/redux/service";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { formatPostTime } from "@/lib/formatPostTime";
import Post from "@/components/Home/Post";
import PostComments from "@/components/PostComments";
import { useSelector } from "react-redux";
import Comment from "@/components/Home/Comment";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
const SinglePost = () => {
  const [likePost, likePostData] = useLikePostMutation();
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/").pop();
  const { data, isLoading, refetch } = useSinglePostQuery(postId);
  const { myInfo } = useSelector((state) => state.service);

  const handleLikePost = async (id) => {
    try {
      await likePost(id).unwrap();
      // Refetch the post data after like
      refetch();
    } catch (error) {
      console.error("Like error:", error);
    }
  };
  const checkIsPostLiked =
    data?.data?.likes.findIndex((like) => like._id === myInfo.user._id) !== -1
      ? true
      : false;

  return (
    <div className=" w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col ">
      <div className=" hidden sm:flex w-full mx-auto justify-between px-3 items-center py-5 ">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="text-black bg-white rounded-full"
        />
        <span className="font-bold">Thread</span>
        <div></div>
      </div>
      <div className="scrollbar-hidden w-full sm:h-full h-[85vh] mb-10 sm:mb-0 sm:rounded-t-2xl overflow-y-scroll bg-white dark:bg-transparent sm:border sm:border-gray-400 dark:border-gray-400/30 ">
        <div className=" border-b border-gray-300/50  w-full pt-3 px-5">
          <div className="w-full flex items-start gap-2">
            <div
              onClick={() =>
                navigate(`/profile/threads/${data?.data?.admin._id}`)
              }
              className="relative w-11 h-10 rounded-full"
            >
              <img
                src={data?.data?.admin?.profilePic || UserImg}
                alt=""
                className="w-full h-full rounded-full"
              />
              <CiCirclePlus className="absolute bottom-0 right-0 text-lg text-black bg-white border border-black rounded-full" />
            </div>

            <div className="flex gap-2 ">
              <span className="font-bold">{data?.data?.admin?.username}</span>
              <span className="text-gray-500">
                {formatPostTime(data?.data?.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span>{data?.data?.text}</span>
            {data?.data?.media && (
              <img
                src={data?.data?.media}
                alt=""
                loading="lazy"
                className="h-76 w-56"
              />
            )}
          </div>
          <div className="w-full flex py-4">
            <span
              onClick={() => handleLikePost(data?.data?._id)}
              className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 dark:text-white hover:bg-gray-100 items-center text-gray-500/80"
            >
              {checkIsPostLiked ? (
                <IoIosHeart size={20} className="text-red-500/80" />
              ) : (
                <FaRegHeart
                  size={20}
                  className="text-gray-500/80 dark:text-white/80 "
                />
              )}
              <span>{data?.data?.likes?.length}</span>
            </span>
            <span
              onClick={() => setOpenCommentBox(true)}
              className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80"
            >
              <FaRegComment
                size={20}
                className="text-gray-500/80 dark:text-white/80"
              />
              <span>{data?.data?.comments?.length}</span>
            </span>
            <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80">
              <FaRetweet
                size={20}
                className="text-gray-500/80 dark:text-white/80"
              />
              <span>10</span>
            </span>
            <span className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80">
              <IoMdSend
                size={20}
                className="text-gray-500/80 dark:text-white/80"
              />
              <span>10</span>
            </span>
          </div>
        </div>
        <div>
          {data?.data?.comments.length > 0
            ? data?.data?.comments.map((e) => (
                <PostComments
                  key={e._id}
                  e={e}
                  post={e}
                  postId={postId}
                  refetch={refetch}
                />
              ))
            : null}
        </div>
      </div>

      {openCommentBox && (
        <Comment
          isOpen={openCommentBox}
          onClose={() => setOpenCommentBox(false)}
          postDetails={data?.data}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default SinglePost;
