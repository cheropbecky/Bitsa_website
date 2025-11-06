// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setBlogs(data);
  };

  const handleCreateBlog = async () => {
    await supabase.from("blogs").insert([{ title, content }]);
    setTitle("");
    setContent("");
    fetchBlogs();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleCreateBlog}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Blog
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white p-4 rounded shadow mb-2">
          <h3 className="font-bold">{blog.title}</h3>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
}
