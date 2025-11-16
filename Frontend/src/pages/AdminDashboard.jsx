// File: frontend/src/pages/BitsaAdminDashboard.jsx

import React, { useState, useEffect } from "react";

function BitsaAdminDashboard() {
  const [tab, setTab] = useState("blogs");

  // ---------------- STATE ----------------
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);

  const [newBlog, setNewBlog] = useState({ title: "", author: "", category: "", image: null, content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", datetime: "", location: "", image: null, description: "" });
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchBlogs();
    fetchEvents();
    fetchGallery();
    fetchUsers();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/blogs");
      const data = await res.json();
      setBlogs(data.blogs || data);
    } catch (err) { console.error(err); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/events");
      const data = await res.json();
      setEvents(data.events || data);
    } catch (err) { console.error(err); }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/gallery");
      const data = await res.json();
      setGallery(data.gallery || data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/users");
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) { console.error(err); }
  };

  // ---------------- BLOG FUNCTIONS ----------------
  const createBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.author || !newBlog.content) {
      setToast({ type: "error", message: "Please fill required fields" });
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
      const savedBlog = await res.json();
      setBlogs([savedBlog, ...blogs]);
      setNewBlog({ title: "", author: "", category: "", image: null, content: "" });
      setToast({ type: "success", message: "Blog created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error creating blog" });
    }
  };

  const deleteBlog = async (id) => {
    try {
      await fetch(`http://localhost:5500/api/blogs/${id}`, { method: "DELETE" });
      setBlogs(blogs.filter((b) => b._id !== id));
      setToast({ type: "success", message: "Blog deleted!" });
    } catch (err) { console.error(err); }
  };

  // ---------------- EVENT FUNCTIONS ----------------
  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.datetime || !newEvent.description) {
      setToast({ type: "error", message: "Please fill required fields" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("datetime", newEvent.datetime);
      if (newEvent.image) formData.append("image", newEvent.image);

      const res = await fetch("http://localhost:5500/api/events", { method: "POST", body: formData });
      const savedEvent = await res.json();
      setEvents([savedEvent, ...events]);
      setNewEvent({ title: "", datetime: "", location: "", image: null, description: "" });
      setToast({ type: "success", message: "Event created!" });
    } catch (err) { console.error(err); setToast({ type: "error", message: "Error creating event" }); }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5500/api/events/${id}`, { method: "DELETE" });
      setEvents(events.filter((e) => e._id !== id));
      setToast({ type: "success", message: "Event deleted!" });
    } catch (err) { console.error(err); }
  };

  // ---------------- GALLERY FUNCTIONS ----------------
  const addImage = (e) => {
    e.preventDefault();
    if (!newImage.url) { setToast({ type: "error", message: "Image URL required" }); return; }
    const img = { id: Date.now(), ...newImage, createdAt: new Date() };
    setGallery([img, ...gallery]);
    setNewImage({ url: "", title: "", description: "" });
    setToast({ type: "success", message: "Image added!" });
  };

  const deleteImage = (id) => {
    setGallery(gallery.filter((g) => g.id !== id));
    setToast({ type: "success", message: "Image removed!" });
  };

  // ---------------- USER FUNCTIONS ----------------
  const toggleAdmin = (userId) => {
    setUsers(users.map((u) => u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
    setToast({ type: "success", message: "User admin status updated!" });
  };

  // ---------------- TABS ----------------
  const Tabs = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {["blogs", "events", "gallery", "users"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === t ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );

  // ---------------- MAIN RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage BITSA content and users</p>
        </div>

        <Tabs />

        <div className="bg-white p-6 rounded-xl shadow">
          {/* BLOGS */}
          {tab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={createBlog} className="col-span-1 p-4 border rounded-lg shadow-sm bg-gray-50">
                <h2 className="font-semibold mb-3">Create Blog</h2>
                <input type="text" placeholder="Title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" placeholder="Author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <input type="file" onChange={e => setNewBlog({...newBlog,image:e.target.files[0]})} className="w-full mb-2"/>
                {newBlog.image && <img src={URL.createObjectURL(newBlog.image)} alt="preview" className="w-full h-32 object-cover rounded mb-2"/>}
                <textarea placeholder="Content" value={newBlog.content} onChange={e => setNewBlog({...newBlog,content:e.target.value})} className="w-full mb-2 p-2 border rounded h-28"/>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Create</button>
              </form>

              <div className="col-span-2 overflow-x-auto">
                <h3 className="font-semibold mb-3">All Blogs ({blogs.length})</h3>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Title</th>
                      <th className="p-2 border">Author</th>
                      <th className="p-2 border">Category</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(b => (
                      <tr key={b._id || b.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{b.title}</td>
                        <td className="p-2 border">{b.author}</td>
                        <td className="p-2 border">{b.category}</td>
                        <td className="p-2 border">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="p-2 border">
                          <button onClick={() => deleteBlog(b._id || b.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
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
              <form onSubmit={createEvent} className="col-span-1 p-4 border rounded-lg shadow-sm bg-gray-50">
                <h2 className="font-semibold mb-3">Create Event</h2>
                <input type="text" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent,title:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <input type="datetime-local" value={newEvent.datetime} onChange={e => setNewEvent({...newEvent,datetime:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent,description:e.target.value})} className="w-full mb-2 p-2 border rounded h-28"/>
                <input type="file" accept="image/*" onChange={e => setNewEvent({...newEvent,image:e.target.files[0]})} className="w-full mb-2"/>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Create</button>
              </form>

              <div className="col-span-2 overflow-x-auto">
                <h3 className="font-semibold mb-3">All Events ({events.length})</h3>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Title</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e._id || e.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{e.title}</td>
                        <td className="p-2 border">{new Date(e.datetime).toLocaleString()}</td>
                        <td className="p-2 border">
                          <button onClick={() => deleteEvent(e._id || e.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={addImage} className="col-span-1 p-4 border rounded-lg shadow-sm bg-gray-50">
                <h2 className="font-semibold mb-3">Add Image</h2>
                <input type="text" placeholder="Image URL" value={newImage.url} onChange={e => setNewImage({...newImage,url:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" placeholder="Title" value={newImage.title} onChange={e => setNewImage({...newImage,title:e.target.value})} className="w-full mb-2 p-2 border rounded"/>
                <textarea placeholder="Description" value={newImage.description} onChange={e => setNewImage({...newImage,description:e.target.value})} className="w-full mb-2 p-2 border rounded h-28"/>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Add</button>
              </form>

              <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map(g => (
                  <div key={g._id || g.id} className="bg-white rounded-lg shadow p-2 relative hover:shadow-lg">
                    <div className="h-36 w-full bg-gray-100 rounded overflow-hidden mb-2">
                      <img src={g.url || g.imageUrl} alt={g.title} className="w-full h-full object-cover"/>
                    </div>
                    <div className="text-sm font-medium">{g.title}</div>
                    <div className="text-xs text-gray-400">{new Date(g.createdAt).toLocaleDateString()}</div>
                    <button onClick={() => deleteImage(g.id)} className="absolute top-2 right-2 bg-white/70 rounded-full p-1">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="overflow-x-auto">
              <h3 className="font-semibold mb-3">All Users ({users.length})</h3>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Course</th>
                    <th className="p-2 border">Year</th>
                    <th className="p-2 border">Joined</th>
                    <th className="p-2 border">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{u.name}</td>
                      <td className="p-2 border">{u.email}</td>
                      <td className="p-2 border">{u.student}</td>
                      <td className="p-2 border">{u.course}</td>
                      <td className="p-2 border">{u.year}</td>
                      <td className="p-2 border">{u.joined}</td>
                      <td className="p-2 border">
                        <button onClick={() => toggleAdmin(u.id)} className={`px-3 py-1 rounded ${u.isAdmin ? "bg-yellow-100 text-yellow-800" : "border border-blue-300 text-blue-700"}`}>🛡️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed right-6 bottom-6 p-4 rounded-lg shadow-lg transition-all ${toast.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default BitsaAdminDashboard;
