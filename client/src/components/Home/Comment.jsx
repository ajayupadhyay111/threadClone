import { formatPostTime } from "@/lib/formatPostTime";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useAddCommentMutation } from "@/redux/service";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Comment = ({ isOpen, onClose, postDetails,refetch }) => {
  const [comment, setComment] = useState("");
  const {myInfo} = useSelector(state=>state.service)

  const textareaRef = useRef(null);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [comment]);

  const [addComment, responseData] = useAddCommentMutation();

  const handleAddComment = async () => {
    if (comment) {
      await addComment({ id: postDetails?._id, text: comment });
      setComment("");
      refetch();
    }
};
useEffect(() => {
    if (responseData?.isSuccess) {
        toast.success("Comment added successfully");
        onClose();
    } else if (responseData?.isError) {
        toast.error("Something went wrong");
        onClose();
    }
  }, [responseData.isSuccess]);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  ">
          <div className="dark:bg-[#181818] bg-white w-[90%] sm:w-xl rounded-xl h-[85vh]">
            <div className="flex justify-between items-center px-4 py-4 border-b dark:border-gray-400/30">
              <div>
                <button onClick={onClose} className="text-sm cursor-pointer">
                  Cancel
                </button>
              </div>
              <span className="font-bold text-sm">Reply</span>
              <div></div>
            </div>
            <div className="flex items-start flex-col  gap-2 p-4 overflow-y-scroll scrollbar-hidden h-[68vh] w-full">
              <div className="flex gap-1.5 relative pb-4">
                <div className="w-[1px] bg-white/50 rounded-md left-5 absolute top-14 h-[calc(100%-60px)] "></div>
                <div className="relative w-10 h-10 rounded-full ">
                  <img
                    src={postDetails.admin?.profilePic}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="flex gap-2 flex-col">
                  <div className="flex gap-2">
                    <span className="font-bold">
                      {postDetails.admin?.username}
                    </span>
                    <span className="text-gray-500">
                      {formatPostTime(postDetails?.createdAt)}
                    </span>
                  </div>
                  <span>{postDetails.text}</span>
                  <img
                    src={postDetails.media}
                    alt=""
                    className=" w-84 rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 w-full">
                <div className="relative w-10 h-10  rounded-full ">
                  <img
                    src={myInfo?.user.profilePic}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="flex space-x-2 flex-col w-full">
                  <span className="text-sm">{myInfo?.user.username}</span>
                  <textarea
                    rows="1"
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full outline-none border-none "
                    placeholder={`Reply to ${postDetails?.admin?.username}`}
                  />
                </div>
              </div>
            </div>
            <div
              onClick={handleAddComment}
              className="flex items-center justify-end py-2.5 px-4 border-t dark:border-gray-400/30"
            >
              <Button variant={"outline"}>Post</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
