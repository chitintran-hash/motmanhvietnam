"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, KeyRound, Sparkles, X, ArrowRight, CheckCircle2, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "next/navigation";

type CityKey = "Hà Nội" | "Đà Nẵng" | "Thành phố Hồ Chí Minh";

const DEFAULT_MAP_CONFIG: Record<string, any> = {
  "Hà Nội": {
    title: "Hà Nội",
    subtitle: "Một mảnh miền Bắc",
    description: "Hà Nội lưu giữ những lớp ký ức nằm giữa phố cũ, hàng quán, tiếng rao và những biểu tượng đã trở thành một phần đời sống người Việt.",
    exploreText: "KHÁM PHÁ HÀ NỘI",
    totalStories: 12,
    coords: { top: "17%", left: "42.5%" },
    unlockCodes: ["HANOI", "HN", "HOGUOM", "PHOCO"],
    stories: [
      { 
        id: "hn-1", 
        title: "Hồ Gươm", 
        desc: "Một biểu tượng nằm giữa nhịp sống của Hà Nội.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ho-guom.jpg",
        code: "HOGUOM",
        isFeatured: true
      },
      { 
        id: "hn-2", 
        title: "Phố cổ Hà Nội", 
        desc: "Những con phố nhỏ lưu giữ ký ức đô thị qua nhiều thế hệ.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-pho-co.jpg",
        code: "PHOCO",
        isFeatured: false
      },
      { 
        id: "hn-3", 
        title: "Cà phê vỉa hè", 
        desc: "Một thói quen đời thường nhưng rất Hà Nội.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ca-phe-via-he.jpg",
        code: "CAPHEVIAHE",
        isFeatured: false
      },
    ]
  },
  "Đà Nẵng": {
    title: "Đà Nẵng",
    subtitle: "Một mảnh miền Trung",
    description: "Thành phố nơi nhịp sống hiện đại gặp biển, núi và những ký ức miền Trung.",
    exploreText: "KHÁM PHÁ ĐÀ NẴNG",
    totalStories: 8,
    coords: { top: "57%", left: "70%" },
    unlockCodes: ["DANANG", "DN", "CAURONG", "MYKHE"],
    stories: [
      { 
        id: "dn-1", 
        title: "Cầu Rồng", 
        desc: "Biểu tượng mới của thành phố biển.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-cau-rong.jpg",
        code: "CAURONG",
        isFeatured: true
      },
      { 
        id: "dn-2", 
        title: "Biển Mỹ Khê", 
        desc: "Nơi đón những tia nắng sớm miền Trung.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-bien-my-khe.jpg",
        code: "MYKHE",
        isFeatured: false
      },
      { 
        id: "dn-3", 
        title: "Mì Quảng", 
        desc: "Hương vị đậm đà không thể trộn lẫn.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-mi-quang.jpg",
        code: "MIQUANG",
        isFeatured: false
      },
    ]
  },
  "Thành phố Hồ Chí Minh": {
    title: "Thành phố Hồ Chí Minh",
    subtitle: "Một mảnh miền Nam",
    description: "Những mảnh ký ức của một thành phố luôn chuyển động, nơi cũ và mới tồn tại cạnh nhau.",
    exploreText: "KHÁM PHÁ SÀI GÒN",
    totalStories: 15,
    coords: { top: "78.5%", left: "50.5%" },
    unlockCodes: ["HCM", "SAIGON", "BENTHANH", "CAPHESUADA", "BANHMI"],
    stories: [
      { 
        id: "sg-1", 
        title: "Chợ Bến Thành", 
        desc: "Nhịp đập giao thương không ngủ.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ben-thanh.jpg",
        code: "BENTHANH",
        isFeatured: true
      },
      { 
        id: "sg-2", 
        title: "Cà phê sữa đá", 
        desc: "Vị ngọt đắng quen thuộc mỗi sáng.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ca-phe-sua-da.jpg",
        code: "CAPHESUADA",
        isFeatured: false
      },
      { 
        id: "sg-3", 
        title: "Xe bánh mì", 
        desc: "Bữa ăn nhanh của nhịp sống hiện đại.", 
        img: "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-xe-banh-mi.jpg",
        code: "BANHMI",
        isFeatured: false
      },
    ]
  }
};

const MAP_CONFIG_URL = "https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/digital-map-config.json";

export default function MapPage() {
  const [mapData, setMapData] = useState<Record<string, any>>(DEFAULT_MAP_CONFIG);
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [featuredUnlock, setFeaturedUnlock] = useState<{ cityName: string; storyTitle: string; storyId: string } | null>(null);
  const pathname = usePathname();

  // Load custom map config from Supabase Storage
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`${MAP_CONFIG_URL}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.cities) {
            setMapData(data.cities);
          }
        }
      } catch (e) {
        // Fallback to default
      }
    }
    fetchConfig();
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setFeaturedUnlock(null);

    const input = code.toUpperCase().trim();
    if (!input) return;

    trackEvent('submit_unlock_code', {
      code_status: 'submitted',
      page_path: pathname
    });

    let matchedCityName: string | null = null;
    let matchedStory: any = null;

    // Search across all cities and their stories
    for (const [cityName, city] of Object.entries(mapData)) {
      // 1. Check if input matches specific story code
      if (Array.isArray(city.stories)) {
        for (const story of city.stories) {
          if (story.code && story.code.toUpperCase().trim() === input) {
            matchedCityName = cityName;
            matchedStory = story;
            break;
          }
        }
      }

      if (matchedCityName) break;

      // 2. Check if input matches city unlockCodes
      const codes = Array.isArray(city.unlockCodes) 
        ? city.unlockCodes.map((c: string) => c.toUpperCase().trim()) 
        : [];
      
      // Also match common shortcuts
      if (codes.includes(input) || (cityName.toUpperCase().includes(input))) {
        matchedCityName = cityName;
        // Find featured story in this city, or first story
        matchedStory = city.stories?.find((s: any) => s.isFeatured) || city.stories?.[0];
        break;
      }
    }

    if (matchedCityName) {
      if (!unlocked.includes(matchedCityName)) {
        setUnlocked(prev => [...prev, matchedCityName!]);
      }
      setActiveNode(matchedCityName);
      if (matchedStory) {
        setFeaturedUnlock({
          cityName: matchedCityName,
          storyTitle: matchedStory.title,
          storyId: matchedStory.id
        });
      }
      setCode("");
    } else {
      setError(true);
    }
  };

  const handleNodeClick = (city: string) => {
    setActiveNode(city);
    setFeaturedUnlock(null);
    trackEvent('click_map_location', {
      location_name: city,
      page_path: pathname
    });
  };

  const activeData = activeNode ? mapData[activeNode] : null;

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden flex flex-col items-center bg-cream">
      <div className="container mx-auto px-6 max-w-[1300px] relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
        
        {/* Left side: Passport / Form */}
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
                  placeholder="VD: HANOI, HCM, BENTHANH"
                  className="flex-1 px-4 py-4 border-2 border-primary-green bg-transparent focus:outline-none focus:ring-0 focus:border-primary-green uppercase tracking-[0.2em] font-mono font-bold text-primary-green placeholder-primary-green/30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-6 py-4 bg-primary-green text-cream hover:bg-primary-red transition-colors border-y-2 border-r-2 border-primary-green cursor-pointer"
                  title="Mở khóa"
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
                Bạn chưa khám phá mảnh ghép nào. Hãy nhập mã từ Thẻ Câu Chuyện!
              </p>
            ) : (
              <ul className="space-y-4">
                {unlocked.map((place, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleNodeClick(place)}
                    className="flex items-center justify-between p-3 border-2 border-primary-green bg-white shadow-[2px_2px_0px_rgba(46,91,70,1)] cursor-pointer hover:bg-primary-green/5 transition-colors"
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

        {/* Right side: Interactive Map Area */}
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
                  className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full"
                  onClick={() => handleNodeClick("Hà Nội")}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={`w-full h-full rounded-full transition-all relative flex items-center justify-center
                      ${unlocked.includes("Hà Nội") ? "bg-primary-red/25 border-2 border-primary-red shadow-[0_0_15px_rgba(219,68,55,0.7)]" : "bg-transparent"}
                      ${activeNode === "Hà Nội" ? "ring-4 ring-primary-red/60 scale-110 bg-primary-red/30 border-2 border-primary-red animate-pulse" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">HÀ NỘI</div>
                    <div className="text-[10px] text-foreground-muted">{mapData["Hà Nội"]?.totalStories || 12} mảnh ký ức đang chờ khám phá</div>
                  </div>
                </div>
              </div>

              {/* Da Nang Node */}
              <div 
                className="absolute top-[57%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
              >
                <div 
                  className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full"
                  onClick={() => handleNodeClick("Đà Nẵng")}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={`w-full h-full rounded-full transition-all relative flex items-center justify-center
                      ${unlocked.includes("Đà Nẵng") ? "bg-primary-red/25 border-2 border-primary-red shadow-[0_0_15px_rgba(219,68,55,0.7)]" : "bg-transparent"}
                      ${activeNode === "Đà Nẵng" ? "ring-4 ring-primary-red/60 scale-110 bg-primary-red/30 border-2 border-primary-red animate-pulse" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">ĐÀ NẴNG</div>
                    <div className="text-[10px] text-foreground-muted">{mapData["Đà Nẵng"]?.totalStories || 8} mảnh ký ức đang chờ khám phá</div>
                  </div>
                </div>
              </div>

              {/* TP. Hồ Chí Minh Node - Đã khoanh vòng đỏ CHÍNH XÁC vào vị trí ghim đỏ của TP HCM */}
              <div 
                className="absolute top-[78.5%] left-[50.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-20"
              >
                <div 
                  className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full"
                  onClick={() => handleNodeClick("Thành phố Hồ Chí Minh")}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={`w-full h-full rounded-full transition-all relative flex items-center justify-center
                      ${unlocked.includes("Thành phố Hồ Chí Minh") ? "bg-primary-red/25 border-2 border-primary-red shadow-[0_0_20px_rgba(219,68,55,0.8)]" : "bg-transparent"}
                      ${activeNode === "Thành phố Hồ Chí Minh" ? "ring-4 ring-primary-red/60 scale-110 bg-primary-red/30 border-2 border-primary-red animate-pulse shadow-[0_0_25px_rgba(219,68,55,0.9)]" : ""}
                    `}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 shadow-lg rounded-md border border-foreground/10 z-30">
                    <div className="font-display font-bold text-sm text-primary-green">TP HỒ CHÍ MINH</div>
                    <div className="text-[10px] text-foreground-muted">{mapData["Thành phố Hồ Chí Minh"]?.totalStories || 15} mảnh ký ức đang chờ khám phá</div>
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-display font-black uppercase text-primary-green leading-none mb-2">
                      {activeData.title}
                    </h2>
                    <span className="text-sm font-bold uppercase tracking-widest text-primary-red">
                      {activeData.subtitle}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveNode(null);
                      setFeaturedUnlock(null);
                    }}
                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground shrink-0 cursor-pointer"
                    aria-label="Close panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Banner chúc mừng mở khóa thành công địa điểm nổi bật */}
                {featuredUnlock && featuredUnlock.cityName === activeNode && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border-2 border-emerald-400 p-3.5 rounded-xl mb-4 text-emerald-900 flex items-center gap-2.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold">✨ Mở khóa thành công:</span> Mảnh ghép <strong className="text-emerald-800 underline uppercase">{featuredUnlock.storyTitle}</strong> đã được thắp sáng!
                    </div>
                  </motion.div>
                )}

                <p className="text-foreground-muted leading-relaxed mb-6 text-sm lg:text-base">
                  {activeData.description}
                </p>

                {/* Collection Status */}
                <div className={`px-4 py-3 rounded-xl border mb-6 text-sm ${unlocked.includes(activeNode) ? 'bg-primary-green/5 border-primary-green/20 text-primary-green font-bold' : 'bg-foreground/5 border-foreground/10 text-foreground-muted'}`}>
                  {unlocked.includes(activeNode) 
                    ? `✓ Bạn đã mở khóa mảnh ký ức tại ${activeData.title}`
                    : `Bạn chưa sở hữu mảnh ký ức nào tại ${activeData.title}.`}
                </div>

                {/* Story Preview Cards */}
                <div className="flex-1 flex flex-col gap-3 lg:gap-4 overflow-y-auto mb-6 pr-1">
                  {(activeData.stories || []).map((story: any, i: number) => {
                    const isNewlyUnlocked = featuredUnlock?.storyId === story.id;
                    const isFeatured = !!story.isFeatured;

                    return (
                      <div 
                        key={story.id || i}
                        className={`group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                          isNewlyUnlocked 
                            ? 'border-terracotta bg-terracotta/10 ring-2 ring-terracotta/30 shadow-md scale-102' 
                            : isFeatured
                              ? 'border-terracotta/40 bg-cream/70 hover:border-terracotta'
                              : 'border-foreground/10 hover:border-primary-green/30 hover:bg-cream/50'
                        }`}
                      >
                        {/* Image - Sử dụng img tag đảm bảo 100% hiển thị không bao giờ bị lỗi */}
                        <div className="w-16 h-16 shrink-0 bg-white rounded-lg border border-foreground/10 flex items-center justify-center overflow-hidden p-1 group-hover:scale-105 transition-transform duration-300 shadow-xs">
                          <img 
                            src={story.img} 
                            alt={story.title} 
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              (e.target as any).src = 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ben-thanh.jpg';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] text-foreground/40 font-mono font-bold">0{i + 1}</span>
                            {isFeatured && (
                              <span className="text-[9px] bg-terracotta text-white font-black uppercase px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-white" /> Nổi bật
                              </span>
                            )}
                            {isNewlyUnlocked && (
                              <span className="text-[9px] bg-emerald-600 text-white font-black uppercase px-1.5 py-0.2 rounded animate-pulse">
                                Vừa mở khóa
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-primary-green text-sm truncate">{story.title}</h4>
                          <p className="text-xs text-foreground-muted truncate">{story.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary-green transition-colors mr-2 shrink-0" />
                      </div>
                    );
                  })}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-foreground/10 flex flex-col items-center">
                  <div className="text-xs text-foreground/50 mb-3 font-medium">
                    {activeData.stories?.length || 3} / {activeData.totalStories || 15} mảnh đang được giới thiệu
                  </div>
                  <Link 
                    href="/collection"
                    className="w-full text-center bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest text-xs py-4 rounded-xl cursor-pointer"
                  >
                    {activeData.exploreText || "KHÁM PHÁ COLLECTION"} &rarr;
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
