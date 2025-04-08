import ProfileBar from "@/components/Search/ProfileBar";
import { useSearchUsersMutation } from "@/redux/service";
import { addToSearchedUser } from "@/redux/slice";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchUser, searchUserData] = useSearchUsersMutation();
  const { searchedUser } = useSelector((state) => state.service);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    (async () => {
      await searchUser({ query: inputValue });
    })();
  }, [inputValue]);
  useEffect(() => {
    if (searchUserData.isSuccess) {
      setUsers(searchUserData.data.data.users);
      dispatch(addToSearchedUser(searchUserData.data.data.users));
    }
    if (searchUserData.isError) {
      setUsers([]);
      console.log(searchUserData.error.data.message);
    }
  }, [searchUserData.isSuccess, searchUserData.isError]);

  return (
    <div className=" w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col ">
      <div className=" hidden sm:flex w-full mx-auto justify-center items-center py-5 ">
        <span className="font-bold">Search</span>
      </div>
      <div className="scrollbar-hidden w-full sm:h-full h-[89vh] mb-10 sm:mb-0 sm:rounded-t-2xl overflow-y-scroll bg-white dark:bg-[#181818] sm:border sm:border-gray-400 dark:border-gray-400/30 ">
        <div className="p-3 mx-4 mt-4 flex items-center gap-2 bg-gray-100/50 dark:bg-black/80 dark:border-neutral-600 border rounded-2xl border-gray-300">
          <LuSearch className="text-gray-300" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            className="outline-none border-none w-full"
          />
        </div>{" "}
        {users ? (
          users.length > 0 ? (
            users.map((user) => <ProfileBar user={user} />)
          ) : (
            searchedUser.map((user) => <ProfileBar user={user} />)
          )
        ) : (
          <div className="flex justify-center items-center h-[80%] text-gray-500/90">
            No Users
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
