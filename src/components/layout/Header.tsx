"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/ui/SearchOverlay";
import AccountMenu from "./AccountMenu";
import { useLanguage } from "@/context/LanguageContext";

export default function Header({ session }: { session?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { name: t("nav.home", "TRANG CHỦ"), href: "/" },
    { name: t("nav.collection", "KHÁM PHÁ SẢN PHẨM"), href: "/collection" },
    { name: t("nav.map", "BẢN ĐỒ DI SẢN"), href: "/map" },
    { name: t("nav.storyHub", "STORY HUB"), href: "/story-hub" },
    { name: t("nav.aboutUs", "VỀ CHÚNG TÔI"), href: "/#ve-chung-toi" },
    { name: t("nav.team", "ĐỘI NGŨ"), href: "/team" },
  ];

  useEffect(() => {
    const updateCartCount = () => {
      const saved = localStorage.getItem("mm_cart");
      if (saved) {
        try {
          const cartItems = JSON.parse(saved);
          const count = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
          setCartCount(count);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-2 sm:py-3' : 'bg-transparent py-3 sm:py-5'}`}>
      <div className="container mx-auto px-3 sm:px-6 max-w-[1400px] flex items-center justify-between gap-2">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image 
            src="/images/logo.png" 
            alt="Một Mảnh Việt Nam" 
            width={240} 
            height={80} 
            className="h-11 sm:h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105 mix-blend-multiply"
            priority
          />
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

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="hidden md:flex p-2 text-foreground-muted hover:text-terracotta transition-colors"
            title={t("nav.search", "Tìm kiếm")}
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 border-l border-foreground/10 pl-4">
            {session?.user ? (
              <AccountMenu session={session} />
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-foreground-muted hover:text-terracotta transition-colors tracking-wider uppercase">
                  {t("nav.login", "ĐĂNG NHẬP")}
                </Link>
                <span className="text-foreground/20">/</span>
                <Link href="/register" className="text-xs font-bold text-terracotta hover:text-terracotta-hover transition-colors tracking-wider uppercase">
                  {t("nav.register", "ĐĂNG KÝ")}
                </Link>
              </>
            )}
          </div>
          
          {/* Language Switcher - Luôn hiển thị trên CẢ MOBILE LẪN DESKTOP */}
          <div className="flex items-center gap-1 border-l border-foreground/15 pl-2 sm:pl-3 text-xs font-bold shrink-0">
            <button 
              type="button"
              onClick={() => setLang('vi')} 
              className={`px-2 py-1 rounded cursor-pointer transition-all text-[11px] sm:text-xs font-black ${
                lang === 'vi' 
                  ? 'bg-terracotta text-white shadow-sm ring-1 ring-terracotta/40' 
                  : 'text-foreground/60 hover:text-foreground bg-foreground/5'
              }`}
              title="Tiếng Việt"
            >
              VI
            </button>
            <span className="text-foreground/30 font-normal text-[10px]">|</span>
            <button 
              type="button"
              onClick={() => setLang('en')} 
              className={`px-2 py-1 rounded cursor-pointer transition-all text-[11px] sm:text-xs font-black ${
                lang === 'en' 
                  ? 'bg-terracotta text-white shadow-sm ring-1 ring-terracotta/40' 
                  : 'text-foreground/60 hover:text-foreground bg-foreground/5'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <Link href="/cart" className="relative p-2 text-foreground-muted hover:text-terracotta transition-colors" title={t("nav.cart", "Giỏ hàng")}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-background">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button 
            className="md:hidden p-2 hover:bg-foreground/5 rounded-full transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
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
            className="fixed inset-0 bg-[#FAF7F2] z-[100] flex flex-col px-6 py-8 md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif font-semibold text-xl text-foreground">
                {t("nav.siteName", "Một Mảnh Việt Nam")}
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Language Switcher nổi bật trong Drawer */}
            <div className="bg-white border-2 border-foreground/15 rounded-2xl p-4 mb-6 shadow-[3px_3px_0px_rgba(42,42,39,0.06)]">
              <div className="text-xs font-black uppercase tracking-wider text-foreground/60 mb-2.5 flex items-center gap-1.5">
                <span>🌐 {lang === 'vi' ? 'Ngôn ngữ hiển thị / Language' : 'Display Language / Ngôn ngữ'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLang('vi')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 cursor-pointer ${
                    lang === 'vi' 
                      ? 'bg-terracotta text-white border-terracotta shadow-sm' 
                      : 'bg-[#FAF7F2] text-foreground border-foreground/10 hover:border-foreground/30'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 cursor-pointer ${
                    lang === 'en' 
                      ? 'bg-terracotta text-white border-terracotta shadow-sm' 
                      : 'bg-[#FAF7F2] text-foreground border-foreground/10 hover:border-foreground/30'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
            
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-serif font-medium hover:text-terracotta transition-colors py-1 border-b border-foreground/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Links */}
            <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col gap-3">
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <User className="w-4 h-4 text-terracotta" />
                    <span>{session.user.name || session.user.email}</span>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-foreground/70 hover:text-terracotta"
                  >
                    {t("nav.myAccount", "Tài khoản của tôi")}
                  </Link>
                  <Link 
                    href="/profile/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold text-foreground/70 hover:text-terracotta"
                  >
                    {t("nav.myOrders", "Đơn hàng của tôi")}
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border-2 border-foreground rounded-lg"
                  >
                    {t("nav.login", "ĐĂNG NHẬP")}
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-terracotta text-white rounded-lg shadow-sm"
                  >
                    {t("nav.register", "ĐĂNG KÝ")}
                  </Link>
                </div>
              )}
            </div>
            
            <div className="mt-auto pb-4 border-t border-foreground/10 pt-6">
              <p className="text-xs text-foreground/60 italic font-serif">
                {t("nav.slogan", '"Mang một mảnh Việt Nam theo bên mình."')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
