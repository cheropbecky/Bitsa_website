import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Clock, Send, MessageSquare } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contacts = [
    {
      role: "President",
      name: "Alpha Chamba",
      email: "president@bitsa.edu",
      phone: "0708898899",
    },
    {
      role: "Vice President",
      name: "Gloria Jebet",
      email: "vicepresident@bitsa.edu",
      phone: "0725486687",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-16">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-12 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <h1 className="text-5xl md:text-6xl mb-4 text-gray-900 font-bold">
          Contact <span className="text-blue-600">BITSA</span>
        </h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
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
          viewport={{ once: false }}
        >
          <div className="bg-blue-100 rounded-2xl p-8 shadow-md hover:shadow-xl shadow-blue-500 transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-semibold">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full h-12 border border-gray-400 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full min-h-[120px] border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-linear-to-br from-blue-500 to-indigo-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <Send className="inline-block w-4 h-4 mr-2" />
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
          viewport={{ once: false }}
        >
          <div className="bg-blue-100 rounded-2xl p-6 shadow-md space-y-6 hover:shadow-xl shadow-blue-300 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <a
                  href="mailto:bitsaclub@ueab.ac.ke"
                  className="text-blue-600 hover:underline"
                >
                  bitsaclub@ueab.ac.ke
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <a href="tel:+254708898899" className="text-blue-600 hover:underline">
                  0708898899
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-gray-700">Bitsa Lab, University Campus</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Office Hours</p>
                <p className="text-gray-700">Mon–Fri: 9:00 AM – 5:00 PM</p>
                <p className="text-gray-700">Saturday: Closed</p>
                <p className="text-gray-700">Sunday: 10:00 AM – 2:00 PM</p>
                <p className="text-gray-900 font-bold">
                  Note: Hours may vary during holidays and exam periods.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leadership Section */}
      <motion.div
        className="max-w-6xl mx-auto mb-16 px-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <h2 className="text-4xl shadow-blue-300 font-bold text-center mb-10">
          Meet Our <span className="text-blue-600 font-bold">Leaders</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              className="bg-blue-100 p-6 rounded-2xl shadow-xl transition-all shadow-blue-300 duration-300 hover:shadow-xl hover:scale-[1.03]"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-linear-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{contact.name}</h3>
                  <p className="text-blue-600">{contact.role}</p>
                </div>
              </div>
              <p className="text-gray-700">
                <Mail className="inline w-4 h-4 mr-2 text-blue-600" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.email}
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <Phone className="inline w-4 h-4 mr-2 text-blue-600" />
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Google Map Section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 mb-20"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <h2 className="text-4xl font-bold text-center mb-8">
          Find Us on <span className="text-blue-600">Google Maps</span>
        </h2>
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-blue-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31918.220353151002!2d35.071590372685755!3d0.25903879516635064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sUniversity%20Of%20Eastern%20Africa%20Baraton%20library!5e0!3m2!1sen!2ske!4v1762370559888!5m2!1sen!2ske"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="UEAB Library Location"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
