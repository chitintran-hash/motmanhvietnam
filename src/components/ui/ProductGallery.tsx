"use client";

import { useState, useEffect, useMemo } from "react";
import { ZoomIn, ZoomOut, Maximize2, X, ChevronLeft, ChevronRight, Package, Sparkles } from "lucide-react";

interface ProductGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

export default function ProductGallery({ mainImage, additionalImages = [] }: ProductGalleryProps) {
  const images = useMemo(() => {
    const list = [
      { 
        src: mainImage || "https://illustrations.popsy.co/amber/home-office.svg", 
        label: "HỘP BLIND BOX (ẢNH CHÍNH)",
        shortLabel: "Hộp chính",
        isMain: true,
        isSecret: false
      }
    ];

    if (Array.isArray(additionalImages)) {
      additionalImages.forEach((img, idx) => {
        if (img) {
          list.push({
            src: img,
            label: `MẢNH GHÉP SƯU TẦM #${idx + 1}`,
            shortLabel: `Mảnh #${idx + 1}`,
            isMain: false,
            isSecret: false
          });
        }
      });
    }

    // Luôn có 1 Mảnh Secret Duy Nhất
    list.push({
      src: "/images/secret-chest-clean.png",
      label: "1 MẢNH SECRET DUY NHẤT (BÍ ẨN)",
      shortLabel: "Secret",
      isMain: false,
      isSecret: true
    });

    return list;
  }, [mainImage, additionalImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") {
        setIsModalOpen(false);
        setModalZoom(1);
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, images.length]);

  const currentItem = images[activeIndex] || images[0];

  const handleOpenModal = (index?: number) => {
    if (typeof index === "number") {
      setActiveIndex(index);
    }
    setModalZoom(1);
    setIsModalOpen(true);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setModalZoom(1);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setModalZoom(1);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. KHUNG HIỂN THỊ CHÍNH (MAIN VIEWER) */}
      <div className="relative w-full aspect-square bg-[#FAF9F5] border-2 border-foreground/15 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] flex items-center justify-center transition-all duration-300 group overflow-hidden">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] pointer-events-none"></div>

        {/* Badge góc trái */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {currentItem.isMain ? (
            <span className="inline-flex items-center gap-1.5 bg-foreground text-background text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Package className="w-3.5 h-3.5 text-terracotta" />
              HỘP BLIND BOX
            </span>
          ) : currentItem.isSecret ? (
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-terracotta text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              1 MẢNH SECRET DUY NHẤT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-terracotta text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {currentItem.shortLabel}
            </span>
          )}
        </div>

        {/* Nút phóng to góc phải */}
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm border border-foreground/10 text-foreground hover:bg-foreground hover:text-white rounded-full transition-all duration-200 shadow-sm flex items-center gap-1 text-xs font-bold cursor-pointer hover:scale-105"
          title="Phóng to ảnh xem chi tiết"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">Xem lớn</span>
        </button>

        {/* Image Display */}
        <div 
          onClick={() => handleOpenModal()} 
          className="relative w-[85%] h-[85%] cursor-zoom-in flex items-center justify-center"
        >
          <img 
            src={currentItem.src}
            alt={currentItem.label}
            className={`max-w-full max-h-full object-contain drop-shadow-xl transition-all duration-300 group-hover:scale-105 ${
              currentItem.isSecret ? 'filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]' : ''
            }`}
          />
        </div>

        {/* Label Bottom */}
        <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none px-4">
          <span className={`inline-block px-4 py-1.5 rounded-full border shadow-sm text-xs font-black uppercase tracking-wider ${
            currentItem.isSecret 
              ? 'bg-[#2A2A27] text-gold border-gold/40' 
              : 'bg-white/95 backdrop-blur-sm border-foreground/10 text-foreground'
          }`}>
            {currentItem.label}
          </span>
        </div>
      </div>

      {/* 2. CÁC MẢNH GHÉP BÊN DƯỚI (PIECE SELECTOR STRIP) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
              {images.length > 2 
                ? `Các mảnh bên trong hộp (${images.length - 2} mảnh thường + 1 SECRET):` 
                : images.length > 1 
                  ? `Các mảnh bên trong hộp (${images.length - 1} mảnh):` 
                  : 'Hình ảnh sản phẩm:'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-foreground/50">
            💡 Nhấp để xem lớn
          </span>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2.5">
          {images.map((img, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onDoubleClick={() => handleOpenModal(idx)}
                className={`group relative aspect-square rounded-xl border-2 transition-all duration-200 overflow-hidden p-1.5 cursor-pointer flex flex-col items-center justify-center ${
                  img.isSecret
                    ? isActive 
                      ? 'border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.4)] scale-105 bg-amber-50/60' 
                      : 'border-amber-500/50 bg-amber-50/20 hover:border-amber-500 hover:scale-102 opacity-85 hover:opacity-100'
                    : isActive 
                      ? 'border-terracotta shadow-[0_0_0_2px_rgba(200,82,44,0.2)] scale-105 bg-terracotta/5 bg-white' 
                      : 'border-foreground/10 hover:border-foreground/40 hover:scale-102 opacity-75 hover:opacity-100 bg-white'
                }`}
                title={`Nhấn để xem ${img.label}`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={img.src}
                    alt={img.label}
                    className={`max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-110 ${
                      img.isSecret ? 'drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : ''
                    }`}
                  />
                </div>

                <span className={`absolute bottom-1 inset-x-1 text-[9px] font-black uppercase tracking-wider py-0.5 rounded text-center truncate ${
                  img.isSecret
                    ? isActive ? 'bg-amber-600 text-white font-black' : 'bg-amber-700/90 text-white font-bold'
                    : isActive ? 'bg-terracotta text-white' : 'bg-foreground/80 text-white'
                }`}>
                  {img.isMain ? 'Hộp chính' : img.isSecret ? '✨ Secret' : `Mảnh #${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LIGHTBOX MODAL PHÓNG TO TOÀN MÀN HÌNH */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn"
          onClick={() => {
            setIsModalOpen(false);
            setModalZoom(1);
          }}
        >
          {/* Header Modal */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between z-20 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="bg-terracotta text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {currentItem.label}
              </span>
              <span className="text-white/60 text-xs font-mono hidden sm:inline">
                ({activeIndex + 1} / {images.length})
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalZoom((prev) => (prev === 1 ? 1.6 : prev === 1.6 ? 2.2 : 1))}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Phóng to / Thu nhỏ"
              >
                {modalZoom > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                <span className="hidden sm:inline">{modalZoom}x</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setModalZoom(1);
                }}
                className="p-2.5 bg-white/10 hover:bg-red-600 text-white rounded-full transition-colors"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Large Image Area */}
          <div 
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-20 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm hover:scale-110"
                title="Mảnh trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Arrow */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm hover:scale-110"
                title="Mảnh tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Large Image */}
            <div 
              className="relative max-h-[75vh] max-w-[85vw] flex items-center justify-center transition-transform duration-200 cursor-zoom-in"
              style={{ transform: `scale(${modalZoom})` }}
              onClick={() => setModalZoom((prev) => (prev === 1 ? 1.6 : 1))}
            >
              <img 
                src={currentItem.src}
                alt={currentItem.label}
                className="max-h-[75vh] max-w-[85vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          {/* Bottom Thumbnails in Modal */}
          <div 
            className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto p-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setModalZoom(1);
                }}
                className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white/10 p-1 ${
                  activeIndex === idx 
                    ? (img.isSecret ? 'border-amber-400 scale-110 bg-amber-500/20' : 'border-terracotta scale-110 bg-white/25') 
                    : (img.isSecret ? 'border-amber-400/50 opacity-70 hover:opacity-100' : 'border-white/20 opacity-50 hover:opacity-100')
                }`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
