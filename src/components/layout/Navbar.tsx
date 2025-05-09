"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container-wide flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span
            className={`font-domus font-semibold text-2xl ${isScrolled ? "text-umi-blue-dark" : "text-white"}`}
          >
            umi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#servicios"
            className={`${isScrolled ? "text-gray-700" : "text-white"} hover:text-umi-light-blue transition-colors`}
          >
            Servicios
          </Link>
          <Link
            href="#proceso"
            className={`${isScrolled ? "text-gray-700" : "text-white"} hover:text-umi-light-blue transition-colors`}
          >
            Proceso
          </Link>
          <Link
            href="#testimonios"
            className={`${isScrolled ? "text-gray-700" : "text-white"} hover:text-umi-light-blue transition-colors`}
          >
            Testimonios
          </Link>
          <Link href="#contacto" className="btn-primary">
            Solicitar consulta
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden ${isScrolled ? "text-umi-blue-dark" : "text-white"}`}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4"
        >
          <div className="container-wide flex flex-col space-y-4">
            <Link
              href="#servicios"
              className="text-gray-700 hover:text-umi-blue-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#proceso"
              className="text-gray-700 hover:text-umi-blue-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Proceso
            </Link>
            <Link
              href="#testimonios"
              className="text-gray-700 hover:text-umi-blue-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonios
            </Link>
            <Link
              href="#contacto"
              className="btn-primary inline-block text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solicitar consulta
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
