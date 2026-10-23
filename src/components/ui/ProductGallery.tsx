"use client";

import { useState, useEffect, useMemo } from "react";
import { ZoomIn, ZoomOut, Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

export default function ProductGallery({ mainImage, additionalImages = [] }: ProductGalleryProps) {
  const { t, lang } = useLanguage();

  const images = useMemo(() => {
    const list = [
      { 
        src: mainImage || "https://illustrations.popsy.co/amber/home-office.svg", 
        label: "",
        shortLabel: "",
        isMain: true 
      }
    ];

    if (Array.isArray(additionalImages)) {
      additionalImages.forEach((img, idx) => {
        if (img) {
          list.push({
            src: img,
            label: `${t("product.collectiblePiecePrefix", "MẢNH GHÉP SƯU TẦM")} #${idx + 1}`,
            shortLabel: `${t("product.pieceLabel", "Mảnh")} #${idx + 1}`,
            isMain: false
          });
        }
      });
    }

    return list;
  }, [mainImage, additionalImages, t]);

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
    <div className="w-full flex flex-col gap-5">
      {/* 1. KHUNG HIỂN THỊ CHÍNH (MAIN VIEWER) */}
      <div className="relative w-full aspect-square bg-[#FAF9F5] border-2 border-foreground/15 rounded-2xl shadow-[6px_6px_0px_rgba(42,42,39,0.08)] flex items-center justify-center transition-all duration-300 group overflow-hidden">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] pointer-events-none"></div>

        {/* Badge góc trái - Chỉ hiển thị cho các mảnh ghép */}
        {!currentItem.isMain && currentItem.shortLabel && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-terracotta text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {currentItem.shortLabel}
            </span>
          </div>
        )}

        {/* Nút phóng to góc phải */}
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm border border-foreground/10 text-foreground hover:bg-foreground hover:text-white rounded-full transition-all duration-200 shadow-sm flex items-center gap-1 text-xs font-bold cursor-pointer hover:scale-105"
          title={t("product.enlargeBtn", "Xem lớn")}
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">{t("product.enlargeBtn", "Xem lớn")}</span>
        </button>

        {/* Image Display */}
        <div 
          onClick={() => handleOpenModal()} 
          className={`relative w-full h-full cursor-zoom-in flex items-center justify-center ${
            currentItem.isMain ? 'p-0' : 'p-6 sm:p-8'
          }`}
        >
          <img 
            src={currentItem.src}
            alt={currentItem.label || "Product Image"}
            className={
              currentItem.isMain 
                ? "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                : "max-w-full max-h-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
            }
          />
        </div>

        {/* Label Bottom - Chỉ hiển thị cho các mảnh ghép */}
        {!currentItem.isMain && currentItem.label && (
          <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none px-4">
            <span className="inline-block px-4 py-1.5 rounded-full border shadow-sm text-xs font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm border-foreground/10 text-foreground">
              {currentItem.label}
            </span>
          </div>
        )}
      </div>

      {/* 2. CÁC MẢNH GHÉP BÊN DƯỚI (PIECE SELECTOR STRIP) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
              {images.length > 1 
                ? `${t("product.insidePiecesLabel", "Các mảnh bên trong hộp")} (${images.length - 1} ${t("product.pieceLabel", "mảnh").toLowerCase()}):` 
                : `${t("product.productImagesLabel", "Hình ảnh sản phẩm")}:`}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-foreground/50">
            {t("product.zoomTip", "💡 Nhấp để xem lớn")}
          </span>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
          {images.map((img, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onDoubleClick={() => handleOpenModal(idx)}
                className={`group relative aspect-square rounded-xl border-2 transition-all duration-200 overflow-hidden p-1.5 cursor-pointer flex flex-col items-center justify-center bg-white ${
                  isActive 
                    ? 'border-terracotta shadow-[0_0_0_2px_rgba(200,82,44,0.2)] scale-105 bg-terracotta/5' 
                    : 'border-foreground/10 hover:border-foreground/40 hover:scale-102 opacity-75 hover:opacity-100'
                }`}
                title={img.isMain ? (lang === 'en' ? "Main box" : "Hộp sản phẩm chính") : img.label}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={img.src}
                    alt={img.label || "Product"}
                    className={
                      img.isMain 
                        ? "w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-200" 
                        : "max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    }
                  />
                </div>

                {!img.isMain && (
                  <span className={`absolute bottom-1 inset-x-1 text-[9px] font-black uppercase tracking-wider py-0.5 rounded text-center truncate ${
                    isActive ? 'bg-terracotta text-white' : 'bg-foreground/80 text-white'
                  }`}>
                    {img.shortLabel}
                  </span>
                )}
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
              {!currentItem.isMain && currentItem.label && (
                <span className="bg-terracotta text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {currentItem.label}
                </span>
              )}
              <span className="text-white/60 text-xs font-mono">
                ({activeIndex + 1} / {images.length})
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalZoom((prev) => (prev === 1 ? 1.6 : prev === 1.6 ? 2.2 : 1))}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Zoom In / Zoom Out"
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
                title="Close (ESC)"
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
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-20 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm hover:scale-110"
                title="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm hover:scale-110"
                title="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div 
              className="relative max-h-[80vh] max-w-[85vw] flex items-center justify-center transition-transform duration-200 cursor-zoom-in"
              style={{ transform: `scale(${modalZoom})` }}
              onClick={() => setModalZoom((prev) => (prev === 1 ? 1.6 : 1))}
            >
              <img 
                src={currentItem.src}
                alt={currentItem.label || "Image"}
                className="max-h-[80vh] max-w-[85vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
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
                  activeIndex === idx ? 'border-terracotta scale-110 bg-white/25' : 'border-white/20 opacity-50 hover:opacity-100'
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
