import React from "react";

const Activity = () => {
  return (
    <div className=" w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col ">
      <div className=" hidden sm:flex w-full mx-auto justify-center items-center py-5 ">
        <span className="font-bold">Activity</span>
      </div>
      <div className="scrollbar-hidden w-full sm:h-full h-[89vh] mb-10 sm:mb-0 sm:rounded-t-2xl overflow-y-scroll bg-white dark:bg-[#181818] sm:border sm:border-gray-400 dark:border-gray-400/30 ">
        <div className="w-full h-full flex justify-center items-center">
          <span className="text-gray-300/60">No activity yet</span>
        </div>
      </div>
    </div>
  );
};

export default Activity;
