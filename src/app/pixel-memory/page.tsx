"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Sparkles, Download, RefreshCw } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function PixelMemoryPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep(2); // Go to preview
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#E3DECE] -z-20"></div>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\' fill=\'%232a2a27\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
              CÔNG CỤ SÁNG TẠO
            </span>
            <div className="w-8 h-px bg-terracotta"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black text-foreground mb-6 uppercase tracking-tighter">
            PIXEL MEMORY
          </h1>
          <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl mx-auto">
            Biến bức ảnh kỷ niệm của bạn thành một tác phẩm nghệ thuật Pixel Art. Tạo ra mảnh ghép "ảo" của riêng bạn mang phong cách Một Mảnh Việt Nam.
          </p>
        </div>

        <div className="bg-[#F5F2EB] border-4 border-foreground shadow-[12px_12px_0px_rgba(42,42,39,1)] p-8 md:p-16 min-h-[500px] flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <div className="w-32 h-32 bg-white border-2 border-foreground shadow-[4px_4px_0px_rgba(42,42,39,1)] flex items-center justify-center mb-10 -rotate-3">
                  <ImageIcon className="w-12 h-12 text-terracotta" />
                </div>
                <h3 className="text-2xl font-display font-black mb-4 uppercase tracking-wider">TẢI ẢNH LÊN</h3>
                <p className="text-foreground-muted mb-10 font-medium">Hỗ trợ JPG, PNG. Ảnh phong cảnh hoặc chân dung rõ nét sẽ cho kết quả tốt nhất.</p>
                
                <label className="cursor-pointer group inline-flex items-center justify-center gap-3 px-10 py-5 bg-terracotta text-white font-bold tracking-widest text-sm uppercase hover:bg-terracotta-hover transition-all shadow-[6px_6px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] w-full">
                  <Upload className="w-5 h-5" />
                  CHỌN ẢNH TỪ THIẾT BỊ
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center w-full max-w-lg"
              >
                <div className="w-full aspect-square bg-foreground/5 mb-10 flex items-center justify-center border-4 border-foreground overflow-hidden relative shadow-[8px_8px_0px_rgba(42,42,39,1)]">
                  {/* Mock Uploaded Image */}
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1000')" }}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <Sparkles className="w-12 h-12 text-terracotta animate-pulse mb-6" />
                      <p className="font-display font-bold uppercase tracking-widest text-sm animate-pulse">ĐANG XỬ LÝ PIXEL ART...</p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-terracotta text-white font-bold tracking-widest text-sm uppercase hover:bg-terracotta-hover transition-all shadow-[6px_6px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  TẠO PIXEL MEMORY
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full max-w-lg"
              >
                {/* Polaroid Frame - Scrapbook Style */}
                <div className="bg-[#FAFAFA] p-6 pb-20 border-2 border-foreground shadow-[10px_10px_0px_rgba(42,42,39,1)] rounded-sm mb-12 w-full max-w-[400px] relative rotate-2">
                  <div className="absolute top-3 right-3">
                     <Badge variant="retro">MEMORIES</Badge>
                  </div>
                  <div className="w-full aspect-square bg-foreground mb-6 flex items-center justify-center overflow-hidden border-2 border-foreground/10">
                    {/* Mock Pixelated Image */}
                    <img 
                      src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=10&w=100" 
                      className="w-full h-full object-cover" 
                      style={{ imageRendering: 'pixelated' }}
                      alt="Pixel Art"
                    />
                  </div>
                  <div className="absolute bottom-8 left-0 w-full text-center flex flex-col items-center">
                    <span className="font-display font-black text-foreground tracking-widest uppercase text-lg">MỘT MẢNH VIỆT NAM</span>
                    <span className="font-mono text-[10px] text-foreground/50 mt-1">2027.PIXEL.001</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 w-full">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-foreground bg-transparent text-foreground font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    TẠO LẠI
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-terracotta text-white font-bold uppercase tracking-widest text-xs border-2 border-terracotta shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <Download className="w-4 h-4" />
                    LƯU ẢNH
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
