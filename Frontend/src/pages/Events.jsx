import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroPicture from "../assets/hero_bitsa.jpg";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [registering, setRegistering] = useState({}); // Track registration per event

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getImageSrc = (url) =>
    url.startsWith("http") ? url : `http://localhost:5500${url}`;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const getEventStatus = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    if (eventDate.toDateString() === now.toDateString()) return "Ongoing";
    if (eventDate > now) return "Upcoming";
    return "Past";
  };

  // Handle user registration
  const handleRegister = async (eventId) => {
    try {
      // Get logged-in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!loggedInUser._id) {
        alert("You must be logged in to register for an event.");
        return;
      }

      setRegistering((prev) => ({ ...prev, [eventId]: true }));

      const res = await fetch(
        `http://localhost:5500/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUser._id }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("Registered successfully!");

      // Update registeredUsers in state
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, registeredUsers: [...(e.registeredUsers || []), loggedInUser] }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event.date);
    return filter === "All" || status === filter;
  });

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${heroPicture})` }}
    >
      <div className="bg-black/20 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            className="text-xl font-bold text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join BITSA members at the latest tech workshops, seminars, and meetups across Kenya
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-center">
          <select
            className="mb-6 px-3 py-2 rounded border"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Past">Past</option>
          </select>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-200">Loading events...</p>
            </div>
          ) : error ? (
            <p className="text-red-400 text-center mb-4">{error}</p>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <p className="text-xl text-gray-700">No events available yet.</p>
              <p className="text-gray-600 mt-2">Check back soon for upcoming activities!</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {filteredEvents.map((event) => {
                const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
                const isRegistered = event.registeredUsers?.some((u) => u._id === loggedInUser._id);

                return (
                  <motion.div
                    key={event._id}
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <div className="group overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                      {event.imageUrl && (
                        <div className="relative h-56 overflow-hidden rounded-t-2xl">
                          <img
                            src={getImageSrc(event.imageUrl)}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-bold text-blue-700 line-clamp-2">{event.title}</h2>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              getEventStatus(event.date) === "Ongoing"
                                ? "bg-green-200 text-green-800"
                                : getEventStatus(event.date) === "Upcoming"
                                ? "bg-blue-200 text-blue-800"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {getEventStatus(event.date)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-gray-700 text-sm mb-2 line-clamp-3">{event.description}</p>
                        )}
                        <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">📅 {formatDate(event.date)}</p>
                        <button
                          className={`mt-2 w-full font-semibold py-2 px-4 rounded ${
                            isRegistered
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                          onClick={() => !isRegistered && handleRegister(event._id)}
                          disabled={isRegistered || registering[event._id]}
                        >
                          {registering[event._id] ? "Registering..." : isRegistered ? "Registered" : "Register"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
