import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UserImg from "../../assets/userImg.jpg";
import { useAddPostMutation } from "@/redux/service";

const AddPost = ({ isOpen, handleOpen }) => {
  const textareaRef = useRef(null);
  const [addPost, addPostResponseData] = useAddPostMutation();
  const [postData, setPostData] = useState({
    content: "",
    image: null,
  });

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [postData.content]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData({ ...postData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
    const formData = new FormData();
    console.log(postData)
    formData.append("text", postData.content);
    formData.append("image", postData.image);

    await addPost(formData);
    setPostData({ content: "", image: null });
    handleOpen(false);
    } catch (error) {
      console.log("error ",error)
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create new thread
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img
                src={UserImg}
                alt=""
                className="w-10 h-10 rounded-full bg-gray-200"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex-grow">
                <p className="font-semibold text-sm">ajjugamer171</p>
                <textarea
                  ref={textareaRef}
                  value={postData.content}
                  onChange={(e) =>
                    setPostData({ ...postData, content: e.target.value })
                  }
                  placeholder="What's new?"
                  className="scrollbar-hidden w-full py-1 border-none text-sm outline-none resize-none min-h-[40px] max-h-[300px] overflow-y-auto"
                  rows="1"
                />
              </div>

              {/* iamge selector */}
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </label>
                {postData.image && (
                  <span className="text-sm text-gray-500">
                    Image selected: {postData.image.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => handleOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:bg-white/90 dark:hover:bg-white hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={postData.content?.length > 0 ? false : true}
              className={`px-4 py-2 text-sm font-medium rounded-lg  ${
                postData.content?.length > 0
                  ? "bg-black dark:bg-[#181818] border text-white cursor-pointer hover:bg-gray-800"
                  : "bg-black/50 dark:bg-[#181818] text-white/50 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPost;
