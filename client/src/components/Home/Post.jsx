import React, { useEffect, useState } from "react";
import { FaCheck, FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa6";
import { IoMdSend, IoIosHeart } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useRepostMutation,
} from "@/redux/service";
import { formatPostTime } from "@/lib/formatPostTime";
import Comment from "./Comment";
import UserImg from "../../assets/userImg.jpg";
import { addPostId } from "@/redux/slice";
import toast from "react-hot-toast";

const Post = ({ e, refetch }) => {
  const [likePost, likePostData] = useLikePostMutation();
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [postIsReposted, setPostIsReposted] = useState(null);
  const { myInfo } = useSelector((state) => state.service);
  const dispatch = useDispatch();
  const [deletePost, deletePostResponseData] = useDeletePostMutation();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(addPostId(e._id));
    setPostIsReposted(e?.admin?.reposts?.includes(e?._id) ? true : false);
    if(deletePostResponseData.isSuccess){
      console.log(deletePostResponseData.data)
    }
  }, []);

  if (showDeleteBtn) {
    setTimeout(() => {
      setShowDeleteBtn(false);
    }, 5000);
  }

  const handleLikePost = async (id) => {
    await likePost(id);
    if (refetch) {
      refetch(); // Call refetch if provided
    }
  };

  const checkIsPostLiked = () => {
    return e?.likes.findIndex((like) => like._id === myInfo?.user?._id) !== -1
      ? true
      : false;
  };

  const handleDeletePost = async () => {
    await deletePost(e?._id).unwrap();
    setShowDeleteBtn(false);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/threads/${userId}`);
  };

  const [repost,repostData] = useRepostMutation();
  const handleRepost = async (id) => {
    await repost(id);
    await refetch();
  };

  useEffect(()=>{
    if(repostData.isSuccess){
      toast.success(repostData.data.message)
    }
    if(repostData.isError){
      toast.error(repostData.error.data.message)
    }
  },[repostData.isSuccess,repostData.isError])

  return (
    <div className="w-full flex items-start py-2 px-5 gap-2 border-b border-gray-300">
      <div className="relative w-11 h-10 rounded-full">
        <div
          onClick={() => handleProfileClick(e?.admin._id)}
          className="size-10 cursor-pointer "
        >
          {" "}
          <img
            src={e?.admin?.profilePic || UserImg}
            alt="img"
            className="w-full h-full rounded-full"
          />
        </div>
        <CiCirclePlus
          size={20}
          className="absolute -bottom-1 right-0 bg-white rounded-full dark:text-black dark:border-black"
        />
      </div>

      <div className="w-full relative flex flex-col">
        <div className="flex gap-2">
          <span className="font-bold">{e.admin?.username}</span>
          <span className="text-gray-500">{formatPostTime(e?.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Link to={`/post/${e?._id}`}>
            <span>{e.text}</span>
          </Link>
          <img
            src={e.media}
            alt=""
            loading="lazy"
            className="aspect-auto border rounded-md"
          />
        </div>
        <div className="w-full flex py-4">
          <span
            onClick={() => handleLikePost(e._id)}
            className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 dark:text-white hover:bg-gray-100 items-center text-gray-500/80"
          >
            {checkIsPostLiked() ? (
              <IoIosHeart size={20} className="text-red-500/80" />
            ) : (
              <FaRegHeart
                size={20}
                className="text-gray-500/80 dark:text-white/80 "
              />
            )}
            <span>{e?.likes?.length}</span>
          </span>
          <span
            onClick={() => setOpenCommentBox(true)}
            className="flex gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80"
          >
            <FaRegComment
              size={20}
              className="text-gray-500/80 dark:text-white/80"
            />
            <span>{e?.comments?.length}</span>
          </span>
          <span
            onClick={() => handleRepost(e?._id)}
            className="flex relative gap-1 p-2 rounded-3xl dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:text-white items-center text-gray-500/80"
          >
            <FaRetweet
              size={20}
              className="text-gray-500/80 dark:text-white/80"
            />
            {
              myInfo?.user?.reposts.includes(e?._id)?
            <FaCheck size={8} className="absolute top-[39%] left-[28%]"/>:null
            }
            <span>{e?.repostCount}</span>
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
      <div className={`relative flex gap-2 items-center `}>
        {e?.admin._id === myInfo?.user?._id ? (
          <HiDotsHorizontal onClick={() => setShowDeleteBtn((prev) => !prev)} />
        ) : (
          <div className="w-4"></div>
        )}
        {showDeleteBtn && (
          <div
            onClick={handleDeletePost}
            className="absolute -right-4 text-red-500 cursor-pointer top-5 w-36 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-md shadow-lg flex flex-col justify-center items-center gap-2 p-2"
          >
            Delete
          </div>
        )}
      </div>

      {openCommentBox && (
        <Comment
          isOpen={openCommentBox}
          onClose={() => setOpenCommentBox(false)}
          postDetails={e}
        />
      )}
    </div>
  );
};

export default Post;
