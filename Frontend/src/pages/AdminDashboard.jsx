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
  const [newBlog, setNewBlog] = useState({ title: "", author: "", category: "", image: null, imageUrl: "", content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", datetime: "", location: "", image: null, imageUrl: "", description: "" });
  const [newImage, setNewImage] = useState({ file: null, url: "", title: "", description: "" });

  // Toast notifications
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch functions
  useEffect(() => { fetchBlogs(); fetchEvents(); fetchUsers(); }, []);

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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await fetch("http://localhost:5500/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error fetching users" });
    }
  };

  // --- Blog Actions ---
  const createBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return setToast({ type: "error", message: "Admin not logged in!" });
    if (!newBlog.title || !newBlog.author || !newBlog.content) return setToast({ type: "error", message: "Fill all required fields!" });

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
        headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("adminToken");
    if (!token) return setToast({ type: "error", message: "Admin not logged in!" });
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
  // --- Event Actions ---
const createEvent = async (e) => {
  e.preventDefault();

  if (!newEvent.title || !newEvent.datetime || !newEvent.description) {
    return setToast({ type: "error", message: "Fill all required fields!" });
  }

  const token = localStorage.getItem("adminToken");
  if (!token) return setToast({ type: "error", message: "Admin not logged in!" });

  try {
    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("datetime", newEvent.datetime);
    formData.append("location", newEvent.location);

    // Send image file if uploaded
    if (newEvent.image) formData.append("image", newEvent.image);
    // If imageUrl is provided without file, send it as a normal field
    else if (newEvent.imageUrl) formData.append("imageUrl", newEvent.imageUrl);

    const res = await fetch("http://localhost:5500/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to create event");
    }

    const savedEvent = await res.json();
    setEvents([savedEvent, ...events]);

    setNewEvent({ title: "", datetime: "", location: "", image: null, imageUrl: "", description: "" });
    setToast({ type: "success", message: "Event created!" });
  } catch (err) {
    console.error("Error creating event:", err);
    setToast({ type: "error", message: err.message || "Error creating event." });
  }
};

  const deleteEvent = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      const res = await fetch(`http://localhost:5500/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter(e => e._id !== id));
      setToast({ type: "success", message: "Event deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting event." });
    }
  };

  // --- Gallery Actions ---
  const addImage = async (e) => {
  e.preventDefault();

  if (!newImage.file && !newImage.url) 
    return setToast({ type: "error", message: "Image file or URL required!" });

  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return setToast({ type: "error", message: "Admin not logged in!" });

    const formData = new FormData();
    formData.append("title", newImage.title);
    formData.append("description", newImage.description);
    if (newImage.file) formData.append("image", newImage.file);
    else if (newImage.url) formData.append("imageUrl", newImage.url);

    const res = await fetch("http://localhost:5500/api/gallery", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // do NOT set Content-Type manually
      },
      body: formData,
    });

    const savedData = await res.json(); // parse JSON only once

    if (!res.ok) throw new Error(savedData.message || "Failed to upload image");

    // Update gallery with the actual item returned by backend
    setGallery([savedData.item, ...gallery]);
    setNewImage({ file: null, url: "", title: "", description: "" });
    setToast({ type: "success", message: "Image uploaded successfully!" });

  } catch (err) {
    console.error("Error uploading image:", err);
    setToast({ type: "error", message: err.message || "Error uploading image." });
  }
};

  const deleteImage = (id) => {
    setGallery(gallery.filter(g => g.id !== id));
    setToast({ type: "success", message: "Image removed!" });
  };

  // --- Users Actions ---
  const toggleAdmin = async (userId) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return setToast({ type: "error", message: "Admin not logged in!" });
    setUsers(users.map(u => u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
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
        <div className="min-h-[20vh] flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Admin Dashboard
          </h1>
        </div>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs />

          <div className="bg-blue-200 rounded-2xl p-6 shadow-sm">
            {/* BLOGS TAB */}
            {tab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={createBlog} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                  <h2 className="font-semibold mb-3">➕ Create Blog Post</h2>
                  <input placeholder="Title*" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Author*" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input placeholder="Category" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input placeholder="Image URL" value={newBlog.imageUrl} onChange={e => setNewBlog({...newBlog, imageUrl: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input type="file" onChange={e => setNewBlog({...newBlog, image: e.target.files[0]})} />
                  {(newBlog.image ? URL.createObjectURL(newBlog.image) : newBlog.imageUrl) && (
                    <img src={newBlog.image ? URL.createObjectURL(newBlog.image) : newBlog.imageUrl} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
                  )}
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
                          <td>{new Date(b.createdAt).toLocaleDateString()}</td>
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

            {/* EVENTS TAB */}
            {tab === "events" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={createEvent} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                  <h2 className="font-semibold mb-3">➕ Create Event</h2>
                  <input placeholder="Title*" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input type="datetime-local" value={newEvent.datetime} onChange={e => setNewEvent({...newEvent, datetime: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Image URL" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} className="w-full p-2 border rounded border-blue-400"/>
                  <input type="file" onChange={e => setNewEvent({...newEvent, image: e.target.files[0]})} />
                  {(newEvent.image ? URL.createObjectURL(newEvent.image) : newEvent.imageUrl) && (
                    <img src={newEvent.image ? URL.createObjectURL(newEvent.image) : newEvent.imageUrl} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
                  )}
                  <textarea placeholder="Description*" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-2 border border-blue-400 rounded h-24"/>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Create Event</button>
                </form>

                <div className="col-span-2 overflow-x-auto">
                  <h3 className="font-semibold mb-3">All Events ({events.length})</h3>
                  <table className="w-full text-left border">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2">Title</th>
                        <th>Date/Time</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(e => (
                        <tr key={e._id || e.id} className="hover:bg-gray-50">
                          <td className="p-2">{e.title}</td>
                          <td>{new Date(e.datetime).toLocaleString()}</td>
                          <td>{e.location}</td>
                          <td>
                            <button onClick={() => deleteEvent(e._id || e.id)} className="px-2 py-1 text-red-600 rounded hover:bg-red-50">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
{tab === "gallery" && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Upload Form */}
    <form
      onSubmit={addImage}
      className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3"
    >
      <h2 className="font-semibold mb-3">➕ Add Gallery Image</h2>

      <input
        placeholder="Title"
        value={newImage.title}
        onChange={(e) =>
          setNewImage({ ...newImage, title: e.target.value })
        }
        className="w-full p-2 border border-blue-400 rounded"
      />
      <textarea
        placeholder="Description"
        value={newImage.description}
        onChange={(e) =>
          setNewImage({ ...newImage, description: e.target.value })
        }
        className="w-full p-2 border border-blue-400 rounded h-24"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setNewImage({ ...newImage, file: e.target.files[0] })
        }
      />

      {/* Preview */}
      {newImage.file && (
        <img
          src={URL.createObjectURL(newImage.file)}
          alt="preview"
          className="w-full h-32 object-cover rounded border-blue-400"
        />
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Upload Image
      </button>
    </form>

    {/* Gallery Grid */}
    <div className="col-span-2 grid grid-cols-2 gap-4">
      {gallery.map((g) => (
        <div key={g._id || g.id} className="p-2 border rounded-lg relative">
          <img
            src={g.imageUrl || g.url}
            alt={g.title}
            className="w-full h-32 object-cover rounded"
          />
          <h4 className="font-semibold mt-1">{g.title}</h4>
          <p className="text-sm">{g.description}</p>
          <button
            onClick={() => deleteImage(g._id || g.id)}
            className="absolute top-2 right-2 text-red-600"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  </div>
)}

            {/* USERS TAB */}
            {tab === "users" && (
              <div className="col-span-3 overflow-x-auto">
                <h3 className="font-semibold mb-3">All Users ({users.length})</h3>
                <table className="w-full text-left border">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="p-2">Name</th>
                      <th>Email</th>
                      <th>Admin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id || u.id} className="hover:bg-gray-50">
                        <td className="p-2">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.isAdmin ? "✅" : "❌"}</td>
                        <td>
                          <button onClick={() => toggleAdmin(u._id || u.id)} className="px-2 py-1 text-blue-600 rounded hover:bg-blue-50">Toggle Admin</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
