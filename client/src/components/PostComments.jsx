import { formatPostTime } from "@/lib/formatPostTime";
import { useDeleteCommentMutation } from "@/redux/service";
import React, { useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PostComments = ({ post, postId, refetch }) => {
  const { myInfo } = useSelector((state) => state.service);
  const [showDeleteBtn, setShowDeleteBtn] = React.useState(false);
  const navigate = useNavigate();
  const [deleteComment, responseData] = useDeleteCommentMutation();
  const handleDeleteComment = async () => {
    await deleteComment({ postId: postId, id: post._id });
    refetch();
    setShowDeleteBtn(false);
  };
  useEffect(() => {
    if (responseData.isSuccess) {
      setShowDeleteBtn(false);
    }
  }, [responseData.isSuccess]);
  if (showDeleteBtn) {
    setTimeout(() => {
      setShowDeleteBtn(false);
    }, 5000);
  }

  return (
    <div className="bg-transparent border-b border-gray-500/40 p-4  shadow-md">
      <div className="flex justify-between items-center">
        <div
          onClick={() => navigate(`/profile/threads/${post?.admin._id}`)}
          className="flex items-start"
        >
          <div className="relative w-11 h-10 rounded-full">
            <div className="size-10 cursor-pointer ">
              {" "}
              <img
                src={post?.admin?.profilePic}
                alt="img"
                className="w-full h-full rounded-full"
              />
            </div>
            <CiCirclePlus
              size={20}
              className="absolute -bottom-1 right-0 bg-white rounded-full dark:text-black dark:border-black"
            />
          </div>
          <div className="ml-3">
            <span className="text-white font-semibold hover:underline cursor-pointer">
              {post.admin.username}
            </span>
            <span className="text-gray-400 text-xs ml-2">
              {formatPostTime(post?.createdAt)}
            </span>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative flex gap-2 items-center `}
        >
          {post.admin._id === myInfo.user._id ? (
            <HiDotsHorizontal
              onClick={() => setShowDeleteBtn((prev) => !prev)}
            />
          ) : (
            <div className="w-4"></div>
          )}
          {showDeleteBtn && (
            <div
              onClick={handleDeleteComment}
              className="absolute -right-3 text-red-500 cursor-pointer top-5 w-36 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-sm shadow-lg flex flex-col justify-center items-center gap-2 p-2"
            >
              Delete
            </div>
          )}
        </div>
      </div>
      <p className="text-white mt-2">{post.text}</p>
    </div>
  );
};

export default PostComments;
