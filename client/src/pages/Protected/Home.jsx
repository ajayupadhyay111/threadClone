import Loading from "@/components/common/Loading";
import Input from "@/components/Home/Input";
import Post from "@/components/Home/Post";
import { useAllPostQuery } from "@/redux/service";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, refetch } = useAllPostQuery(page);
  const { allPosts } = useSelector((state) => state.service);

  const handleScroll = async (event) => {
    const { scrollHeight, clientHeight, scrollTop } = event.target;
    const remainingScrollHeight = scrollHeight - (clientHeight + scrollTop);

    if (remainingScrollHeight < 100 && !loading && data?.hasMore) {
      setLoading(true);
      try {
        setPage(prev => prev + 1);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setHasMore(data.hasMore);
    }
  }, [data]);

  return (
    <div className="w-full sm:w-xl mx-auto flex justify-center h-screen items-center flex-col">
      <div className="hidden sm:flex w-full mx-auto justify-center items-center py-5">
        <span className="font-bold">For you</span>
      </div>
      <div 
        onScroll={handleScroll} 
        className="scrollbar-hidden w-full sm:h-full h-[85vh] mb-10 sm:mb-0 sm:rounded-t-2xl overflow-y-scroll bg-white dark:bg-[#181818] sm:border sm:border-gray-400 dark:border-gray-400/30"
      >
        <Input />   
        {allPosts ? (
          allPosts.length > 0 ? (
            <>
              {allPosts.map((e) => (
                <Post key={e._id} e={e} refetch={refetch} />
              ))}
              {loading && (
                <div className="w-full py-4">
                  <Loading />
                </div>
              )}  
              {!hasMore && (
                <div className="w-full py-4 text-center text-gray-500">
                  No more posts to load
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-gray-300/60">No Post yet</span>
            </div>
          )
        ) : isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;