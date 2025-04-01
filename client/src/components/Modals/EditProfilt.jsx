// EditProfile.js
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Lock, Plus } from "lucide-react";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const EditProfile = ({ isOpen, handleOpen }) => {
  const [openMiniInputDrawer, setOpenMiniInputDrawer] = useState({
    inputField: "",
  });
  const [profileData, setProfileData] = useState({
    id: 1,
    bio: "",
    link: "",
    image:""
  });
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, image: file });
    }
  };

  const handleSubmit = () => {
    setOpenMiniInputDrawer({inputField:""})
    setProfileData({
      ...profileData,
      bio: bio,
      link: link,
    });
  };

  const ImgRef = useRef();
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[525px]">
        {openMiniInputDrawer.inputField === "" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* readonly */}
            <div className="flex justify-between gap-3 items-center">
              <div className="border-b w-full pb-3">
                <label className="text-sm font-semibold">Name</label>
                <span className="flex text-sm items-center gap-1">
                  <Lock size={14} /> {"ajay upadhyay"}({"@ajjugamer171"})
                </span>
              </div>
              <input type="file" className="hidden" ref={ImgRef} onChange={handleImageChange} />
              <div
                className="relative flex items-center justify-center size-11 bg-gray-100 rounded-full "
                onClick={() => ImgRef.current.click()}
              >
                <FaUser size={16} />
                <Plus
                  className="absolute bottom-2 left-2 bg-black text-white rounded-full border border-white"
                  size={12}
                />
              </div>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-semibold">Bio</label>
              <div
                onClick={() => setOpenMiniInputDrawer({ inputField: "bio" })}
                className="text-gray-400 text-sm flex items-center gap-1"
              >
                  {profileData.bio !== "" ? (
                  <span className="text-gray-800">{profileData.bio}</span>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Write bio</span>
                  </>
                )}
              </div>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-semibold">Link</label>
              <div
                onClick={() => setOpenMiniInputDrawer({ inputField: "link" })}
                className="text-gray-400 text-sm flex items-center gap-1"
              >
                {profileData.link !== "" ? (
                  <span className="text-blue-600">{profileData.link}</span>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Add link</span>
                  </>
                )}
              </div>
            </div>

            <button
            
              type="submit"
              className={`w-full px-4 py-3 text-md font-medium rounded-lg  bg-black text-white cursor-pointer hover:bg-gray-800`}
            >
              Done
            </button>
          </form>
        ) : (
          <div className="flex flex-col transition-all">
            {openMiniInputDrawer.inputField === "bio" ? (
              <div className="relative">
                <h1 className="font-bold text-center">Edit bio</h1>
                <div className="my-3 w-full">
                  <FaArrowLeft
                    className="absolute -top-2 -left-2"
                    onClick={() => setOpenMiniInputDrawer({ inputField: "" })}
                  />
                  <textarea
                    placeholder="Write bio..."
                    rows={3}
                    value={bio}
                    className="w-full outline-none border-none resize-none"
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="relative">
                <h1 className="font-bold text-center">Add link</h1>
                <FaArrowLeft
                  className="absolute -top-2 -left-2"
                  onClick={() => setOpenMiniInputDrawer({ inputField: "" })}
                />
                <div className="my-3 w-full">
                  <textarea
                    placeholder="Add link"
                    rows={3}
                    value={link}
                    className="w-full outline-none border-none resize-none"
                    onChange={(e) => setLink(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
            <Button onClick={handleSubmit}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
