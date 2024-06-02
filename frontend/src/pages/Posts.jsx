import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:4000/api/v1/posts?page=${page}`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
        }
      };

      try {
        const response = await axios.request(config);
        setAllPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, token]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">MelodyVerse Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allPosts.map((post, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
            <p className="text-gray-600">{post.description}</p>

          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center mt-4">
          <span className="text-blue-500">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Posts;
