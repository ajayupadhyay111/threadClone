import React from "react";
import { useParams } from "react-router-dom";
import { useUserDetailsQuery } from "@/redux/service";
import Post from "../Home/Post";
import Loading from "../common/Loading";
import { FaRetweet } from "react-icons/fa6";

const Reposts = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useUserDetailsQuery(id);
  const userReposts = data?.user?.reposts || [];

  if (isLoading) {
    return (
      <div className="w-full h-40 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {userReposts.length > 0 ? (
        userReposts.map((repost) => (
          <React.Fragment key={repost?._id}>
          <span className="flex gap-1 font-semibold text-gray-500/80 items-center pl-10 pt-2"><FaRetweet/>{data?.user?.username} reposted</span>
          <Post 
            e={repost} 
            refetch={refetch}
            />
            </React.Fragment>
        ))
      ) : (
        <div className="w-full flex justify-center items-center h-40 text-sm mt-10 text-gray-500">
          No Reposts Found
        </div>
      )}
    </div>
  );
};

export default Reposts;