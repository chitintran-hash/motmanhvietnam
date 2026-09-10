"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Bộ sưu tập", href: "/collection" },
  { name: "Bản đồ di sản", href: "/map" },
  { name: "Pixel Memory", href: "/pixel-memory" },
];

export default function Header({ session }: { session?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-serif font-bold text-xl group-hover:bg-terracotta-hover transition-colors shadow-md">
            M
          </div>
          <span className="font-serif font-semibold text-xl tracking-wide hidden sm:block">Một Mảnh Việt Nam</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-terracotta transition-colors relative group uppercase tracking-wider">
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-terracotta transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <Link href={session.user?.role === 'admin' ? "/admin" : "/profile"} className="hidden md:block text-sm font-medium hover:text-terracotta transition-colors">
              {session.user?.name || session.user?.email}
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-terracotta transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="text-sm font-medium bg-terracotta text-white px-4 py-2 rounded-full hover:bg-terracotta-hover transition-colors">
                Đăng ký
              </Link>
            </div>
          )}
          
          <button className="relative p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
          </button>
          
          <button 
            className="md:hidden p-2 hover:bg-foreground/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-50 flex flex-col px-6 py-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif font-semibold text-xl">Một Mảnh Việt Nam</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-serif font-medium hover:text-terracotta transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pb-8 border-t border-foreground/10 pt-8">
              <p className="text-sm text-foreground/60 italic font-serif">"Mang một mảnh Việt Nam theo bên mình."</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
