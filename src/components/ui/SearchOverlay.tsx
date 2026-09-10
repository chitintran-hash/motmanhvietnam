"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background-alt flex flex-col pt-24 px-6 md:px-12"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none -z-10"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-6 md:right-12 p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-foreground" />
          </button>

          <div className="max-w-4xl mx-auto w-full relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-foreground/40" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Hà Nội, Sài Gòn, Câu chuyện..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-4 border-foreground text-4xl md:text-5xl font-display font-black text-foreground pl-14 pb-4 focus:outline-none focus:border-terracotta placeholder:text-foreground/20 uppercase transition-colors"
            />
          </div>

          <div className="max-w-4xl mx-auto w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-6">Từ khóa phổ biến</h3>
              <div className="flex flex-wrap gap-3">
                {["Mảnh Hà Nội", "Cà phê vỉa hè", "Đà Nẵng", "Chợ Bến Thành"].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 border border-foreground/10 hover:border-terracotta hover:text-terracotta text-sm font-bold transition-colors uppercase"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            {query.length > 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-6">Kết quả gợi ý</h3>
                <Link href={`/collection/manh-ha-noi`} onClick={onClose} className="group block">
                  <h4 className="font-display font-bold text-xl group-hover:text-terracotta transition-colors">MẢNH HÀ NỘI</h4>
                  <span className="text-sm text-foreground-muted flex items-center gap-2 mt-1">Sản phẩm <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
                <Link href={`/story-hub/hanoi-01`} onClick={onClose} className="group block">
                  <h4 className="font-display font-bold text-xl group-hover:text-terracotta transition-colors">MỘT SÁNG HÀ NỘI</h4>
                  <span className="text-sm text-foreground-muted flex items-center gap-2 mt-1">Câu chuyện <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
