"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MovieDetailsSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sideLinks = [
    { label: "Home", icon: <i className="ri-home-2-line"></i> },
    { label: "Explore", icon: <i className="ri-movie-2-line"></i> },
    { label: "TV-Series", icon: <i className="ri-tv-2-line"></i> },
    { label: "Upcoming", icon: <i className="ri-calendar-2-line"></i> },
  ];

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b-2 flex items-center justify-between p-4">
        <Link href={"/"} className="flex space-x-2 items-center">
          <Image src={`/images/others/movie_box_logo.png`} width={40} height={40} alt="Logo" />
          <span className="font-bold text-lg">SMovies</span>
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl p-2"
          aria-label="Toggle menu"
        >
          <i className={isOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r-2 z-50 space-y-14 overflow-y-auto
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:w-[280px]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-[280px]
        `}
      >
        <Link href={"/"} className="flex space-x-4 items-center p-4 lg:mt-0 mt-16">
          <Image src={`/images/others/movie_box_logo.png`} width={50} height={50} alt="Logo" className="lg:block" />
          <span className="font-bold text-xl">SMovies</span>
        </Link>

        <div className="space-y-2">
          {sideLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.label === "Home" ? "/" : `/${link.label.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={`flex space-x-2 p-5 duration-200 cursor-pointer ${
                link.label === "Movies"
                  ? "border-r-[6px] border-rose-600 bg-rose-50 hover:bg-rose-100"
                  : "hover:bg-rose-50"
              }`}
            >
              {link.icon} <p>{link.label}</p>
            </Link>
          ))}
        </div>

        <div className="border border-rose-600 rounded-3xl bg-rose-50 pt-10 px-4 pb-4 space-y-2 mx-2 p-4">
          <h4 className="font-semibold text-lg leading-relaxed">
            Play more quizzes to earn free tickets
          </h4>
          <p className="text-gray-700">50k People are playing now.</p>

          <div className="text-center">
            <button className="text-rose-600 bg-rose-300 rounded-full px-3 py-1 text-sm font-semibold">
              Start Playing
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MovieDetailsSideBar;