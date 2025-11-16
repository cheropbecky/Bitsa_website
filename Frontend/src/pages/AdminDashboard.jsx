import React, { useState, useEffect } from "react";

function BitsaAdminDashboard() {
  const [tab, setTab] = useState("blogs");

  // Data from backend (currently empty)
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);

  // Forms
  const [newBlog, setNewBlog] = useState({ title: "", author: "", category: "", image: "", content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", datetime: "", location: "", image: "", description: "" });
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });

  // Toasts
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Actions
  function createBlog(e) {
    e?.preventDefault();
    if (!newBlog.title || !newBlog.author || !newBlog.content) {
      setToast({ type: "error", message: "Please fill required fields", duration: 4000 });
      return;
    }
    const post = { id: Date.now(), ...newBlog, date: new Date().toISOString().slice(0, 10) };
    setBlogs((s) => [post, ...s]);
    setNewBlog({ title: "", author: "", category: "", image: "", content: "" });
    setToast({ type: "success", message: "Blog post created!" });
  }

  function deleteBlog(id) {
    setBlogs((s) => s.filter((b) => b.id !== id));
    setToast({ type: "success", message: "Blog deleted" });
  }

  function createEvent(e) {
    e?.preventDefault();
    if (!newEvent.title || !newEvent.datetime || !newEvent.location) {
      setToast({ type: "error", message: "Please fill required fields for event", duration: 4000 });
      return;
    }
    const ev = { id: Date.now(), ...newEvent };
    setEvents((s) => [ev, ...s]);
    setNewEvent({ title: "", datetime: "", location: "", image: "", description: "" });
    setToast({ type: "success", message: "Event created!" });
  }

  function deleteEvent(id) {
    setEvents((s) => s.filter((e) => e.id !== id));
    setToast({ type: "success", message: "Event deleted" });
  }

  function addImage(e) {
    e?.preventDefault();
    if (!newImage.url) { setToast({ type: "error", message: "Image URL required" }); return; }
    const img = { id: Date.now(), ...newImage, date: new Date().toLocaleDateString() };
    setGallery((s) => [img, ...s]);
    setNewImage({ url: "", title: "", description: "" });
    setToast({ type: "success", message: "Image added" });
  }

  function deleteImage(id) {
    setGallery((s) => s.filter((g) => g.id !== id));
    setToast({ type: "success", message: "Image removed" });
  }

  function toggleAdmin(userId) {
    setUsers((s) => s.map(u => u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
    setToast({ type: "success", message: "User admin status updated" });
  }

  // Tabs component
  const Tabs = () => (
    <div className="flex gap-2 bg-white/50 p-1 rounded-lg mb-4">
      {[
        { id: "blogs", label: "📝 Blogs" },
        { id: "events", label: "📅 Events" },
        { id: "gallery", label: "🖼️ Gallery" },
        { id: "users", label: "👥 Users" },
      ].map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 rounded-lg text-sm ${tab === t.id ? "bg-blue-600 text-white" : "text-gray-700"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-100">
      <main className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">🛡️ Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage BITSA content and users</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs />

        {/* Content */}
        <div className="bg-blue-200 rounded-2xl p-6 shadow-sm">
          {/* BLOGS */}
          {tab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form className="col-span-1 p-4 border rounded-lg" onSubmit={createBlog}>
                <h2 className="font-semibold mb-3">➕ Create New Blog Post</h2>
                <label>Title *</label>
                <input value={newBlog.title} onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Author *</label>
                <input value={newBlog.author} onChange={(e) => setNewBlog({...newBlog, author: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Category</label>
                <input value={newBlog.category} onChange={(e) => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Image URL</label>
                <input value={newBlog.image} onChange={(e) => setNewBlog({...newBlog, image: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Content *</label>
                <textarea value={newBlog.content} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} className="w-full p-2 border rounded mt-1 mb-3 h-28" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">➕ Create Blog Post</button>
              </form>

              <div className="col-span-2">
                <h3 className="font-semibold mb-3">All Blog Posts ({blogs.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm text-gray-500">
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(b => (
                        <tr key={b.id} className="hover:bg-blue-50">
                          <td>{b.title}</td>
                          <td>{b.author}</td>
                          <td>{b.category}</td>
                          <td>{b.date}</td>
                          <td>
                            <button onClick={() => deleteBlog(b.id)} className="px-2 py-1 rounded bg-red-50 text-red-600">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {tab === "events" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form className="col-span-1 p-4 border rounded-lg" onSubmit={createEvent}>
                <h2 className="font-semibold mb-3">➕ Create New Event</h2>
                <label>Title *</label>
                <input value={newEvent.title} onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Date & Time *</label>
                <input type="datetime-local" value={newEvent.datetime} onChange={(e)=>setNewEvent({...newEvent, datetime: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Location *</label>
                <input value={newEvent.location} onChange={(e)=>setNewEvent({...newEvent, location: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Image URL</label>
                <input value={newEvent.image} onChange={(e)=>setNewEvent({...newEvent, image: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Description</label>
                <textarea value={newEvent.description} onChange={(e)=>setNewEvent({...newEvent, description: e.target.value})} className="w-full p-2 border rounded mt-1 mb-3 h-28" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">➕ Create Event</button>
              </form>

              <div className="col-span-2">
                <h3 className="font-semibold mb-3">All Events ({events.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm text-gray-500">
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id} className="hover:bg-blue-50">
                          <td>{ev.title}</td>
                          <td>{ev.datetime}</td>
                          <td>{ev.location}</td>
                          <td>
                            <button onClick={() => deleteEvent(ev.id)} className="px-2 py-1 rounded bg-red-50 text-red-600">🗑️</button>
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
              <form className="col-span-1 p-4 border rounded-lg" onSubmit={addImage}>
                <h2 className="font-semibold mb-3">➕ Add Gallery Image</h2>
                <label>Image URL *</label>
                <input value={newImage.url} onChange={(e)=>setNewImage({...newImage, url: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Title</label>
                <input value={newImage.title} onChange={(e)=>setNewImage({...newImage, title: e.target.value})} className="w-full p-2 border rounded mt-1 mb-2" />
                <label>Description</label>
                <textarea value={newImage.description} onChange={(e)=>setNewImage({...newImage, description: e.target.value})} className="w-full p-2 border rounded mt-1 mb-3 h-24" />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">➕ Add Image</button>
              </form>

              <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map(g => (
                  <div key={g.id} className="bg-white rounded-lg p-2 shadow hover:shadow-lg relative">
                    <div className="h-36 w-full bg-gray-100 rounded overflow-hidden mb-2">
                      <img src={g.url} alt={`gallery ${g.id}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-medium">{g.title}</div>
                    <div className="text-xs text-gray-400">{g.date}</div>
                    <button onClick={() => deleteImage(g.id)} className="absolute top-2 right-2 bg-white/70 rounded-full p-1">🗑️</button>
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
                <table className="w-full text-left">
                  <thead className="text-sm text-gray-500">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Year</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-blue-50">
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.student}</td>
                        <td>{u.course}</td>
                        <td>{u.year}</td>
                        <td>{u.joined}</td>
                        <td>
                          <button onClick={() => toggleAdmin(u.id)} className={`px-3 py-1 rounded ${u.isAdmin ? "bg-yellow-100 text-yellow-800" : "border border-blue-300 text-blue-700"}`}>🛡️ Toggle Admin</button>
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
  );
}

export default BitsaAdminDashboard;
