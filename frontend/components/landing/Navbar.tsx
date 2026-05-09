"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Módulos", href: "#modulos" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precios", href: "#precios" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300">
              <Zap size={16} className="text-white" />
            </div>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Steven <span className="text-gradient">IA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-500 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors duration-200"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="relative text-sm font-semibold px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] overflow-hidden group"
          >
            <span className="relative z-10">Comenzar gratis</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden glass border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white text-sm font-medium py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <Link
                  href="/login"
                  className="text-center text-slate-300 hover:text-white text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-center text-sm font-semibold px-5 py-2.5 rounded-xl bg-brand-600 text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Comenzar gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
