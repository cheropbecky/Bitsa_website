import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Bitsa_logo from "../assets/Bitsa_logo.jpg";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Replace the blue B icon with the BITSA logo */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={Bitsa_logo}
                  alt="BITSA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-semibold tracking-wide">BITSA</span>
            </div>

            <p className="text-blue-100 mb-6 font-bold leading-relaxed max-w-md">
              Bachelor of Information Technology Students Association empowering IT
              students through collaboration, innovation, and excellence in technology.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-100">
                <Mail className="w-5 h-5 text-blue-400 font-bold" />
                <span>bitsaclub@ueab.ac.ke</span>
              </div>
              <div className="flex items-center font-bold gap-3 text-blue-100">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>0799049979</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <MapPin className="w-5 h-5 font-bold text-blue-400" />
                <span>Bitsa Lab, University Campus</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-bold text-lg">Quick Links</h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-6 font-bold text-lg">Connect With Us</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-blue-100 text-sm">
              Follow us for the latest updates, events, and tech insights from our
              community.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-blue-100 text-sm">
          <p>&copy; {new Date().getFullYear()} BITSA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
