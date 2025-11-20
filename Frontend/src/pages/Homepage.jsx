import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import { Link } from "react-router-dom"
import "aos/dist/aos.css";
import {
  Calendar,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import heroPicture from "../assets/hero_bitsa.jpg";

function Homepage({ onNavigate }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, 
      mirror: true, 
    });
  }, []);
  const navigate = useNavigate()

  const features = [
    {
      icon: <Users className="w-22 h-12 text-amber-500 " />,
      title: "Community",
      description:
        "Connect with fellow IT students and build lasting professional relationships.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Calendar className="w-22 h-12 text-blue-500" />,
      title: "Events",
      description:
        "Participate in workshops, hackathons, and networking events throughout the year.",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      icon: <BookOpen className="w-22 h-12 text-red-500" />,
      title: "Resources",
      description:
        "Access study materials, tutorials, and career guidance from industry experts.",
      gradient: "from-blue-700 to-blue-800",
    },
    {
      icon: <Trophy className="w-22 h-12 text-purple-600" />,
      title: "Competitions",
      description:
        "Showcase your skills in coding competitions and hackathons with prizes.",
      gradient: "from-blue-800 to-blue-900",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <div
        className="relative overflow-hidden bg-cover bg-center min-h-[90vh]"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center text-white"
          data-aos="fade-up"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">
              Empowering Tech Leaders Since 2020
            </span>
          </div>

          <h1
            className="text-7xl md:text-6xl mb-6 font-extrabold drop-shadow-lg animate-bounce-slow"
            data-aos="zoom-in"
          >
            Welcome to <span className="text-blue-400">BITSA</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100 font-bold drop-shadow"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Bachelor of Information Technology Students Association empowering
            the next generation of tech leaders through innovation,
            collaboration, and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-blue-500/50 hover:bg-blue-700 animate-glow"
            >
              Join BITSA Today <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/events")}
              className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:bg-blue-50"
            >
              Explore Events
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-900 font-extrabold">
            Why Join <span className="text-blue-600">BITSA?</span>
          </h2>
          <p className="text-xl font-bold text-blue-600 max-w-2xl mx-auto">
            Discover the benefits of being part of our vibrant IT student
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 200}
              className="group relative overflow-hidden bg-blue-100 border border-blue-100 rounded-2xl shadow-md hover:shadow-blue-400 hover:-translate-y-2 transition-all duration-500 p-8"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-200 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center font-bold">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="bg-linear-to-br from-blue-100 via-blue-50 to-indigo-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm mb-6">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 font-bold">
              Building the Future of Technology
            </h2>
            <p className="text-lg text-gray-700 mb-4 font-bold">
              BITSA is a dynamic organization dedicated to fostering
              collaboration, innovation, and professional development among IT
              students.
            </p>
            <p className="text-lg text-gray-700 mb-8 font-bold">
              We organize hackathons, workshops, networking events, and provide
              a platform for students to connect, learn, and grow in the
              ever-evolving tech industry.
            </p>
            <ul className="space-y-3 mb-8 font-bold">
              {[
                "Industry-led Workshops",
                "Networking Opportunities",
                "Career Guidance",
                "Tech Competitions",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 animate-pulse">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 font-bold transform hover:scale-105 hover:shadow-blue-500/50"
            >
              Get in Touch <ArrowRight className="w-5 h-5" />
            </button>
          </div>

         
          {/* About Image */}
<div className="relative" data-aos="fade-left">
  <img
    src="https://images.unsplash.com/photo-1638029202288-451a89e0d55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBoYWNrYXRob258ZW58MXx8fHwxNzYyMjUxOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    alt="Coding Hackathon"
    className="rounded-3xl shadow-2xl object-cover w-full h-[450px] border-4 border-white hover:scale-105 transition-transform duration-700"
  />
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-transparent from-blue-900/30 to-transparent"></div>
</div>

        </div>
      </div>

      {/* CALL TO ACTION SECTION */}
      <div className="bg-blue-700 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-pulse">
            Ready to Be Part of Something Bigger?
          </h2>
          <p className="text-lg md:text-xl mb-10 font-bold text-blue-100">
            Join BITSA today and take the first step toward becoming a leader in
            the tech community.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-100 transition-all shadow-lg flex items-center gap-2 mx-auto transform hover:scale-105 hover:shadow-blue-300/50"
          >
            Join Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>  
    </div>
  );
}

export default Homepage;
