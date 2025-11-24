"use client";

import MaxWidth from "@/components/Layout/max-width";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEarth, faChevronDown, faClose, faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchComponent from "../Search";
import Link from "next/link";

interface NavbarProps {
  isTransparent?: string;
}

interface NavbarItemsProps {
  tag: string;
  path: string;
}

const Navbar: React.FC<NavbarProps> = ({ isTransparent }) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSideOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navLinks: NavbarItemsProps[] = [
    {
      tag: "Home",
      path: "/",
    },
    {
      tag: "Explore",
      path: "/explore",
    },
    {
      tag: "TV Series",
      path: "/tv-series",
    },
    {
      tag: "Upcoming",
      path: "/upcoming",
    },
  ];

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);
  const toggleSearchBar = () => setIsSideOpen(!isSearchOpen);

  return (
    <>
      <SearchComponent isOpen={isSearchOpen} togggleOpen={toggleSearchBar} />

      <div className={`${isTransparent && "bg-transparent"} z-50`}>
        <MaxWidth>
          <nav className="flex justify-between items-center py-4 sm:py-6">
            {/* Logo Section - Always Visible */}
            <Link href="/" className="flex space-x-2 sm:space-x-4 items-center">
              <Image 
                src={`/images/others/movie_box_logo.png`} 
                width={40} 
                height={40} 
                alt="Logo"
                className="sm:w-[50px] sm:h-[50px]" 
              />
              <span className="font-bold text-lg sm:text-xl">SMovies</span>
            </Link>

            {/* Desktop Search Bar - Hidden on Mobile/Tablet */}
            <div className="hidden lg:flex xl:min-w-[40rem] lg:min-w-[35rem] border rounded-lg px-4 focus-within:border-white text-white border-gray-400 duration-200 bg-transparent items-center justify-between">
              <input
                type="text"
                className="py-2 text-white bg-transparent outline-none flex-grow placeholder:text-white"
                placeholder="What do you want to watch?"
                autoComplete="off"
                onFocus={toggleSearchBar}
              />
              <FontAwesomeIcon icon={faSearch} className="text-sm" />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Icon - Hidden on smallest devices, shown on sm+ */}
              <div className="hidden sm:block lg:hidden">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="cursor-pointer text-sm hover:text-rose-500 transition-colors" 
                  onClick={toggleSearchBar} 
                />
              </div>

              {/* Language Selector - Hidden on smallest devices */}
              <div className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm cursor-pointer hover:text-rose-500 transition-colors" title="Change Language">
                <FontAwesomeIcon icon={faEarth} className="text-red-500" />
                <span>EN</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
              </div>

              {/* Sign In Button - Hidden on smallest devices */}
              <Link href="/explore" className="hidden sm:block bg-transparent px-3 sm:px-4 py-1 rounded-full border-2 sm:border-[3px] text-xs sm:text-sm border-rose-500 hover:text-black hover:bg-rose-500 duration-200 transition-all">
                View More
              </Link>

              {/* Hamburger Menu - Always Visible on Mobile/Tablet */}
              <button
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-600 hover:bg-rose-700 grid place-content-center cursor-pointer transition-all duration-200 active:scale-95"
                title="Menu"
                onClick={toggleMobileNav}
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={faBars} className="text-white text-base sm:text-lg" />
              </button>
            </div>
          </nav>
        </MaxWidth>

        {/* Mobile Menu Overlay */}
        <aside
          className={`fixed top-0 right-0 bg-black/95 backdrop-blur-lg overflow-hidden duration-300 h-full z-[500] ${
            isMobileNavOpen ? "w-full" : "w-0"
          }`}
        >
          <div className="w-full h-full flex flex-col">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
              <div className="flex space-x-2 sm:space-x-4 items-center">
                <Image 
                  src={`/images/others/movie_box_logo.png`} 
                  width={40} 
                  height={40} 
                  alt="Logo"
                  className="sm:w-[50px] sm:h-[50px]" 
                />
                <span className="font-bold text-lg sm:text-xl">SMovies</span>
              </div>
              <button
                onClick={toggleMobileNav}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-600 hover:bg-rose-700 grid place-content-center transition-all duration-200 active:scale-95"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faClose} className="text-white text-base sm:text-lg" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
              {/* Search Button in Mobile Menu */}
              <button
                onClick={() => {
                  toggleSearchBar();
                  toggleMobileNav();
                }}
                className="w-full max-w-sm mb-6 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left flex items-center gap-3 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSearch} className="text-rose-500" />
                <span className="text-sm sm:text-base">Search movies...</span>
              </button>

              {/* Navigation Links */}
              <nav className="w-full max-w-sm space-y-2 mb-8">
                {navLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.path}
                    className={`block py-3 sm:py-4 px-4 rounded-lg text-center text-base sm:text-lg font-medium cursor-pointer duration-200 transition-all ${
                      pathname === item.path 
                        ? "bg-rose-600 text-white" 
                        : "hover:bg-gray-800 text-gray-300 hover:text-white"
                    }`}
                    onClick={toggleMobileNav}
                  >
                    {item.tag}
                  </a>
                ))}
              </nav>

              {/* Mobile Menu Actions */}
              <div className="w-full max-w-sm space-y-3">
                {/* Language Selector */}
                <div className="flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer py-3 hover:text-rose-500 transition-colors">
                  <FontAwesomeIcon icon={faEarth} className="text-red-500" />
                  <span>English</span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>

                {/* Sign In Button */}
                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 active:scale-95">
                  View More
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;