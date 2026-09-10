"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, KeyRound, Sparkles, X, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";

export default function MapPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const input = code.toLowerCase().trim();
    
    if (input === "hanoi") {
      if(!unlocked.includes("Hà Nội")) setUnlocked([...unlocked, "Hà Nội"]);
      setCode("");
    } else if (input === "hcm") {
      if(!unlocked.includes("Sài Gòn")) setUnlocked([...unlocked, "Sài Gòn"]);
      setCode("");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden flex flex-col items-center">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\' fill=\'%232a2a27\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10 flex flex-col lg:flex-row gap-16 items-start">
        {/* Left side: Passport / Form */}
        <div className="w-full lg:w-[400px] flex flex-col gap-8 shrink-0 lg:sticky lg:top-32">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-terracotta"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
                PASSPORT
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-foreground mb-4 uppercase tracking-tighter leading-[1.2] md:leading-[1.15]">
              BẢN ĐỒ<br/>DI SẢN
            </h1>
            <p className="text-foreground-muted font-medium leading-relaxed border-l-2 border-foreground/10 pl-4">
              Nhập mã bí mật trên Thẻ Câu Chuyện trong Blind Box để thắp sáng mảnh ghép của bạn.
            </p>
          </div>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                MÃ MỞ KHÓA
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="VD: HANOI, HCM"
                  className="flex-1 px-4 py-4 border-2 border-foreground bg-transparent focus:outline-none focus:ring-0 focus:border-terracotta uppercase tracking-[0.2em] font-mono font-bold text-foreground"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-6 py-4 bg-foreground text-white hover:bg-terracotta transition-colors border-y-2 border-r-2 border-foreground"
                >
                  <KeyRound className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="text-terracotta text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                   Mã không hợp lệ. Vui lòng thử lại.
                </p>
              )}
            </div>
          </form>

          <div className="bg-[#F5F2EB] p-8 border-2 border-foreground shadow-[6px_6px_0px_rgba(42,42,39,1)]">
            <div className="flex items-center justify-between border-b-2 border-foreground/10 pb-4 mb-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta" />
                BỘ SƯU TẬP
              </h3>
              <span className="font-mono font-bold text-foreground/50">
                {unlocked.length}/64
              </span>
            </div>
            
            {unlocked.length === 0 ? (
              <p className="text-foreground/50 text-sm font-medium italic">
                Bạn chưa khám phá mảnh ghép nào.
              </p>
            ) : (
              <ul className="space-y-4">
                {unlocked.map((place, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 border border-foreground/20 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gold text-background text-[10px] font-bold flex items-center justify-center uppercase tracking-tighter">
                        0{idx + 1}
                      </div>
                      <span className="font-bold font-display uppercase tracking-widest text-sm text-foreground">{place}</span>
                    </div>
                    <Badge variant="retro">ĐÃ MỞ</Badge>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right side: Stylized Map */}
        <div className="w-full flex-1 h-[600px] lg:h-[800px] bg-[#E3DECE] border-4 border-foreground relative flex items-center justify-center p-8 overflow-hidden shadow-2xl">
          {/* Stylized Grid Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0V0zm20 20h60v60H20V20zM0 20h100v20H0V20z\' fill=\'%232a2a27\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] pointer-events-none"></div>
          
          <div className="absolute top-4 right-4 bg-foreground text-background px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase">
            LAT: 14.0583° N / LNG: 108.2772° E
          </div>

          <div className="relative w-full h-full max-w-[600px] mx-auto flex items-center justify-center">
            {/* Base Map Placeholder - Using a highly stylized dotted SVG approach */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               {/* Placeholder for actual stylized SVG map */}
               <div className="w-full h-full flex items-center justify-center">
                 <div className="w-[40%] h-[80%] bg-foreground/30 blur-3xl rounded-full"></div>
               </div>
            </div>
            
            {/* Interactive Nodes */}
            <div className="relative w-full h-full max-w-[400px] mx-auto">
              {/* Hanoi Node */}
              <motion.div 
                onClick={() => setActiveNode("Hà Nội")}
                animate={{ 
                  scale: unlocked.includes("Hà Nội") ? 1 : 0.8,
                  opacity: unlocked.includes("Hà Nội") ? 1 : 0.5
                }}
                className="absolute top-[20%] right-[35%] cursor-pointer group flex flex-col items-center"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${unlocked.includes("Hà Nội") ? 'bg-terracotta border-terracotta' : 'bg-transparent border-foreground/30 border-dashed'} transition-colors relative z-10`}>
                  {unlocked.includes("Hà Nội") ? (
                    <Sparkles className="w-5 h-5 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
                  )}
                </div>
                <span className={`mt-2 font-display font-bold text-xs uppercase tracking-widest ${unlocked.includes("Hà Nội") ? 'text-terracotta' : 'text-foreground/50'}`}>Hà Nội</span>
                {unlocked.includes("Hà Nội") && (
                  <div className="absolute top-0 w-12 h-12 bg-terracotta rounded-full animate-ping opacity-20"></div>
                )}
              </motion.div>

              {/* HCM Node */}
              <motion.div 
                onClick={() => setActiveNode("Sài Gòn")}
                animate={{ 
                  scale: unlocked.includes("Sài Gòn") ? 1 : 0.8,
                  opacity: unlocked.includes("Sài Gòn") ? 1 : 0.5
                }}
                className="absolute bottom-[20%] right-[45%] cursor-pointer group flex flex-col items-center"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${unlocked.includes("Sài Gòn") ? 'bg-jade border-jade' : 'bg-transparent border-foreground/30 border-dashed'} transition-colors relative z-10`}>
                  {unlocked.includes("Sài Gòn") ? (
                    <Sparkles className="w-5 h-5 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-foreground/30 rounded-full"></div>
                  )}
                </div>
                <span className={`mt-2 font-display font-bold text-xs uppercase tracking-widest ${unlocked.includes("Sài Gòn") ? 'text-jade' : 'text-foreground/50'}`}>Sài Gòn</span>
                {unlocked.includes("Sài Gòn") && (
                  <div className="absolute top-0 w-12 h-12 bg-jade rounded-full animate-ping opacity-20"></div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel for Node Details */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#FAFAFA] border-l-4 border-foreground z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-foreground/10">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 font-mono">TRẠM DỪNG</span>
              <button onClick={() => setActiveNode(null)} className="p-2 hover:bg-foreground/5 transition-colors">
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="w-full aspect-square bg-[#F5F2EB] border border-foreground/10 mb-8 flex items-center justify-center p-8">
                <Image 
                  src={activeNode === 'Hà Nội' ? "https://illustrations.popsy.co/amber/home-office.svg" : "https://illustrations.popsy.co/amber/street-food.svg"} 
                  alt={activeNode}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              
              <h2 className="font-display font-black text-4xl uppercase tracking-tighter mb-4">{activeNode}</h2>
              <p className="text-foreground-muted font-medium mb-8 leading-relaxed">
                {activeNode === 'Hà Nội' 
                  ? "Chiếc xe đạp chở đầy hoa cúc họa mi lướt qua những con phố rêu phong. Tiếng rao của cô bán xôi đầu ngõ hòa cùng hơi ấm của tách cà phê trứng... Đó là cách một ngày ở Hà Nội bắt đầu."
                  : "Đến nhanh và đi cũng vội. Cơn mưa chiều Sài Gòn làm dịu đi cái nóng oi ả, nhường chỗ cho những ngọn đèn đường vàng vọt hắt xuống dòng người hối hả ngược xuôi."
                }
              </p>

              <div className="space-y-4">
                <Link href={`/collection/manh-${activeNode === 'Hà Nội' ? 'ha-noi' : 'sai-gon'}`} className="w-full flex items-center justify-between p-4 bg-foreground text-white hover:bg-terracotta transition-colors group">
                  <span className="text-xs font-bold uppercase tracking-widest">XEM SẢN PHẨM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={`/story-hub/${activeNode === 'Hà Nội' ? 'hanoi-01' : 'saigon-01'}`} className="w-full flex items-center justify-between p-4 border-2 border-foreground bg-transparent text-foreground hover:bg-foreground/5 transition-colors group">
                  <span className="text-xs font-bold uppercase tracking-widest">ĐỌC CÂU CHUYỆN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeNode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveNode(null)}
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
        />
      )}
    </div>
  );
}
