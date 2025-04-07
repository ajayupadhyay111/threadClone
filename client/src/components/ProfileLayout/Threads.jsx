import React from "react";
import { useParams } from "react-router-dom";
import { useUserDetailsQuery } from "@/redux/service";
import Post from "../Home/Post";
import Loading from "../common/Loading";

const Threads = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useUserDetailsQuery(id);
  const threads = data?.user?.threads || [];

  if (isLoading) return <Loading />;

  return (
    <>
      {threads?.length > 0 ? (
        <div className="w-full flex flex-col gap-2 mb-5">
          {threads.map((thread) => (
            <Post 
              key={thread._id} 
              e={thread} 
              refetch={refetch}  // Pass refetch function
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center h-full text-sm mt-10 text-gray-500">
          No Thread Found
        </div>
      )}
    </>
  );
};

export default Threads;