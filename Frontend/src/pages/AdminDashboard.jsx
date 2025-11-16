// File: src/pages/BitsaAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import heroPicture from "../assets/hero_bitsa.jpg";// replace with your image path

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

  // Fetch blogs on load
  useEffect(() => { fetchBlogs(); }, []);
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data.blogs || data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Blog Actions ---
  const createBlog = async (e) => {
    e.preventDefault();
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

      const res = await fetch("http://localhost:5500/api/blogs", { method: "POST", body: formData });
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

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
    setToast({ type: "success", message: "Blog deleted" });
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

        {/* Content */}
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
                          <button onClick={() => deleteBlog(b.id)} className="px-2 py-1 text-red-600 rounded hover:bg-red-50">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {tab === "events" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Event */}
              <form className="col-span-1 p-4 border border-blue-600 rounded-lg shadow-sm">
                <h2 className="font-semibold mb-3">➕ Create New Event</h2>
                <label>Title</label>
                <input className="w-full p-2 border rounded border-blue-400 mb-2" />
                <label>Date</label>
                <input type="datetime-local" className="w-full p-2 border rounded border-blue-400 mb-2" />
                <label>Description</label>
                <textarea className="w-full p-2 border border-blue-400 rounded mb-2" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2">
                  ➕ Add Event
                </button>
              </form>

              {/* List of events */}
              <div className="col-span-2">
                <h3 className="font-semibold mb-3">All Events ({events.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-blue-400 border">
                    <thead className="text-sm text-gray-500 bg-gray-100">
                      <tr>
                        <th className="px-2 py-1">Title</th>
                        <th className="px-2 py-1">Date</th>
                        <th className="px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev._id || ev.id} className="hover:bg-blue-50">
                          <td className="px-2 py-1">{ev.title}</td>
                          <td className="px-2 py-1">{ev.date}</td>
                          <td className="px-2 py-1">
                            <button className="px-2 py-1 rounded bg-red-50 text-red-600">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form className="col-span-1 p-4 border border-blue-600 rounded-lg shadow-sm">
                <h2 className="font-semibold mb-3">➕ Add Gallery Image</h2>
                <label>Image URL *</label>
                <input className="w-full p-2 border border-blue-400 rounded mb-2" />
                <label>Title</label>
                <input className="w-full p-2 border border-blue-400 rounded mb-2" />
                <label>Description</label>
                <textarea className="w-full p-2 border border-blue-400 rounded mb-2" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2">
                  ➕ Add Image
                </button>
              </form>

              <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-lg p-2 shadow hover:shadow-lg relative">
                    <div className="h-36 w-full bg-gray-100 rounded overflow-hidden mb-2">
                      <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-medium">{g.title}</div>
                    <div className="text-xs text-gray-400">{g.description}</div>
                    <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div>
              <h3 className="font-semibold mb-3">All Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border">
                  <thead className="text-sm text-gray-500 bg-gray-100">
                    <tr>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Email</th>
                      <th className="px-2 py-1">Role</th>
                      <th className="px-2 py-1">Joined</th>
                      <th className="px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50">
                        <td className="px-2 py-1">{u.name}</td>
                        <td className="px-2 py-1">{u.email}</td>
                        <td className="px-2 py-1">{u.isAdmin ? "Admin" : "User"}</td>
                        <td className="px-2 py-1">{u.joined}</td>
                        <td className="px-2 py-1">
                          <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-800">🛡️ Toggle Admin</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
