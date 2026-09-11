"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Map, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const carouselSlides = [
  {
    id: "hanoi",
    city: "HÀ NỘI",
    image: "/images/hanoi-hero.jpg",
  },
  {
    id: "saigon",
    city: "SÀI GÒN",
    image: "/images/saigon-hero.png",
  },
  {
    id: "danang",
    city: "ĐÀ NẴNG",
    image: "/images/danang-hero.png",
  }
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => setActiveSlide((p) => (p + 1) % carouselSlides.length);
  const prevSlide = () => setActiveSlide((p) => (p - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-center order-2 lg:order-1">


            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-display font-black text-foreground mb-8 leading-[1.2] md:leading-[1.15] tracking-tighter uppercase"
            >
              Mang một mảnh <br />
              <span className="text-terracotta relative inline-block">
                Việt Nam
              </span> <br />
              theo bên mình
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground-muted max-w-lg mb-12 font-medium leading-relaxed border-l-2 border-foreground/10 pl-6"
            >
              Những chiếc pin nhỏ lưu giữ câu chuyện về những thành phố, ký ức và khoảnh khắc rất Việt Nam.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/collection" className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary-red text-cream font-bold tracking-widest text-sm uppercase border border-primary-red hover:bg-[#A30D0D] transition-all shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                KHÁM PHÁ COLLECTION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/map" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-primary-green font-bold tracking-widest text-sm uppercase border border-primary-green hover:bg-primary-green hover:text-cream transition-all">
                <Map className="w-4 h-4" />
                MỞ BẢN ĐỒ DI SẢN
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Collector Desk Visuals (Carousel) */}
          <div className="relative h-[600px] lg:h-full w-full order-1 lg:order-2 flex flex-col items-center justify-center">
            
            {/* Carousel Container */}
            <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">
              <AnimatePresence initial={false} mode="popLayout">
                {carouselSlides.map((slide, index) => {
                  const isActive = index === activeSlide;
                  const isNext = index === (activeSlide + 1) % carouselSlides.length;
                  const isPrev = index === (activeSlide - 1 + carouselSlides.length) % carouselSlides.length;
                  
                  if (!isActive && !isNext && !isPrev && carouselSlides.length > 2) return null;

                  // Transforms based on position
                  let x = 0;
                  let scale = 1;
                  let zIndex = 0;
                  let rotate = 0;
                  let opacity = 1;

                  if (isActive) {
                    x = 0;
                    scale = 1;
                    zIndex = 30;
                    rotate = -2;
                    opacity = 1;
                  } else if (isNext) {
                    x = "65%";
                    scale = 0.85;
                    zIndex = 20;
                    rotate = 4;
                    opacity = 0.6;
                  } else if (isPrev) {
                    x = "-65%";
                    scale = 0.85;
                    zIndex = 20;
                    rotate = -6;
                    opacity = 0; // Hide previous to keep focus on next
                  }

                  return (
                    <motion.div
                      key={slide.id}
                      initial={false}
                      animate={{ x: `${x}`, scale, zIndex, rotate, opacity }}
                      transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                      className="absolute w-[80%] max-w-[380px] aspect-[4/5]"
                      onClick={() => isNext && nextSlide()}
                    >
                      {/* Scrapbook Frame */}
                      <div 
                        className={`w-full h-full bg-cream p-4 shadow-[10px_10px_30px_rgba(0,0,0,0.15)] relative ${isNext ? 'cursor-pointer' : ''}`}
                        style={{ 
                          borderRadius: "2% 3% 2% 4% / 3% 2% 4% 2%",
                          border: "1px solid rgba(0,0,0,0.05)"
                        }}
                      >
                        {/* Tape effect */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/70 backdrop-blur-sm -rotate-2 z-20" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "1px" }}></div>
                        
                        {/* Inner Image Area */}
                        <div className="relative w-full h-[85%] overflow-hidden bg-beige" style={{ borderRadius: "1% 2% 1% 2% / 2% 1% 2% 1%" }}>
                          <Image 
                            src={slide.image} 
                            alt={slide.city} 
                            fill 
                            className="object-cover sepia-[0.1] contrast-[1.1] saturate-[1.1] filter" 
                          />
                          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                        </div>

                        {/* Label & Stamp */}
                        <div className="absolute bottom-4 left-0 w-full flex justify-between items-center px-6">
                           <span className="font-display font-black text-3xl tracking-wider text-foreground/80">{slide.city}</span>
                           <div className="w-12 h-12 rounded-full border-2 border-primary-red/50 flex items-center justify-center rotate-[15deg] opacity-70">
                             <span className="text-[8px] font-bold text-primary-red uppercase text-center leading-none tracking-widest">Post<br/>VN</span>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Navigation and Pagination Container */}
            <div className="flex flex-col items-center mt-8 z-40 gap-6 w-full">
              {/* Arrows */}
              <div className="flex gap-4">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-cream backdrop-blur-sm border-2 border-foreground/10 flex items-center justify-center hover:bg-primary-red hover:text-cream hover:border-primary-red transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-cream backdrop-blur-sm border-2 border-foreground/10 flex items-center justify-center hover:bg-primary-red hover:text-cream hover:border-primary-red transition-colors shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-3">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeSlide ? "bg-primary-red scale-125" : "bg-foreground/20 hover:bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
