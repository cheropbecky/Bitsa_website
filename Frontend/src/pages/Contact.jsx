import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import heroPicture from "../assets/hero_bitsa.jpg";
import api from "../api/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contacts = [
    {
      name: "Alpha Chamba",
      role: "Chairperson",
      email: "Chamba@gmail.com",
      phone: "0708898899",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Gloria Jebet",
      role: "Vice President",
      email: "Gloria320@gmail.com",
      phone: "0725486687",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Sharon Gaithi",
      role: "Secretary",
      email: "gaithisahron@gmail.com",
      phone: "0798863568",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Maina Davies",
      role: "Treasurer",
      email: "mainadavies@gmail.com",
      phone: "0725486687",
      img: "https://randomuser.me/api/portraits/men/47.jpg",
    },
    {
      name: "Allan Cheruiyot",
      role: "Public Relation Officer",
      email: "allanpr@gmail.com",
      phone: "0725486687",
      img: "https://randomuser.me/api/portraits/men/52.jpg",
    },
  ];

  // 📩 SEND CONTACT MESSAGE — USING CENTRALIZED API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact/send", formData);

      alert("Message sent successfully! We'll get back to you.");
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to send message");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${heroPicture})` }}
    >
      <div className="bg-black/20 min-h-screen py-16">
        {/* Header */}
        <motion.div
          className="max-w-7xl mx-auto px-6 mb-12 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
        >
          <h1 className="text-5xl md:text-6xl mb-4 text-white font-bold">
            Contact <span className="text-blue-400">BITSA</span>
          </h1>
          <p className="text-xl font-bold text-gray-200 max-w-2xl mx-auto">
            Have questions? We're here to help and answer any questions you might have.
          </p>
        </motion.div>

        {/* Contact Form & Info */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 mb-16">

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-gray-800 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">Message</label>
                  <textarea
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[120px] border border-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-500 text-white rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:bitsaclub@ueab.ac.ke" className="text-blue-500 hover:underline">
                    bitsaclub@ueab.ac.ke
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a href="tel:+254708898899" className="text-blue-500 hover:underline">
                    0708898899
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-700">Bitsa Lab, University Campus</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">Office Hours</p>
                  <p className="text-gray-700">Mon–Fri: 9:00 AM – 5:00 PM</p>
                  <p className="text-gray-700">Saturday: Closed</p>
                  <p className="text-gray-700">Sunday: 10:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-4xl font-bold text-center mb-10 text-white">
            Meet Our <span className="text-blue-400">Leadership</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contacts.map((contact, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-300 shadow-md"
                  />
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-blue-500 font-medium">{contact.role}</p>
                </div>

                <p className="text-gray-700 text-center flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href={`mailto:${contact.email}`} className="hover:underline text-blue-500">
                    {contact.email}
                  </a>
                </p>

                <p className="text-gray-700 text-center mt-2 flex items-center justify-center gap-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <a href={`tel:${contact.phone}`} className="hover:underline text-blue-500">
                    {contact.phone}
                  </a>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Google Map */}
        <motion.div
          className="max-w-7xl mx-auto px-6 mb-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-white">
            Find Us on <span className="text-blue-400">Google Maps</span>
          </h2>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-blue-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31918.220353151002!2d35.071590372685755!3d0.25903879516635064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sUniversity%20Of%20Eastern%20Africa%20Baraton%20library!5e0!3m2!1sen!2ske!4v1762370559888!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="UEAB Library Location"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;