import React, { useState, useEffect } from 'react';

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber) => {
    if (loading) return; // Avoid duplicate requests

    setLoading(true);
    const response = await fetch(`/api/posts?page=${pageNumber}&limit=10`);
    const data = await response.json();

    // Check if there are more posts to load
    if (data.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...data]);
    } else {
      setHasMore(false); // No more posts to load
    }
    setLoading(false);
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div
      style={{ height: '80vh', overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div>
        {posts.map((post, index) => (
          <div key={index} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default InfiniteScroll;
