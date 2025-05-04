import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lock, Plus } from "lucide-react";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useUpdateProfileMutation } from "@/redux/service";
import toast from "react-hot-toast";

const EditProfile = ({ isOpen, handleOpen, userData, refetch }) => {
  const [updateProfile, updateProfileData] = useUpdateProfileMutation();
  const [formData, setFormData] = useState({
    bio: userData?.user?.bio || "",
    link: userData?.user?.link || "",
    image: null,
  });

  // Reset form data when modal opens/closes or user data changes
  useEffect(() => {
    setFormData({
      bio: userData?.user?.bio || "",
      link: userData?.user?.link || "",
      image: null,
    });
  }, [userData, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("link", formData.link);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      console.log(formDataToSend);
      await updateProfile(formDataToSend);
      await refetch();
      handleOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const ImgRef = useRef();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Section */}
          <div className="flex justify-between items-center gap-3">
            <div className="border-b w-full pb-3">
              <label className="text-sm font-semibold">Name</label>
              <span className="flex text-sm items-center gap-1">
                <Lock size={14} /> {userData?.user?.username}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              ref={ImgRef}
              onChange={handleImageChange}
              accept="image/*"
            />
            <div
              className="relative flex items-center justify-center size-11 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
              onClick={() => ImgRef.current.click()}
            >
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <FaUser size={16} />
                  <Plus
                    className="absolute bottom-2 left-2 bg-black text-white rounded-full border border-white"
                    size={12}
                  />
                </>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Bio</label>
            <textarea
              placeholder="Write your bio..."
              value={formData.bio}
              onChange={(e) => handleInputChange(e, "bio")}
              className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.bio.length}/150
            </p>
          </div>

          {/* Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Link</label>
            <input
              type="url"
              placeholder="Add your link..."
              value={formData.link}
              onChange={(e) => handleInputChange(e, "link")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updateProfileData.isLoading}
            className="w-full px-4 py-3 text-md font-medium rounded-lg bg-black dark:bg-white dark:text-black text-white cursor-pointer hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfileData.isLoading ? "Updating..." : "Done"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
