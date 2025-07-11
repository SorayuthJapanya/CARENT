import React from "react";
import { assets, ownerMenuLinks } from "../../assets/assets/assets";
import { NavLink, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Loader } from "lucide-react";

const SideBar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState("");
  const [updateImageLoading, SetUpdateImageLoading] = useState(false);

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      SetUpdateImageLoading(true);

      const { data } = await axios.post("/api/owner/update-image", formData);
      if (data) {
        fetchUser();
        toast.success(data.message);
        setImage("");
        SetUpdateImageLoading(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        {updateImageLoading ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : user?.image ||
                    "https://images.unsplash.com/photo-1648183185045-7a5592e66e9c?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="image"
              className="size-9 md:size-14 rounded-full mx-auto"
            />
            <input
              id="image"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
              <img src={assets.edit_icon} alt="" />
            </div>
          </label>
        )}
      </div>

      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
        >
          Save <img src={assets.check_icon} width={13} alt="update-profile" />
        </button>
      )}

      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt=""
            />
            <span className="max-md:hidden">{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-lg right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
