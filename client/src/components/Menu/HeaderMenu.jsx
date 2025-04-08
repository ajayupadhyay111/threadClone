import { ArrowLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemePorvider";
import { useDispatch, useSelector } from "react-redux";
import { addMyInfo, toggleDarkModeComponent, toggleheaderMenu } from "@/redux/slice";
import { useLogoutMutation } from "@/redux/service";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const HeaderMenu = ({ openHeader }) => {
  const openToggleTheme = useSelector(state=>state.service.darkModeComponent)
  const {myInfo} = useSelector(state=>state.service)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [logoutUser,logoutUserData] = useLogoutMutation();
  const handleLogout =async ()=>{
    dispatch(toggleheaderMenu(false))
    await logoutUser();
  }
  useEffect(()=>{
    if(logoutUserData.isSuccess){
      dispatch(addMyInfo(null))
    }
  },[logoutUserData.isSuccess])
  const { theme, setTheme } = useTheme();
  return (
    <>
      <div
      onClick={(e)=>e.stopPropagation()}
        className={`${
          openHeader
            ? "block opacity-100 scale-100"
            : "hidden opacity-0 scale-95"
        } absolute z-40  dark:bg-[#181818] backdrop-blur-md right-4  p-2 w-56 sm:-right-44 border-2 rounded-xl transition-all duration-300 ${openToggleTheme?"sm:-top-32 top-12 ":"sm:-top-16 top-12"}`}
      >
        {openToggleTheme ? (
          <ul className=" ">
            <li
              onClick={() => dispatch(toggleDarkModeComponent(false))}
              className="rounded-xl flex justify-between items-center hover:bg-gray-100 hover:dark:bg-neutral-800 py-4 px-3"
            >
              Appearence <ChevronRight size={16} />
            </li>
            <li onClick={()=>navigate(`/profile/threads/${myInfo?.user._id}`)} className="rounded-xl hover:bg-gray-100 hover:dark:bg-neutral-800 py-4 px-3">
              My Profile
            </li>
            <li onClick={handleLogout} className="rounded-xl hover:bg-gray-100 hover:dark:bg-neutral-800 py-4 px-3 text-red-500">
              Logout
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-3 flex-col">
            <div className="flex items-center gap-3 w-full">
              <ArrowLeft onClick={()=>dispatch(toggleDarkModeComponent(true))} size={18} />{" "}
              <span className="text-sm flex-1 text-center font-semibold">Appearence</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-[#0a0a0a] w-full rounded-md px-3 py-2">
              <div
              onClick={()=>setTheme("light")}
                className={`${
                  theme === "light" ? "dark:bg-[#181818] bg-gray-200 border border-gray-300 " : "bg-transparent"
                } hover:h-full w-1/3 py-2 rounded-md flex justify-center`}
              >
                <Sun />
              </div>
              <div 
              onClick={()=>setTheme("dark")}
              className={`${
                  theme === "dark" ? "dark:bg-[#181818] bg-gray-200 border border-gray-300 " : "bg-transparent"
                } hover:h-full w-1/3 py-2 rounded-md flex justify-center`}
              >
                <Moon />
              </div>
              <div
              onClick={()=>setTheme("auto")}
               className={`${
                  theme === "auto" ? "dark:bg-[#181818] bg-gray-200 border border-gray-300 " : "bg-transparent"
                } hover:h-full w-1/3 py-2 rounded-md flex justify-center`}
              >
                Auto
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderMenu;
