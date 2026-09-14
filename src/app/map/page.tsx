"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, KeyRound, Sparkles, X, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "next/navigation";

type CityKey = "Hà Nội" | "Đà Nẵng" | "Thành phố Hồ Chí Minh";

const CITY_DATA = {
  "Hà Nội": {
    title: "Hà Nội",
    subtitle: "Một mảnh miền Bắc",
    description: "Hà Nội lưu giữ những lớp ký ức nằm giữa phố cũ, hàng quán, tiếng rao và những biểu tượng đã trở thành một phần đời sống người Việt.",
    exploreText: "KHÁM PHÁ HÀ NỘI",
    stories: [
      { id: "hn-1", title: "Hồ Gươm", desc: "Một biểu tượng nằm giữa nhịp sống của Hà Nội.", img: "https://illustrations.popsy.co/amber/student-going-to-school.svg" },
      { id: "hn-2", title: "Phố cổ Hà Nội", desc: "Những con phố nhỏ lưu giữ ký ức đô thị qua nhiều thế hệ.", img: "https://illustrations.popsy.co/amber/bicycle.svg" },
      { id: "hn-3", title: "Cà phê vỉa hè", desc: "Một thói quen đời thường nhưng rất Hà Nội.", img: "https://illustrations.popsy.co/amber/surreal-hourglass.svg" },
    ],
    totalStories: 12
  },
  "Đà Nẵng": {
    title: "Đà Nẵng",
    subtitle: "Một mảnh miền Trung",
    description: "Thành phố nơi nhịp sống hiện đại gặp biển, núi và những ký ức miền Trung.",
    exploreText: "KHÁM PHÁ ĐÀ NẴNG",
    stories: [
      { id: "dn-1", title: "Cầu Rồng", desc: "Biểu tượng mới của thành phố biển.", img: "https://illustrations.popsy.co/amber/shaking-hands.svg" },
      { id: "dn-2", title: "Biển Mỹ Khê", desc: "Nơi đón những tia nắng sớm miền Trung.", img: "https://illustrations.popsy.co/amber/taking-a-photo.svg" },
      { id: "dn-3", title: "Mì Quảng", desc: "Hương vị đậm đà không thể trộn lẫn.", img: "https://illustrations.popsy.co/amber/street-food.svg" },
    ],
    totalStories: 8
  },
  "Thành phố Hồ Chí Minh": {
    title: "Thành phố Hồ Chí Minh",
    subtitle: "Một mảnh miền Nam",
    description: "Những mảnh ký ức của một thành phố luôn chuyển động, nơi cũ và mới tồn tại cạnh nhau.",
    exploreText: "KHÁM PHÁ SÀI GÒN",
    stories: [
      { id: "sg-1", title: "Chợ Bến Thành", desc: "Nhịp đập giao thương không ngủ.", img: "https://illustrations.popsy.co/amber/key-to-success.svg" },
      { id: "sg-2", title: "Cà phê sữa đá", desc: "Vị ngọt đắng quen thuộc mỗi sáng.", img: "https://illustrations.popsy.co/amber/falling.svg" },
      { id: "sg-3", title: "Xe bánh mì", desc: "Bữa ăn nhanh của nhịp sống hiện đại.", img: "https://illustrations.popsy.co/amber/motorcycle.svg" },
    ],
    totalStories: 15
  }
};

export default function MapPage() {
  const [code, setCode] = useState("");
  // In the real app, we might need a map from 'code' -> 'CityKey'
  // But for now, user asked to keep the old form functionality working.
  const [unlocked, setUnlocked] = useState<CityKey[]>([]);
  const [error, setError] = useState(false);
  const [activeNode, setActiveNode] = useState<CityKey | null>(null);
  const pathname = usePathname();
  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    // Track unlock code submission
    trackEvent('submit_unlock_code', {
      code_status: 'submitted',
      page_path: pathname
    });

    const input = code.toLowerCase().trim();
    
    if (input === "hanoi") {
      if(!unlocked.includes("Hà Nội")) setUnlocked([...unlocked, "Hà Nội"]);
      setCode("");
    } else if (input === "hcm") {
      if(!unlocked.includes("Thành phố Hồ Chí Minh")) setUnlocked([...unlocked, "Thành phố Hồ Chí Minh"]);
      setCode("");
    } else if (input === "danang") {
      if(!unlocked.includes("Đà Nẵng")) setUnlocked([...unlocked, "Đà Nẵng"]);
      setCode("");
    } else {
      setError(true);
    }
  };

  const handleNodeClick = (city: CityKey) => {
    setActiveNode(city);
    trackEvent('click_map_location', {
      location_name: city,
      page_path: pathname
    });
  };

  const activeData = activeNode ? CITY_DATA[activeNode] : null;

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden flex flex-col items-center bg-cream">
      <div className="container mx-auto px-6 max-w-[1300px] relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
        
        {/* Left side: Passport / Form (Unchanged per requirements) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-8 shrink-0 lg:sticky lg:top-32">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-primary-green"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-green">
                PASSPORT
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-primary-green mb-4 uppercase tracking-tighter leading-[1.3] md:leading-[1.25]">
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
                  className="flex-1 px-4 py-4 border-2 border-primary-green bg-transparent focus:outline-none focus:ring-0 focus:border-primary-green uppercase tracking-[0.2em] font-mono font-bold text-primary-green placeholder-primary-green/30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-6 py-4 bg-primary-green text-cream hover:bg-primary-red transition-colors border-y-2 border-r-2 border-primary-green"
                >
                  <KeyRound className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="text-primary-red text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                   Mã không hợp lệ. Vui lòng thử lại.
                </p>
              )}
            </div>
          </form>

          <div className="bg-cream p-8 border-2 border-primary-green shadow-[6px_6px_0px_rgba(46,91,70,1)]">
            <div className="flex items-center justify-between border-b-2 border-primary-green/20 pb-4 mb-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 text-primary-green">
                <MapPin className="w-4 h-4 text-primary-green" />
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
                    className="flex items-center justify-between p-3 border-2 border-primary-green bg-white shadow-[2px_2px_0px_rgba(46,91,70,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-yellow text-navy text-[10px] font-black flex items-center justify-center uppercase tracking-tighter">
                        0{idx + 1}
                      </div>
                      <span className="font-bold font-display uppercase tracking-widest text-sm text-primary-green">{place}</span>
                    </div>
                    <Badge variant="retro">ĐÃ MỞ</Badge>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right side: Redesigned Interactive Map Area */}
        <div className="w-full lg:flex-1 relative flex flex-col lg:flex-row gap-6 items-start lg:items-stretch">
          
          {/* Map Container */}
          <div className="w-full lg:w-[480px] lg:shrink-0 relative overflow-hidden bg-cream mx-auto rounded-lg shadow-sm">
            {/* The base map image driving the container size */}
            <Image 
              src="/images/vietnam-map.jpg"
              alt="Bản đồ Việt Nam"
              width={600}
              height={900}
              quality={100}
              unoptimized
              className="w-full h-auto object-contain pointer-events-none"
            />
            
            {/* Interactive Nodes */}
            <div className="absolute inset-0 w-full h-full z-10">
              
              {/* Hanoi Node */}
              <div 
                className="absolute top-[17%] left-[42.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
              >
                <div 
                  className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full"
                  onClick={() => handleNodeClick("Hà Nội")}
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className={`w-full h-full rounded-full transition-all relative
                      ${unlocked.includes("Hà Nội") ? "bg-primary-red/30 shadow-[0_0_15px_rgba(219,68,55,0.6)]" : "bg-transparent"}
                      ${activeNode === "Hà Nội" ? "ring-4 ring-primary-red/50 scale-110 bg-primary-red/20" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">HÀ NỘI</div>
                    <div className="text-[10px] text-foreground-muted">{CITY_DATA["Hà Nội"].totalStories} mảnh ký ức đang chờ khám phá</div>
                  </div>
                </div>
              </div>

              {/* Da Nang Node */}
              <div 
                className="absolute top-[57%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
              >
                <div 
                  className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full"
                  onClick={() => handleNodeClick("Đà Nẵng")}
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className={`w-full h-full rounded-full transition-all relative
                      ${unlocked.includes("Đà Nẵng") ? "bg-primary-red/30 shadow-[0_0_15px_rgba(219,68,55,0.6)]" : "bg-transparent"}
                      ${activeNode === "Đà Nẵng" ? "ring-4 ring-primary-red/50 scale-110 bg-primary-red/20" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">ĐÀ NẴNG</div>
                    <div className="text-[10px] text-foreground-muted">{CITY_DATA["Đà Nẵng"].totalStories} mảnh ký ức đang chờ khám phá</div>
                  </div>
                </div>
              </div>

              {/* HCM Node */}
              <div 
                className="absolute top-[86%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
              >
                <div 
                  className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full"
                  onClick={() => handleNodeClick("Thành phố Hồ Chí Minh")}
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className={`w-full h-full rounded-full transition-all relative
                      ${unlocked.includes("Thành phố Hồ Chí Minh") ? "bg-primary-red/30 shadow-[0_0_15px_rgba(219,68,55,0.6)]" : "bg-transparent"}
                      ${activeNode === "Thành phố Hồ Chí Minh" ? "ring-4 ring-primary-red/50 scale-110 bg-primary-red/20" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">TP HỒ CHÍ MINH</div>
                    <div className="text-[10px] text-foreground-muted">{CITY_DATA["Thành phố Hồ Chí Minh"].totalStories} mảnh ký ức đang chờ khám phá</div>
                  </div>
                </div>
              </div>

            </div>


          </div>

          {/* Heritage Discovery Panel (Slide-in) */}
          <AnimatePresence mode="wait">
            {activeNode && activeData && (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full lg:flex-1 h-auto lg:h-[750px] bg-white border border-foreground/10 p-6 lg:p-8 flex flex-col rounded-lg lg:rounded-none shadow-sm lg:shadow-none"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-display font-black uppercase text-primary-green leading-none mb-2">
                      {activeData.title}
                    </h2>
                    <span className="text-sm font-bold uppercase tracking-widest text-primary-red">
                      {activeData.subtitle}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveNode(null)}
                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground shrink-0"
                    aria-label="Close panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-foreground-muted leading-relaxed mb-6 text-sm lg:text-base">
                  {activeData.description}
                </p>

                {/* Collection Status */}
                <div className={`px-4 py-3 rounded border mb-8 text-sm ${unlocked.includes(activeNode) ? 'bg-primary-green/5 border-primary-green/20 text-primary-green' : 'bg-foreground/5 border-foreground/10 text-foreground-muted'}`}>
                  {unlocked.includes(activeNode) 
                    ? `✓ Bạn đã sưu tập mảnh ký ức tại ${activeData.title}`
                    : `Bạn chưa sở hữu mảnh ký ức nào tại ${activeData.title}.`}
                </div>

                {/* Story Preview Cards */}
                <div className="flex-1 flex flex-col gap-3 lg:gap-4 overflow-y-auto mb-6">
                  {activeData.stories.map((story, i) => (
                    <div 
                      key={story.id}
                      className="group flex items-center gap-4 p-3 rounded-lg border border-foreground/10 hover:border-primary-green/30 hover:bg-cream/50 transition-all duration-300 cursor-pointer hover:shadow-sm"
                      style={{ transitionProperty: 'transform, border-color, background-color, box-shadow' }}
                    >
                      <div className="w-16 h-16 shrink-0 bg-cream rounded border border-foreground/5 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                        <Image src={story.img} alt={story.title} width={40} height={40} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                        <div className="text-[10px] text-foreground/40 font-mono font-bold mb-0.5">0{i + 1}</div>
                        <h4 className="font-bold text-primary-green text-sm truncate">{story.title}</h4>
                        <p className="text-xs text-foreground-muted truncate">{story.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary-green transition-colors mr-2 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-foreground/10 flex flex-col items-center">
                  <div className="text-xs text-foreground/50 mb-3 font-medium">
                    3 / {activeData.totalStories} mảnh đang được giới thiệu
                  </div>
                  <button className="w-full bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest text-xs py-4 rounded-md">
                    {activeData.exploreText} &rarr;
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
