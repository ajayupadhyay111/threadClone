import React, { useState } from "react";
import UserImg from "../../assets/userImg.jpg";

import AddPost from "../Modals/AddPost";
const Input = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className=" hidden w-full sm:flex justify-between items-center py-3 px-5 border-b border-gray-300/30">
        <img src={UserImg} alt="" className="size-10 rounded-full " />
        <input
          type="text"
          placeholder="What's new?"
          readOnly
          className="w-full px-2 outline-none border-none"
          onClick={() => setIsOpen(true)}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 font-bold text-black/80 dark:text-white rounded-lg w-fit border border-gray-300 active:scale-95 transition-all"
        >
          Post
        </button>
      </div>
      <AddPost isOpen={isOpen} handleOpen={(value) => setIsOpen(value)} />
    </>
  );
};

export default Input;
