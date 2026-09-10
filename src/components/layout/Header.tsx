"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/ui/SearchOverlay";
import AccountMenu from "./AccountMenu";

const navLinks = [
  { name: "TRANG CHỦ", href: "/" },
  { name: "KHÁM PHÁ SẢN PHẨM", href: "/collection" },
  { name: "BẢN ĐỒ DI SẢN", href: "/map" },
  { name: "STORY HUB", href: "/story-hub" },
  { name: "ĐỘI NGŨ", href: "/team" },
];

export default function Header({ session }: { session?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lang, setLang] = useState("VI");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Demo local storage cart
    const count = localStorage.getItem("cartCount") || "2"; // Default to 2 for demo
    setCartCount(parseInt(count));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 max-w-[1400px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-display font-black text-xl tracking-tighter text-foreground group-hover:text-terracotta transition-colors">
            MỘT MẢNH <span className="text-terracotta group-hover:text-terracotta transition-colors">VIỆT NAM</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-xs font-bold text-foreground-muted hover:text-terracotta transition-colors uppercase tracking-widest relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex p-2 text-foreground-muted hover:text-terracotta transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 border-l border-foreground/10 pl-4">
            {session?.user ? (
              <AccountMenu session={session} />
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-foreground-muted hover:text-terracotta transition-colors tracking-wider">
                  ĐĂNG NHẬP
                </Link>
                <span className="text-foreground/20">/</span>
                <Link href="/register" className="text-xs font-bold text-terracotta hover:text-terracotta-hover transition-colors tracking-wider">
                  ĐĂNG KÝ
                </Link>
              </>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-1 border-l border-foreground/10 pl-4 text-xs font-bold text-foreground-muted">
            <span onClick={() => setLang('VI')} className={`cursor-pointer transition-colors ${lang === 'VI' ? 'text-foreground' : 'hover:text-foreground'}`}>VI</span>
            <span className="text-foreground/30 font-normal">|</span>
            <span onClick={() => setLang('EN')} className={`cursor-pointer transition-colors ${lang === 'EN' ? 'text-foreground' : 'hover:text-foreground'}`}>EN</span>
          </div>

          <Link href="/cart" className="relative p-2 text-foreground-muted hover:text-terracotta transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-background">
                {cartCount}
              </span>
            )}
          </Link>
          
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
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
