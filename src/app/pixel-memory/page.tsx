"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Sparkles, Download } from "lucide-react";

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
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Pixel Memory</h1>
        <p className="text-foreground/70 font-light leading-relaxed text-lg max-w-2xl mx-auto mb-16">
          Biến bức ảnh kỷ niệm của bạn thành một mảnh ghép nghệ thuật Pixel. Mang phong cách của Một Mảnh Việt Nam.
        </p>

        <div className="bg-white rounded-3xl shadow-xl border border-foreground/10 p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <div className="w-24 h-24 rounded-full bg-terracotta/10 flex items-center justify-center mb-8">
                  <ImageIcon className="w-10 h-10 text-terracotta" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Tải ảnh của bạn lên</h3>
                <p className="text-foreground/50 mb-8 font-light">Định dạng JPG, PNG. Khuyên dùng ảnh phong cảnh hoặc chân dung rõ nét.</p>
                
                <label className="cursor-pointer group flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-hover transition-all w-full">
                  <Upload className="w-5 h-5" />
                  Chọn ảnh từ thiết bị
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
                <div className="w-full aspect-square bg-foreground/5 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-foreground/20 overflow-hidden relative">
                  {/* Mock Uploaded Image */}
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1000')" }}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="font-serif font-medium animate-pulse">Đang biến đổi thành Pixel Art...</p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-hover transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  Tạo Pixel Memory
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
                {/* Polaroid Frame */}
                <div className="bg-white p-6 pb-16 shadow-2xl rounded-sm mb-8 w-full max-w-[400px] relative">
                  <div className="w-full aspect-square bg-black mb-4 flex items-center justify-center overflow-hidden">
                    {/* Mock Pixelated Image */}
                    <img 
                      src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=10&w=100" 
                      className="w-full h-full object-cover" 
                      style={{ imageRendering: 'pixelated' }}
                      alt="Pixel Art"
                    />
                  </div>
                  <div className="absolute bottom-6 left-0 w-full text-center">
                    <span className="font-serif font-bold text-foreground/80 tracking-widest uppercase text-sm">Một Mảnh Việt Nam</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-foreground/10 rounded-full font-medium hover:bg-foreground/5 transition-colors"
                  >
                    Làm lại
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-hover transition-colors">
                    <Download className="w-5 h-5" />
                    Lưu ảnh
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
