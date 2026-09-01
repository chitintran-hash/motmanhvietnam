"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle } from "lucide-react";

export default function MapPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase() === "hanoi") {
      if(!unlocked.includes("Hà Nội")) setUnlocked([...unlocked, "Hà Nội"]);
      setCode("");
    } else if (code.toLowerCase() === "hcm") {
      if(!unlocked.includes("TP. Hồ Chí Minh")) setUnlocked([...unlocked, "TP. Hồ Chí Minh"]);
      setCode("");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-jade/10 to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/3 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Bản đồ Di sản</h1>
            <p className="text-foreground/70 font-light leading-relaxed text-lg">
              Nhập mã bí mật đính kèm trên Thẻ Câu Chuyện trong mỗi hộp Blind Box để thắp sáng mảnh ghép của bạn.
            </p>
          </div>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập mã (vd: hanoi, hcm)"
                className="w-full px-6 py-4 rounded-xl border border-foreground/10 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50 uppercase tracking-widest font-medium"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center text-white hover:bg-terracotta-hover transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            {unlocked.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-jade bg-jade/10 px-4 py-3 rounded-lg text-sm font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Mảnh ghép mới đã được thắp sáng!
              </motion.div>
            )}
          </form>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-foreground/5">
            <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-terracotta" />
              Bộ sưu tập của bạn
            </h3>
            {unlocked.length === 0 ? (
              <p className="text-foreground/50 text-sm font-light italic">Bạn chưa khám phá mảnh ghép nào.</p>
            ) : (
              <ul className="space-y-3">
                {unlocked.map((place, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-foreground/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold font-bold text-xs">{idx + 1}</span>
                    </div>
                    <span className="font-medium text-foreground">{place}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right side: Mock Map */}
        <div className="w-full lg:w-2/3 h-[600px] bg-white rounded-3xl shadow-xl border border-foreground/10 relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground to-transparent"></div>
          
          <div className="relative w-full h-full max-w-[500px] mx-auto">
            {/* Map Placeholder Image or SVG */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4e/Vietnam_blank_map.svg')] bg-contain bg-no-repeat bg-center opacity-10"></div>
            
            {/* Interactive Nodes */}
            <motion.div 
              animate={{ 
                backgroundColor: unlocked.includes("Hà Nội") ? "#c84b31" : "#e9ecef",
                scale: unlocked.includes("Hà Nội") ? 1.1 : 1,
                boxShadow: unlocked.includes("Hà Nội") ? "0 0 40px rgba(200, 75, 49, 0.4)" : "none"
              }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-700 absolute top-[15%] right-[30%] shadow-lg cursor-pointer group"
            >
              <span className={`font-serif font-bold z-10 ${unlocked.includes("Hà Nội") ? 'text-white' : 'text-foreground/30'}`}>Hà Nội</span>
              {unlocked.includes("Hà Nội") && (
                <div className="absolute w-full h-full bg-terracotta rounded-full animate-ping opacity-20"></div>
              )}
            </motion.div>

            <motion.div 
              animate={{ 
                backgroundColor: unlocked.includes("TP. Hồ Chí Minh") ? "#2d6a4f" : "#e9ecef",
                scale: unlocked.includes("TP. Hồ Chí Minh") ? 1.1 : 1,
                boxShadow: unlocked.includes("TP. Hồ Chí Minh") ? "0 0 40px rgba(45, 106, 79, 0.4)" : "none"
              }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-700 absolute bottom-[25%] right-[40%] shadow-lg cursor-pointer group"
            >
              <span className={`font-serif font-bold z-10 text-center leading-tight ${unlocked.includes("TP. Hồ Chí Minh") ? 'text-white' : 'text-foreground/30'}`}>TP.HCM</span>
              {unlocked.includes("TP. Hồ Chí Minh") && (
                <div className="absolute w-full h-full bg-jade rounded-full animate-ping opacity-20"></div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
