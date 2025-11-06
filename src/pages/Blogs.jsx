// src/pages/Blogs.jsx
import { useState, useEffect } from "react";
export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (!error) setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">BITSA Blog</h1>
      {blogs.length === 0 && <p>No posts yet.</p>}
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white p-6 rounded-md shadow mb-4">
          <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-700">{blog.content}</p>
          <p className="text-gray-400 text-sm mt-2">Posted on: {new Date(blog.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
