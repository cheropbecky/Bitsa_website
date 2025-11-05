import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white  overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-50" />
                <div className="relative w-12 h-12 gradient-blue-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">B</span>
                </div>
              </div>
              <span className="text-2xl">BITSA</span>
            </div>
            <p className="text-blue-100 mb-6 font-bold leading-relaxed max-w-md">
              Bachelor of Information Technology Students Association - Empowering IT students through collaboration, innovation, and excellence in technology.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-100">
                <Mail className="w-5 h-5 text-blue-400 font-bold" />
                <span>info@bitsa.edu</span>
              </div>
              <div className="flex items-center font-bold gap-3 text-blue-100">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <MapPin className="w-5 h-5 font-bold text-blue-400" />
                <span>Tech Campus, Innovation Hub</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 font-bold text-lg">Quick Links</h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors  font-bold hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-blue-400 transition-colors font-bold hover:translate-x-1 inline-block">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-blue-400 transition-colors  font-bold hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-blue-400  transition-colors font-bold hover:translate-x-1 inline-block">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400  transition-colors font-bold hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-6  font-bold text-lg">Connect With Us</h3>
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-blue-600/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 shadow-lg">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-blue-100 text-sm">
              Follow us for the latest updates, events, and tech insights from our community.
            </p>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-blue-100 text-sm">
          <p>&copy; {new Date().getFullYear()} BITSA. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Code of Conduct</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
