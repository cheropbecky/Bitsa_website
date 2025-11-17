// File: src/pages/BitsaAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import heroPicture from "../assets/hero_bitsa.jpg"; // replace with your image path

function BitsaAdminDashboard() {
  const [tab, setTab] = useState("blogs");

  // Data from backend
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);

  // Forms
  const [newBlog, setNewBlog] = useState({ title: "", author: "", category: "", image: null, content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", datetime: "", location: "", image: null, description: "" });
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });

  // Toast notifications
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // --- Fetch Blogs on load ---
  useEffect(() => { fetchBlogs(); }, []);
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data.blogs || data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching blogs" });
    }
  };

  // --- Blog Actions ---
  const createBlog = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setToast({ type: "error", message: "Admin not logged in!" });
      return;
    }

    if (!newBlog.title || !newBlog.author || !newBlog.content) {
      setToast({ type: "error", message: "Fill all required fields!" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("author", newBlog.author);
      formData.append("category", newBlog.category);
      formData.append("content", newBlog.content);
      if (newBlog.image) formData.append("image", newBlog.image);

      console.log("Admin TOKEN:", token);

      const res = await fetch("http://localhost:5500/api/blogs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create blog");
      const savedBlog = await res.json();
      setBlogs([savedBlog, ...blogs]);
      setNewBlog({ title: "", author: "", category: "", image: null, content: "" });
      setToast({ type: "success", message: "Blog created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error creating blog." });
    }
  };

  const deleteBlog = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setToast({ type: "error", message: "Admin not logged in!" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5500/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((b) => b._id !== id));
      setToast({ type: "success", message: "Blog deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting blog." });
    }
  };

  // --- Event Actions ---
  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.datetime || !newEvent.description) {
      setToast({ type: "error", message: "Fill all required fields!" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("datetime", newEvent.datetime);
      if (newEvent.image) formData.append("image", newEvent.image);

      const res = await fetch("http://localhost:5500/api/events", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to create event");
      const savedEvent = await res.json();
      setEvents([savedEvent, ...events]);
      setNewEvent({ title: "", datetime: "", location: "", image: null, description: "" });
      setToast({ type: "success", message: "Event created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error creating event." });
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e._id !== id));
    setToast({ type: "success", message: "Event deleted" });
  };

  // --- Gallery Actions ---
  const addImage = (e) => {
    e.preventDefault();
    if (!newImage.url) { setToast({ type: "error", message: "Image URL required!" }); return; }
    const img = { id: Date.now(), ...newImage, createdAt: new Date().toISOString() };
    setGallery([img, ...gallery]);
    setNewImage({ url: "", title: "", description: "" });
    setToast({ type: "success", message: "Image added!" });
  };

  const deleteImage = (id) => {
    setGallery(gallery.filter(g => g.id !== id));
    setToast({ type: "success", message: "Image removed!" });
  };

  // --- Users Actions ---
  const toggleAdmin = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
    setToast({ type: "success", message: "Admin status updated!" });
  };

  // Tabs
  const Tabs = () => (
    <div className="flex gap-2 mb-6">
      {["blogs", "events", "gallery", "users"].map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
            tab === t ? "bg-blue-600 text-white shadow-lg" : "bg-blue-200 text-gray-700 hover:bg-blue-300"
          }`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero section */}
        <div className="min-h-[20vh] flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Admin Dashboard
          </h1>
        </div>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs />
          <div className="bg-blue-200 rounded-2xl p-6 shadow-sm">
            {tab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Form */}
                <form onSubmit={createBlog} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                  <h2 className="font-semibold mb-3">➕ Create Blog Post</h2>
                  <input placeholder="Title*" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Author*" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input type="file" onChange={e => setNewBlog({...newBlog, image: e.target.files[0]})} />
                  {newBlog.image && <img src={URL.createObjectURL(newBlog.image)} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>}
                  <textarea placeholder="Content*" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full p-2 border border-blue-400 rounded h-24"/>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Create Blog</button>
                </form>

                {/* Blog List */}
                <div className="col-span-2 overflow-x-auto">
                  <h3 className="font-semibold mb-3">All Blog Posts ({blogs.length})</h3>
                  <table className="w-full text-left border">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2">Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(b => (
                        <tr key={b._id || b.id} className="hover:bg-gray-50">
                          <td className="p-2">{b.title}</td>
                          <td>{b.author}</td>
                          <td>{b.category}</td>
                          <td>{b.createdAt}</td>
                          <td>
                            <button onClick={() => deleteBlog(b._id || b.id)} className="px-2 py-1 text-red-600 rounded hover:bg-red-50">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EVENTS, GALLERY, USERS tabs remain unchanged */}
          </div>
        </main>

        {/* Toast */}
        {toast && (
          <div className={`fixed right-6 bottom-6 p-3 rounded-lg shadow-lg ${toast.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default BitsaAdminDashboard;
