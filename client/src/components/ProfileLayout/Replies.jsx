import { formatPostTime } from "@/lib/formatPostTime";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Replies = () => {
  const { userDetails } = useSelector((state) => state.service);
  const { user } = userDetails;
  return (
    <div className="mb-14">
      {user?.replies.length > 0 ? (
        user.replies.map((reply) => (
          <>
            <div
              key={reply.post._id}
              className="flex gap-1.5 relative pb-4 pt-5"
            >
              <div className="w-[1px] bg-white/50 rounded-md left-5 absolute top-16 h-[calc(100%-70px)] "></div>
              <div className="relative w-10 h-10 rounded-full ">
                <img
                  src={reply.post.admin.profilePic}
                  alt=""
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2">
                  <span className="font-bold">{reply.post.admin.username}</span>
                  <span className="text-gray-500">
                    {formatPostTime(reply.post.createdAt)}
                  </span>
                </div>
                <Link to={`/post/${reply?.post?._id}`}>
                  <span>{reply?.post?.text}</span>
                </Link>
                <img
                  src={reply.post.media}
                  alt=""
                  className=" w-84 rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-1.5 w-full border-b pb-5 ">
              <div className="relative w-10 h-10  rounded-full ">
                <img
                  src={user?.profilePic}
                  alt=""
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2">
                  <span className="font-bold">{user.username}</span>
                  <span className="text-gray-500">
                    {formatPostTime(reply.createdAt)}
                  </span>
                </div>
                <span>{reply.text}</span>
              </div>
            </div>
          </>
        ))
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-center items-center h-full text-sm mt-10  text-gray-500">
            No Replies Found
          </div>
        </div>
      )}
    </div>
  );
};

export default Replies;
