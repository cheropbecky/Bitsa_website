import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Users, Ticket, Laptop } from 
"lucide-react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";



// Sample events data
const sampleEvents = [
  {
  
 id: "1",
    title: "Hackathon 2025",
    description: "Join our annual coding competition to showcase your skills and win prizes!",
    date: "2025-12-10T09:00",
    location: "BITSA Lab",
    isOnline: false,
    imageUrl: img1,
  },
  {
    id: "2",
    title: "React Workshop",
    description: "Learn the basics of React.js and build dynamic web applications.",
    date: "2025-11-20T14:00",
    location: "Online",
    isOnline: true,
    imageUrl: img2,
  },
  {
    id: "3",
    title: "Tech Networking Evening",
    description: "Meet fellow IT students and industry professionals.",
    date: "2025-12-05T17:00",
    location: "University Auditorium",
    isOnline: false,
    imageUrl: img3,
  },
  {
    id: "4",
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop to explore AI and ML techniques in real-world projects.",
    date: "2025-12-15T10:00",
    location: "BITSA Lab",
    isOnline: false,
    imageUrl: img4,
  },
  {
    id: "5",
    title: "Cybersecurity Seminar",
    description: "Learn about cybersecurity threats and best practices to protect your data.",
    date: "2025-11-25T11:00",
    location: "Online",
    isOnline: true,
    imageUrl: img5,
  },
  {
    id: "6",
    title: "UI/UX Design Challenge",
    description: "Test your design skills in a fun and creative competition.",
    date: "2025-12-01T13:00",
    location: "BITSA Lab",
    isOnline: false,
    imageUrl: img6,
  },
];
export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setTimeout(() => setEvents(sampleEvents), 500);
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const slideInLeft = { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };
  const slideInRight = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };

  return (
    <div className="min-h-screen bg-blue-100 py-16">
      <motion.div className="max-w-7xl mx-auto px-6 mb-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}>
        <h1 className="text-5xl md:text-6xl mb-2 text-gray-900 font-bold">
          Upcoming <span className="text-blue-600 font-extrabold">Events</span>
        </h1>
        <p className="text-xl font-semibold text-gray-600 max-w-2xl mx-auto">
          Join us for exciting workshops, hackathons, and networking opportunities, both online and on campus.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
         
          let variant = {};
          if ((index + 1) % 3 === 1) variant = slideInLeft;
          else if ((index + 1) % 3 === 0) variant = slideInRight; 
          else variant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

          return (
            <motion.div
              key={event.id}
              className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-blue-200 border border-blue-100"
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
             
              <div className="w-full h-64 md:h-64 relative overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">Upcoming</Badge>
                </div>
              </div>

              <div className="p-4 md:p-6 flex flex-col justify-between">
                <CardHeader className="mb-1">
                  <CardTitle className="text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-gray-700 font-medium leading-relaxed">{event.description}</p>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-start gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-semibold">{formatDate(event.date)}</div>
                        <div className="text-gray-500">{formatTime(event.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      {event.isOnline ? (
                        <Laptop className="w-4 h-4 text-blue-500 shrink-0" />
                      ) : (
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-medium">Open to all BITSA members</span>
                    </div>
                  </div>

                  <Button className="mt-3 bg-linear-to-br from-blue-500 to-indigo-500 text-white font-bold py-2 rounded-4xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-1">
                    <Ticket className="w-4 h-4" />
                    Register Now
                  </Button>
                </CardContent>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
