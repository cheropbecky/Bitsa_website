// File: src/pages/BitsaAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import heroPicture from "../assets/hero_bitsa.jpg";
import api from '../api/api';
function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

  // Data
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Forms
  const initialBlogState = {
    title: "",
    author: "",
    category: "",
    image: null,
    imageUrl: "",
    content: "",
  };
  const [newBlog, setNewBlog] = useState(initialBlogState);

  const [newEvent, setNewEvent] = useState({
    title: "",
    datetime: "",
    location: "",
    image: null,
    imageUrl: "",
    description: "",
    status: "Upcoming",
  });
  
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventData, setEditingEventData] = useState({
    title: "",
    datetime: "",
    location: "",
    image: null,
    imageUrl: "",
    description: "",
    status: "Upcoming",
  });

  const [newImage, setNewImage] = useState({
    file: null,
    url: "",
    title: "",
    description: "",
  });
  
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingGalleryData, setEditingGalleryData] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: "",
  });
  
  // 🔑 NEW STATE FOR EDITING
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingBlogData, setEditingBlogData] = useState(initialBlogState);
  
  // NEW STATE: To prevent double submission/handle loading
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Toast
  const [toast, setToast] = useState(null);

  const [filter, setFilter] = useState("all");



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
    fetchMetrics();
  }, []);
  
  const fetchMetrics = async () => {
  try {
    const res = await api.get("/admin/dashboard/metrics");
    setMetrics(res.data.metrics);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching metrics" });
  }
};

  const fetchBlogs = async () => {
  try {
    const res = await api.get("/blogs");
    setBlogs(res.data.blogs || res.data);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching blogs" });
  }
};

  const fetchEvents = async () => {
    try {
     const res = await api.get("/events");
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
    const res = await api.get("/gallery");
    setGallery(res.data || []);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching gallery" });
  }
};

 const fetchUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    setUsers(res.data.users || res.data);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching users" });
  }
};
  
  const fetchRegistrations = async (eventId = null) => {
  try {
    const url = eventId 
      ? `/events/${eventId}/registrations`
      : "/admin/registrations";
    const res = await api.get(url);
    setRegistrations(eventId ? res.data.registrations : res.data.registrations || []);
    if (eventId) setSelectedEventId(eventId);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching registrations" });
  }
};
  
 const handleRegistrationStatus = async (registrationId, status, notes = "") => {
  try {
    await api.put(`/events/registrations/${registrationId}/status`, { status, notes });
    setToast({ type: "success", message: `Registration ${status.toLowerCase()} successfully` });
    if (selectedEventId) {
      fetchRegistrations(selectedEventId);
    } else {
      fetchRegistrations();
    }
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error updating registration" });
  }
};
  
 const deleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  try {
    await api.delete(`/admin/users/${userId}`);
    setUsers(users.filter(u => (u._id || u.id) !== userId));
    setToast({ type: "success", message: "User deleted successfully" });
    fetchMetrics();
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: err.response?.data?.message || "Error deleting user" });
  }
};

  const fetchMessages = async () => {
  try {
    const res = await api.get("/admin/messages");
    setMessages(res.data.messages || res.data);
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error fetching messages" });
  }
};
  // ------------------ BLOGS ACTIONS ------------------

  // Function to initialize editing
  const startEditBlog = (blog) => {
    setEditingBlogId(blog._id || blog.id);
    setEditingBlogData({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      imageUrl: blog.imageUrl || "",
      content: blog.content,
      image: null, // Clear file input when editing starts
    });
  };

  // 1. CREATE Blog
  const createBlog = async (e) => {
  e.preventDefault();

  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken)
    return setToast({ type: "error", message: "Admin not logged in!" });

  if (!newBlog.title || !newBlog.author || !newBlog.content)
    return setToast({ type: "error", message: "Fill all required fields!" });

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("author", newBlog.author);
    formData.append("category", newBlog.category);
    formData.append("content", newBlog.content);

    if (newBlog.image) {
      formData.append("image", newBlog.image);
    } else if (newBlog.imageUrl) {
      formData.append("imageUrl", newBlog.imageUrl);
    }

    // ⭐ FIX: Send token in headers
    const res = await api.post("/blogs", formData, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setBlogs([res.data, ...blogs]);
    setNewBlog(initialBlogState);
    setToast({ type: "success", message: "Blog created!" });
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error creating blog." });
  } finally {
    setIsSubmitting(false);
  }
};


  // 2. UPDATE Blog
  const updateBlog = async (e) => {
  e.preventDefault();

  const adminToken = localStorage.getItem("adminToken"); // ✅ FIX

  if (!adminToken)
    return setToast({ type: "error", message: "Admin not logged in!" });

  if (!editingBlogData.title || !editingBlogData.author || !editingBlogData.content)
    return setToast({ type: "error", message: "Fill all required fields!" });

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", editingBlogData.title);
    formData.append("author", editingBlogData.author);
    formData.append("category", editingBlogData.category);
    formData.append("content", editingBlogData.content);

    if (editingBlogData.image) {
      formData.append("image", editingBlogData.image);
    } else if (editingBlogData.imageUrl) {
      formData.append("imageUrl", editingBlogData.imageUrl);
    }

    const res = await api.put(`/blogs/${editingBlogId}`, formData, {
      headers: {
        Authorization: `Bearer ${adminToken}`, // ✅ FIX
        "Content-Type": "multipart/form-data",
      },
    });

    setBlogs(
      blogs.map((b) =>
        (b._id || b.id) === editingBlogId ? res.data : b
      )
    );

    setEditingBlogId(null);
    setEditingBlogData(initialBlogState);
    setToast({ type: "success", message: "Blog updated!" });
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Error updating blog." });
  } finally {
    setIsSubmitting(false);
  }
};

  // 3. DELETE Blog
  const deleteBlog = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
      await api.delete(`/blogs/${id}`);
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

      const res = await api.post("/events", formData);
      setEvents([res.data.event, ...events]);
      setNewEvent({ title: "", datetime: "", location: "", image: null, description: "", imageUrl: "" });
      setToast({ type: "success", message: "Event created!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Error creating event." });
    }
  };

  const startEditEvent = (event) => {
    setEditingEventId(event._id || event.id);
    setEditingEventData({
      title: event.title,
      datetime: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      location: event.location || "",
      description: event.description || "",
      status: event.status || "Upcoming",
      image: null,
      imageUrl: event.imageUrl || "",
    });
  };
  
  const updateEvent = async (e) => {
    e.preventDefault();
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    if (!editingEventData.title || !editingEventData.datetime || !editingEventData.description)
      return setToast({ type: "error", message: "Fill all required fields!" });
    
    try {
      const formData = new FormData();
      formData.append("title", editingEventData.title);
      formData.append("description", editingEventData.description);
      formData.append("date", editingEventData.datetime);
      formData.append("location", editingEventData.location || "");
      formData.append("status", editingEventData.status);
      if (editingEventData.image) formData.append("image", editingEventData.image);
      else if (editingEventData.imageUrl) formData.append("imageUrl", editingEventData.imageUrl);
      
     const res = await api.put(`/events/${editingEventId}`, formData);
     setEvents(events.map(e => (e._id || e.id) === editingEventId ? res.data.event : e));
      setEditingEventId(null);
      setEditingEventData({
        title: "", datetime: "", location: "", image: null, imageUrl: "", description: "", status: "Upcoming",
      });
      setToast({ type: "success", message: "Event updated!" });
      fetchMetrics();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error updating event." });
    }
  };

  const deleteEvent = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => (e._id || e.id) !== id));
      setToast({ type: "success", message: "Event deleted" });
      fetchMetrics();
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

      const res = await api.post("/gallery", formData);
setGallery([res.data.item, ...gallery]);
      setNewImage({ file: null, url: "", title: "", description: "" });
      setToast({ type: "success", message: "Image uploaded successfully!" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: err.message || "Error uploading image." });
    }
  };

  const startEditGallery = (item) => {
    setEditingGalleryId(item._id || item.id);
    setEditingGalleryData({
      title: item.title || "",
      description: item.description || "",
      image: null,
      imageUrl: item.imageUrl || "",
    });
  };
  
  const updateGallery = async (e) => {
    e.preventDefault();
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    
    try {
      const formData = new FormData();
      formData.append("title", editingGalleryData.title);
      formData.append("description", editingGalleryData.description || "");
      if (editingGalleryData.image) formData.append("image", editingGalleryData.image);
      else if (editingGalleryData.imageUrl) formData.append("imageUrl", editingGalleryData.imageUrl);
      
    const res = await api.put(`/gallery/${editingGalleryId}`, formData);
setGallery(gallery.map(g => (g._id || g.id) === editingGalleryId ? res.data.item : g));
      setEditingGalleryId(null);
      setEditingGalleryData({ title: "", description: "", image: null, imageUrl: "" });
      setToast({ type: "success", message: "Gallery item updated!" });
      fetchMetrics();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error updating gallery item." });
    }
  };

  const deleteImage = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setGallery(gallery.filter((g) => (g._id || g.id) !== id));
      setToast({ type: "success", message: "Image deleted successfully!" });
      fetchMetrics();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting image." });
    }
  };

  const toggleAdmin = async (userId) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    setUsers(users.map((u) => (u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u)));
    setToast({ type: "success", message: "Admin status updated!" });
  };
  const deleteMessage = async (id) => {
    if (!adminToken) return setToast({ type: "error", message: "Admin not logged in!" });
    try {
     await api.delete(`/admin/messages/${id}`);
      setMessages(messages.filter((m) => m._id !== id));
      setToast({ type: "success", message: "Message deleted" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error deleting message." });
    }
  };

  const Tabs = () => (
    <div className="flex gap-2 mb-6 flex-wrap">
      {["dashboard", "blogs", "events", "gallery", "users", "messages", "registrations"].map((t) => (
        <button
          key={t}
          onClick={() => {
            setTab(t);
            setEditingBlogId(null);
            setEditingEventId(null);
            setEditingGalleryId(null);
            setSelectedEventId(null);
            if (t === "registrations") fetchRegistrations();
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
            tab === t ? "bg-blue-600 text-white shadow-lg" : "bg-blue-200 text-gray-700 hover:bg-blue-300"
          }`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
  
  //  RENDER HELPER: Blog Form 
  const BlogForm = ({ type, data, setData, handleSubmit, handleCancel }) => {
      const isCreate = type === 'create';
      const submitText = isCreate ? 'Create Blog' : 'Save Changes';
      const formTitle = isCreate ? ' Create Blog Post' : 'Edit Blog Post';
      const currentData = data;
      const setCurrentData = setData;

      const currentImageSource = currentData.image 
        ? URL.createObjectURL(currentData.image) 
        : currentData.imageUrl;

      return (
        <form onSubmit={handleSubmit} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
          <h2 className="font-semibold mb-3">{formTitle}</h2>
          <input 
            placeholder="Title*" 
            value={currentData.title || ''} // Safety check
            onChange={e => setCurrentData({...currentData, title: e.target.value})} 
            className="w-full p-2 border border-blue-400 rounded"
          />
          <input 
            placeholder="Author*" 
            value={currentData.author || ''} // Safety check
            onChange={e => setCurrentData({...currentData, author: e.target.value})} 
            className="w-full p-2 border border-blue-400 rounded"
          />
          <input 
            placeholder="Category" 
            value={currentData.category || ''} // Safety check
            onChange={e => setCurrentData({...currentData, category: e.target.value})} 
            className="w-full p-2 border border-blue-400 rounded"
          />
          <input 
            placeholder="Image URL" 
            value={currentData.imageUrl || ''} // Safety check
            onChange={e => setCurrentData({...currentData, imageUrl: e.target.value, image: null})} 
            className="w-full p-2 border border-blue-400 rounded"
          />
          <input 
            type="file" 
            onChange={e => setCurrentData({...currentData, image: e.target.files[0], imageUrl: ""})}
            className="w-full"
          />
          {currentImageSource && (
            <img src={currentImageSource} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
          )}
          <textarea 
            placeholder="Content*" 
            value={currentData.content || ''} // Safety check
            onChange={e => setCurrentData({...currentData, content: e.target.value})} 
            className="w-full p-2 border border-blue-400 rounded h-24"
          />
          <div className="flex space-x-2">
            {!isCreate && (
                <button type="button" onClick={handleCancel} className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors" disabled={isSubmitting}>Cancel</button>
            )}
            <button 
              type="submit" 
              className={`py-2 rounded-lg transition-colors ${isCreate ? 'w-full bg-blue-600 hover:bg-blue-700' : 'w-1/2 bg-green-600 hover:bg-green-700'} text-white`}
              disabled={isSubmitting} // Use the state from AdminDashboard
            >
              {isSubmitting ? 'Processing...' : submitText}
            </button>
          </div>
        </form>
      );
  }

  //RENDER
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10">
        <div className="min-h-[20vh] flex items-center justify-center">
          <h1 className="text-7xl md:text-6xl font-bold text-white text-center">Admin Dashboard</h1>
        </div>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs />

          <div className="bg-blue-200 rounded-2xl p-6 shadow-sm space-y-6 opacity-85">
            {/* DASHBOARD METRICS */}
            {tab === "dashboard" && metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400"
                  onClick={() => setTab("users")}
                  title="Click to view all users"
                >
                  <h3 className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</h3>
                  <p className="text-gray-600">Total Users</p>
                  <p className="text-xs text-blue-500 mt-2"> Click to manage</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-green-400"
                  onClick={() => setTab("blogs")}
                  title="Click to view all blogs"
                >
                  <h3 className="text-2xl font-bold text-green-600">{metrics.totalBlogs}</h3>
                  <p className="text-gray-600">Total Blogs</p>
                  <p className="text-xs text-green-500 mt-2"> Click to manage</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-400"
                  onClick={() => setTab("gallery")}
                  title="Click to view all gallery images"
                >
                  <h3 className="text-2xl font-bold text-purple-600">{metrics.totalGallery}</h3>
                  <p className="text-gray-600">Gallery Images</p>
                  <p className="text-xs text-purple-500 mt-2"> Click to manage</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-orange-400"
                  onClick={() => setTab("events")}
                  title="Click to view all events"
                >
                  <h3 className="text-2xl font-bold text-orange-600">{metrics.totalEvents}</h3>
                  <p className="text-gray-600">Total Events</p>
                  <p className="text-xs text-orange-500 mt-2"> Click to manage</p>
                </div>
                <div 
                  className="bg-yellow-100 rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-yellow-500"
                  onClick={() => {
                    setTab("registrations");
                    fetchRegistrations();
                  }}
                  title="Click to view pending registrations"
                >
                  <h3 className="text-2xl font-bold text-yellow-800">{metrics.pendingRegistrations}</h3>
                  <p className="text-gray-600">Pending Registrations</p>
                  <p className="text-xs text-yellow-700 mt-2"> Click to review</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400"
                  onClick={() => {
                    setTab("events");
                    setFilter("upcoming");
                  }}
                  title="Click to view upcoming events"
                >
                  <h3 className="text-2xl font-bold text-blue-600">{metrics.eventsByStatus?.upcoming || 0}</h3>
                  <p className="text-gray-600">Upcoming Events</p>
                  <p className="text-xs text-blue-500 mt-2"> Click to view</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-green-400"
                  onClick={() => {
                    setTab("events");
                    setFilter("ongoing");
                  }}
                  title="Click to view ongoing events"
                >
                  <h3 className="text-2xl font-bold text-green-600">{metrics.eventsByStatus?.ongoing || 0}</h3>
                  <p className="text-gray-600">Ongoing Events</p>
                  <p className="text-xs text-green-500 mt-2"> Click to view</p>
                </div>
                <div 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-gray-400"
                  onClick={() => {
                    setTab("events");
                    setFilter("past");
                  }}
                  title="Click to view past events"
                >
                  <h3 className="text-2xl font-bold text-gray-600">{metrics.eventsByStatus?.past || 0}</h3>
                  <p className="text-gray-600">Past Events</p>
                  <p className="text-xs text-gray-500 mt-2"> Click to view</p>
                </div>
              </div>
            )}
            
            {/* BLOGS */}
            {tab === "blogs" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {editingBlogId ? (
                    <BlogForm
                        type="edit"
                        data={editingBlogData}
                        setData={setEditingBlogData}
                        handleSubmit={updateBlog}
                        handleCancel={() => setEditingBlogId(null)}
                    />
                ) : (
                    <BlogForm
                        type="create"
                        data={newBlog}
                        setData={setNewBlog}
                        handleSubmit={createBlog}
                    />
                )}
                

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
                        <tr 
                          key={b._id || b.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${editingBlogId === (b._id || b.id) ? 'bg-blue-100' : ''}`}
                          onClick={() => startEditBlog(b)}
                          title="Click to edit this blog"
                        >
                          <td className="p-2 font-semibold">{b.title}</td>
                          <td>{b.author}</td>
                          <td>{b.category}</td>
                          <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => startEditBlog(b)} 
                                className="px-3 py-1 font-bold text-blue-600 rounded hover:bg-blue-100 transition-colors mr-2 border border-blue-300"
                                disabled={editingBlogId === (b._id || b.id)}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${b.title}"?`)) {
                                  deleteBlog(b._id || b.id);
                                }
                              }} 
                              className="px-3 py-1 text-red-600 font-bold rounded hover:bg-red-100 transition-colors border border-red-300"
                            >
                            DELETE
                            </button>
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
    {editingEventId ? (
      <form
        onSubmit={updateEvent}
        className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3"
      >
        <h2 className="font-semibold mb-3">Edit Event</h2>
        <input
          placeholder="Title*"
          value={editingEventData.title}
          onChange={(e) => setEditingEventData({ ...editingEventData, title: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded"
        />
        <input
          type="datetime-local"
          value={editingEventData.datetime}
          onChange={(e) => setEditingEventData({ ...editingEventData, datetime: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded"
        />
        <input
          placeholder="Location"
          value={editingEventData.location}
          onChange={(e) => setEditingEventData({ ...editingEventData, location: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded"
        />
        <input
          placeholder="Image URL"
          value={editingEventData.imageUrl}
          onChange={(e) => setEditingEventData({ ...editingEventData, imageUrl: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded"
        />
        <input
          type="file"
          onChange={(e) => setEditingEventData({ ...editingEventData, image: e.target.files[0] })}
          className="w-full"
        />
        {(editingEventData.image || editingEventData.imageUrl) && (
          <img
            src={editingEventData.image ? URL.createObjectURL(editingEventData.image) : editingEventData.imageUrl}
            alt="preview"
            className="w-full h-32 object-cover rounded border border-blue-400"
          />
        )}
        <textarea
          placeholder="Description*"
          value={editingEventData.description}
          onChange={(e) => setEditingEventData({ ...editingEventData, description: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded h-24"
        />
        <select
          value={editingEventData.status}
          onChange={(e) => setEditingEventData({ ...editingEventData, status: e.target.value })}
          className="w-full p-2 border border-blue-400 rounded"
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Past">Past</option>
        </select>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditingEventId(null)}
            className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    ) : (
      <form
        onSubmit={createEvent}
        className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3"
      >
        <h2 className="font-semibold mb-3">Create Event</h2>
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
    )}
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
              if (filter === "upcoming") return e.status === "Upcoming";
              if (filter === "ongoing") return e.status === "Ongoing";
              if (filter === "past") return e.status === "Past";
              return true;
            })
            .map((e) => (
              <tr 
                key={e._id || e.id} 
                className={`hover:bg-gray-50 cursor-pointer ${editingEventId === (e._id || e.id) ? 'bg-blue-100' : ''}`}
                onClick={() => startEditEvent(e)}
                title="Click to edit this event"
              >
                <td className="p-2 font-semibold">{e.title}</td>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>{e.location}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
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
                <td className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => startEditEvent(e)}
                    className="px-3 py-1 text-blue-600 rounded hover:bg-blue-100 transition-colors mr-2 border border-blue-300 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setTab("registrations");
                      fetchRegistrations(e._id || e.id);
                    }}
                    className="px-3 py-1 text-green-600 rounded hover:bg-green-100 transition-colors mr-2 border border-green-300 font-bold"
                  >
                  Registrations
                  </button>
                  <button
                    onClick={() => deleteEvent(e._id || e.id)}
                    className="px-3 py-1 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-300 font-bold"
                  >
                    DELETE
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
                {editingGalleryId ? (
                  <form onSubmit={updateGallery} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                    <h2 className="font-semibold mb-3">Edit Image</h2>
                    <input 
                      placeholder="Title" 
                      value={editingGalleryData.title} 
                      onChange={e => setEditingGalleryData({...editingGalleryData, title: e.target.value})} 
                      className="w-full p-2 border border-blue-400 rounded"
                    />
                    <input 
                      placeholder="Description" 
                      value={editingGalleryData.description} 
                      onChange={e => setEditingGalleryData({...editingGalleryData, description: e.target.value})} 
                      className="w-full p-2 border border-blue-400 rounded"
                    />
                    <input 
                      placeholder="Image URL" 
                      value={editingGalleryData.imageUrl} 
                      onChange={e => setEditingGalleryData({...editingGalleryData, imageUrl: e.target.value})} 
                      className="w-full p-2 border border-blue-400 rounded"
                    />
                    <input 
                      type="file" 
                      onChange={e => setEditingGalleryData({...editingGalleryData, image: e.target.files[0]})} 
                    />
                    {(editingGalleryData.image ? URL.createObjectURL(editingGalleryData.image) : editingGalleryData.imageUrl) && (
                      <img 
                        src={editingGalleryData.image ? URL.createObjectURL(editingGalleryData.image) : editingGalleryData.imageUrl} 
                        alt="preview" 
                        className="w-full h-32 object-cover rounded border-blue-400"
                      />
                    )}
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingGalleryId(null)} 
                        className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={addImage} className="col-span-1 p-4 border border-blue-600 rounded-lg space-y-3">
                    <h2 className="font-semibold mb-3">Add Image</h2>
                  <input placeholder="Title" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Description" value={newImage.description} onChange={e => setNewImage({...newImage, description: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input placeholder="Image URL" value={newImage.url} onChange={e => setNewImage({...newImage, url: e.target.value})} className="w-full p-2 border border-blue-400 rounded"/>
                  <input type="file" onChange={e => setNewImage({...newImage, file: e.target.files[0]})} />
                  {(newImage.file ? URL.createObjectURL(newImage.file) : newImage.url) && (
                    <img src={newImage.file ? URL.createObjectURL(newImage.file) : newImage.url} alt="preview" className="w-full h-32 object-cover rounded border-blue-400"/>
                  )}
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Upload Image</button>
                  </form>
                )}

                {/* Gallery List */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map(img => (
                    <div 
                      key={img._id || img.id} 
                      className={`border rounded-lg p-2 relative hover:shadow-lg transition-all cursor-pointer ${editingGalleryId === (img._id || img.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                      onClick={() => startEditGallery(img)}
                      title="Click to edit this gallery item"
                    >
                      <img src={img.imageUrl || img.url} alt={img.title} className="w-full h-40 object-cover rounded"/>
                      <h4 className="font-semibold mt-2">{img.title}</h4>
                      <p className="text-sm text-gray-600">{img.description}</p>
                      <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => startEditGallery(img)} 
                          className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded shadow-md font-bold"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${img.title}"?`)) {
                              deleteImage(img._id || img.id);
                            }
                          }} 
                          className="bg-red-500 text-white hover:bg-red-600 p-2 rounded shadow-md font-bold"
                          title="Delete"
                        >
                        DELETE
                        </button>
                      </div>
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
                        <th className="p-2 whitespace-nowrap">Student ID</th>
                        <th className="p-2 whitespace-nowrap">Course/Year</th>
                        <th className="p-2 whitespace-nowrap">Admin</th>
                        <th className="p-2 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id || u.id} className="hover:bg-gray-50">
                          <td className="p-2 whitespace-nowrap font-semibold">{u.name}</td>
                          <td className="p-2 whitespace-nowrap">{u.email}</td>
                          <td className="p-2 whitespace-nowrap">{u.studentId || 'N/A'}</td>
                          <td className="p-2 whitespace-nowrap">{u.course || 'N/A'}/{u.year || 'N/A'}</td>
                          <td className="p-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {u.role === 'admin' ? "Admin" : " User"}
                            </span>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <button 
                              onClick={() => deleteUser(u._id || u.id)} 
                              className="px-3 py-1 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-300 font-bold"
                            >
                               DELETE
                            </button>
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
                      <p><strong>Student ID:</strong> {u.studentId || 'N/A'}</p>
                      <p><strong>Course/Year:</strong> {u.course || 'N/A'}/{u.year || 'N/A'}</p>
                      <p><strong>Admin:</strong> {u.role === 'admin' ? "✅" : "❌"}</p>
                      <button onClick={() => deleteUser(u._id || u.id)} className="mt-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 transition-colors">Delete User</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REGISTRATIONS */}
            {tab === "registrations" && (
              <div className="space-y-6">
                {selectedEventId ? (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedEventId(null);
                        fetchRegistrations();
                      }}
                      className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      ← Back to All Registrations
                    </button>
                    <h3 className="font-semibold mb-4">Event Registrations ({registrations.length})</h3>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block mb-2">Filter by Event:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          fetchRegistrations(e.target.value);
                        } else {
                          fetchRegistrations();
                        }
                      }}
                      className="w-full p-2 border rounded"
                      value={selectedEventId || ""}
                    >
                      <option value="">All Events</option>
                      {events.map(e => (
                        <option key={e._id || e.id} value={e._id || e.id}>{e.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-2">User</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Student ID</th>
                        <th className="p-2">Event</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Registered At</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-gray-50">
                          <td className="p-2 font-semibold">{reg.user?.name}</td>
                          <td className="p-2">{reg.user?.email}</td>
                          <td className="p-2">{reg.user?.studentId || 'N/A'}</td>
                          <td className="p-2 font-semibold">{reg.event?.title || 'N/A'}</td>
                          <td className="p-2">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${
                              reg.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              reg.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reg.status === 'Approved' ? '✅ Approved' : 
                               reg.status === 'Rejected' ? '❌ Rejected' : 
                               '⏳ Pending'}
                            </span>
                          </td>
                          <td className="p-2">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                          <td className="p-2">
                            {reg.status === 'Pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRegistrationStatus(reg._id, 'Approved')}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-bold border border-green-700"
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt("Rejection reason (optional):");
                                    if (notes !== null) { // Only proceed if user didn't cancel
                                      handleRegistrationStatus(reg._id, 'Rejected', notes || "");
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-bold border border-red-700"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                            {reg.notes && (
                              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                                <strong>Note:</strong> {reg.notes}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                            <button onClick={() => deleteMessage(m._id || m.id)} className="px-2 py-1 text-red-600 bg-blue-300 font-bold rounded hover:bg-red-400 transition-colors">Delete</button>
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