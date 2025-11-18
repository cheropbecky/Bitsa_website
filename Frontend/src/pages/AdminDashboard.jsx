// File: src/pages/BitsaAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import heroPicture from "../assets/hero_bitsa.jpg";

function AdminDashboard() {
  const [tab, setTab] = useState("blogs");

  // Data
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Forms
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    category: "",
    image: null,
    imageUrl: "",
    content: "",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    datetime: "",
    location: "",
    image: null,
    imageUrl: "",
    description: "",
  });

  const [newImage, setNewImage] = useState({
    file: null,
    url: "",
    title: "",
    description: "",
  });

  // Toast
  const [toast, setToast] = useState(null);

  const [filter, setFilter] = useState("all");

  const adminToken = localStorage.getItem("adminToken");

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ------------------ Fetch Functions ------------------
  useEffect(() => {
    fetchBlogs();
    fetchEvents();
    fetchGallery();
    fetchUsers();
    fetchMessages();
  }, []);

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

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events || data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching events" });
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      setGallery(data || []);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching gallery" });
    }
  };

  const fetchUsers = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch("http://localhost:5500/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching users" });
    }
  };

  const fetchMessages = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch("http://localhost:5500/api/admin/messages", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching messages" });
    }
  };

  // ------------------ BLOGS ------------------
  const createBlog = async (e) => {
    e.preventDefault();
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    if (!newBlog.title || !newBlog.author || !newBlog.content)
      return setToast({ type: "error", message: "Fill all required fields!" });

    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("author", newBlog.author);
      formData.append("category", newBlog.category);
      formData.append("content", newBlog.content);
      if (newBlog.image) formData.append("image", newBlog.image);
      else if (newBlog.imageUrl) formData.append("imageUrl", newBlog.imageUrl);

      const res = await fetch("http://localhost:5500/api/blogs", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create blog");
      const savedBlog = await res.json();
      setBlogs([savedBlog, ...blogs]);
      setNewBlog({ title: "", author: "", category: "", image: null, imageUrl: "", content: "" });
      setToast({ type: "success", message: "Blog created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error creating blog." });
    }
  };

  const deleteBlog = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      const res = await fetch(`http://localhost:5500/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((b) => b._id !== id));
      setToast({ type: "success", message: "Blog deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting blog." });
    }
  };

  // ------------------ EVENTS ------------------
  const getEventStatus = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    if (eventDate.toDateString() === now.toDateString()) return "Ongoing";
    if (eventDate > now) return "Upcoming";
    return "Past";
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.datetime || !newEvent.description)
      return setToast({ type: "error", message: "Fill all required fields!" });
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });

    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.datetime);
      formData.append("location", newEvent.location || "");
      if (newEvent.image) formData.append("image", newEvent.image);

      const res = await fetch("http://localhost:5500/api/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create event");
      }

      const data = await res.json();
      setEvents([data.event, ...events]);
      setNewEvent({ title: "", datetime: "", location: "", image: null, description: "", imageUrl: "" });
      setToast({ type: "success", message: "Event created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Error creating event." });
    }
  };

  const deleteEvent = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      const res = await fetch(`http://localhost:5500/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((e) => e._id !== id));
      setToast({ type: "success", message: "Event deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting event." });
    }
  };

  // ------------------ GALLERY ------------------
  const addImage = async (e) => {
    e.preventDefault();
    if (!newImage.file && !newImage.url)
      return setToast({ type: "error", message: "Image file or URL required!" });
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });

    try {
      const formData = new FormData();
      formData.append("title", newImage.title);
      formData.append("description", newImage.description);
      if (newImage.file) formData.append("image", newImage.file);
      else if (newImage.url) formData.append("imageUrl", newImage.url);

      const res = await fetch("http://localhost:5500/api/gallery", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      const savedData = await res.json();
      if (!res.ok) throw new Error(savedData.message || "Failed to upload image");

      setGallery([savedData.item, ...gallery]);
      setNewImage({ file: null, url: "", title: "", description: "" });
      setToast({ type: "success", message: "Image uploaded successfully!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Error uploading image." });
    }
  };

  const deleteImage = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      const res = await fetch(`http://localhost:5500/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setGallery(gallery.filter((g) => g._id !== id));
      setToast({ type: "success", message: "Image deleted successfully!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting image." });
    }
  };

  // ------------------ USERS ------------------
  const toggleAdmin = async (userId) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    setUsers(users.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u)));
    setToast({ type: "success", message: "Admin status updated!" });
  };

  // ------------------ MESSAGES ------------------
  const deleteMessage = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      const res = await fetch(`http://localhost:5500/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete message");
      setMessages(messages.filter((m) => m._id !== id));
      setToast({ type: "success", message: "Message deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting message." });
    }
  };

  // ------------------ TABS ------------------
  const Tabs = () => (
    <div className="flex gap-2 mb-6 flex-wrap">
      {["blogs", "events", "gallery", "users", "messages"].map((t) => (
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

  // ------------------ RENDER ------------------
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10">
        <div className="min-h-[20vh] flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">Admin Dashboard</h1>
        </div>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs />

          <div className="bg-blue-200 rounded-2xl p-6 shadow-sm space-y-6">
            {/* BLOGS */}
            {tab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Form */}
                <form onSubmit={createBlog} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                  <h2 className="font-semibold mb-3">➕ Create Blog Post</h2>
                  <input placeholder="Title*" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Author*" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Image URL" value={newBlog.imageUrl} onChange={e => setNewBlog({...newBlog, imageUrl: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input type="file" onChange={e => setNewBlog({...newBlog, image: e.target.files[0]})} />
                  {(newBlog.image ? URL.createObjectURL(newBlog.image) : newBlog.imageUrl) && (
                    <img src={newBlog.image ? URL.createObjectURL(newBlog.image) : newBlog.imageUrl} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
                  )}
                  <textarea placeholder="Content*" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full p-2 border border-blue-400 rounded h-24"/>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Create Blog</button>
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
                          <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button onClick={() => deleteBlog(b._id || b.id)} className="px-2 py-1 text-red-600 rounded hover:bg-red-50 transition-colors">🗑️</button>
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
    {/* Event Form */}
    <form
      onSubmit={createEvent}
      className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3"
    >
      <h2 className="font-semibold mb-3">➕ Create Event</h2>

      <input
        placeholder="Title*"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded"
      />

      <input
        type="datetime-local"
        value={newEvent.datetime}
        onChange={(e) => setNewEvent({ ...newEvent, datetime: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded"
      />

      <input
        placeholder="Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded"
      />

      <input
        placeholder="Image URL"
        value={newEvent.imageUrl}
        onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded"
      />

      <input
        type="file"
        onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
        className="w-full"
      />

      {(newEvent.image || newEvent.imageUrl) && (
        <img
          src={newEvent.image ? URL.createObjectURL(newEvent.image) : newEvent.imageUrl}
          alt="preview"
          className="w-full h-32 object-cover rounded border border-blue-400"
        />
      )}

      <textarea
        placeholder="Description*"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded h-24"
      />

      {/* Status Dropdown */}
      <select
        value={newEvent.status || "Upcoming"}
        onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
        className="w-full p-2 border border-blue-400 rounded"
      >
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Past">Past</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </form>

    {/* Event List */}
    <div className="col-span-2 overflow-x-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">All Events ({events.length})</h3>

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-blue-400 rounded p-1"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <table className="w-full text-left border border-gray-200">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-2">Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events
            .filter((e) => {
              if (filter === "all") return true;
              const now = new Date();
              const eventDate = new Date(e.date);
              if (filter === "upcoming") return e.status === "Upcoming";
              if (filter === "ongoing") return e.status === "Ongoing";
              if (filter === "past") return e.status === "Past";
            })
            .map((e) => (
              <tr key={e._id || e.id} className="hover:bg-gray-50">
                <td className="p-2">{e.title}</td>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>{e.location}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      e.status === "Upcoming"
                        ? "bg-green-500"
                        : e.status === "Ongoing"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => deleteEvent(e._id || e.id)}
                    className="px-2 py-1 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
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
                {/* Image Form */}
                <form onSubmit={addImage} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                  <h2 className="font-semibold mb-3">➕ Add Image</h2>
                  <input placeholder="Title" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Description" value={newImage.description} onChange={e => setNewImage({...newImage, description: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Image URL" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input type="file" onChange={e => setNewImage({...newImage, file: e.target.files[0]})} />
                  {(newImage.file ? URL.createObjectURL(newImage.file) : newImage.url) && (
                    <img src={newImage.file ? URL.createObjectURL(newImage.file) : newImage.url} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
                  )}
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Upload Image</button>
                </form>

                {/* Gallery List */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map(img => (
                    <div key={img._id || img.id} className="border rounded-lg p-2 relative">
                      <img src={img.imageUrl || img.url} alt={img.title} className="w-full h-40 object-cover rounded"/>
                      <h4 className="font-semibold">{img.title}</h4>
                      <p className="text-sm">{img.description}</p>
                      <button onClick={() => deleteImage(img._id || img.id)} className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === "users" && (
              <div className="col-span-3">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-left border">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">Name</th>
                        <th className="p-2 whitespace-nowrap">Email</th>
                        <th className="p-2 whitespace-nowrap">Admin</th>
                        <th className="p-2 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id || u.id} className="hover:bg-gray-50">
                          <td className="p-2 whitespace-nowrap">{u.name}</td>
                          <td className="p-2 whitespace-nowrap">{u.email}</td>
                          <td className="p-2 whitespace-nowrap">{u.isAdmin ? "✅" : "❌"}</td>
                          <td className="p-2 whitespace-nowrap">
                            <button onClick={() => toggleAdmin(u._id || u.id)} className="px-2 py-1 text-blue-600 rounded hover:bg-blue-50 transition-colors">Toggle Admin</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden grid grid-cols-1 gap-4">
                  {users.map(u => (
                    <div key={u._id || u.id} className="border p-4 rounded-lg bg-white shadow-sm">
                      <p><strong>Name:</strong> {u.name}</p>
                      <p><strong>Email:</strong> {u.email}</p>
                      <p><strong>Admin:</strong> {u.isAdmin ? "✅" : "❌"}</p>
                      <button onClick={() => toggleAdmin(u._id || u.id)} className="mt-2 px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 transition-colors">Toggle Admin</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {tab === "messages" && (
              <div className="col-span-3">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-left border">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">Name</th>
                        <th className="p-2 whitespace-nowrap">Email</th>
                        <th className="p-2 whitespace-nowrap">Subject</th>
                        <th className="p-2 whitespace-nowrap">Message</th>
                        <th className="p-2 whitespace-nowrap">Date</th>
                        <th className="p-2 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map(m => (
                        <tr key={m._id || m.id} className="hover:bg-gray-50">
                          <td className="p-2 whitespace-nowrap">{m.name}</td>
                          <td className="p-2 whitespace-nowrap">{m.email}</td>
                          <td className="p-2 whitespace-nowrap">{m.subject}</td>
                          <td className="p-2">{m.message}</td>
                          <td className="p-2 whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</td>
                          <td className="p-2 whitespace-nowrap">
                            <button onClick={() => deleteMessage(m._id || m.id)} className="px-2 py-1 text-red-600 rounded hover:bg-red-50 transition-colors">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden grid grid-cols-1 gap-4">
                  {messages.map(m => (
                    <div key={m._id || m.id} className="border p-4 rounded-lg bg-white shadow-sm">
                      <p><strong>Name:</strong> {m.name}</p>
                      <p><strong>Email:</strong> {m.email}</p>
                      <p><strong>Subject:</strong> {m.subject}</p>
                      <p><strong>Message:</strong> {m.message}</p>
                      <p><strong>Date:</strong> {new Date(m.createdAt).toLocaleDateString()}</p>
                      <button onClick={() => deleteMessage(m._id || m.id)} className="mt-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 transition-colors">Delete</button>
                    </div>
                  ))}
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

export default AdminDashboard;
