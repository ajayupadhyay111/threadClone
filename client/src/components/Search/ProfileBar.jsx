import { Button } from "@/components/ui/button";
import React from "react";
import Img from "../../assets/img.jpg";

const ProfileBar = () => {
  return (
    <div className="flex items-center gap-3">
      <img src={Img} alt="" className="size-10  ml-4 rounded-full" />
      <div className="flex w-full py-5 items-center border-b border-gray-500/70">
        <div className="w-full ">
          <h3 className="font-semibold text-md">ajjugamer171</h3>
          <span className="text-gray-400 text-sm">Ajay upadhyay</span>
        </div>
        <Button className="mr-4">Follow</Button>
      </div>
    </div>
  );
};

export default ProfileBar;
