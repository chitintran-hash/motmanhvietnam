"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, MapPin, Puzzle, MessageSquareQuote, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutUsSection() {
  return (
    <section id="ve-chung-toi" className="py-28 md:py-36 bg-background relative overflow-hidden border-t border-foreground/10">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1300px] relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta border border-terracotta px-4 py-1.5 bg-[#F5F2EB] shadow-[2px_2px_0px_rgba(137,8,8,1)]">
              🇻🇳 VỀ CHÚNG TÔI
            </span>
            <div className="w-8 h-px bg-terracotta"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-foreground mb-8 uppercase tracking-tight leading-[1.2]"
          >
            Nếu chỉ được mang theo một nơi của Việt Nam bên mình,{" "}
            <span className="text-terracotta block mt-2">bạn sẽ chọn đâu?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-foreground-muted font-medium leading-relaxed max-w-3xl mx-auto"
          >
            <span className="text-foreground font-bold">✨ Một Mảnh Việt Nam</span> bắt đầu từ một câu hỏi rất đơn giản như thế. 
            Có người sẽ chọn quê hương. Có người chọn thành phố mình từng sống. Có người lại nhớ về một nơi chỉ vì một chuyến đi, một người đặc biệt hay một khoảnh khắc rất nhỏ nhưng vẫn ở lại thật lâu trong ký ức. 
            Từ những câu chuyện như vậy, Một Mảnh Việt Nam ra đời.
          </motion.p>
        </div>

        {/* Narrative Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Gần gũi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#F5F2EB] p-8 md:p-10 border-2 border-foreground/15 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] relative flex flex-col justify-between group hover:border-terracotta transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-6 text-gold">
                <Heart className="w-6 h-6 fill-current text-[#E6C36A]" />
              </div>
              <h3 className="font-display font-black text-xl text-foreground uppercase tracking-tight mb-4">
                💛 Gần Gũi Với Người Trẻ
              </h3>
              <p className="text-foreground-muted leading-relaxed font-medium">
                Chúng mình muốn kể về Việt Nam theo một cách gần gũi hơn với người trẻ. Không phải bằng những câu chuyện quá xa vời, mà bằng những điều quen thuộc có thể nhìn thấy, chạm vào và mang theo mỗi ngày.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/40">
              TRẢI NGHIỆM ĐỜI THƯỜNG
            </div>
          </motion.div>

          {/* Card 2: Ý nghĩa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#F5F2EB] p-8 md:p-10 border-2 border-foreground/15 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] relative flex flex-col justify-between group hover:border-primary-green transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-primary-green/15 flex items-center justify-center mb-6 text-primary-green">
                <MapPin className="w-6 h-6 text-primary-green" />
              </div>
              <h3 className="font-display font-black text-xl text-foreground uppercase tracking-tight mb-4">
                📍 Nơi Đó Có Ý Nghĩa Gì?
              </h3>
              <p className="text-foreground-muted leading-relaxed font-medium mb-3">
                Với chúng mình, giá trị của một nơi không chỉ nằm ở việc nơi đó nổi tiếng đến đâu. Điều quan trọng hơn là: <span className="font-bold text-foreground">Nơi đó có ý nghĩa gì với bạn?</span>
              </p>
              <p className="text-foreground-muted leading-relaxed font-medium text-sm">
                Mỗi người sẽ có một Việt Nam rất khác nhau. Có thể là một con phố quen, một chuyến đi cùng bạn bè, một buổi sáng ở quê nhà hay một nơi mình vẫn luôn muốn quay lại. 🌿
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/40">
              KÝ ỨC CÁ NHÂN
            </div>
          </motion.div>

          {/* Card 3: Ghép nối */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#F5F2EB] p-8 md:p-10 border-2 border-foreground/15 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] relative flex flex-col justify-between group hover:border-terracotta transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-terracotta/15 flex items-center justify-center mb-6 text-terracotta">
                <Puzzle className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display font-black text-xl text-foreground uppercase tracking-tight mb-4">
                🧩 Bức Tranh Lớn Hơn
              </h3>
              <p className="text-foreground-muted leading-relaxed font-medium">
                Khi những câu chuyện ấy được đặt cạnh nhau, chúng tạo nên một bức tranh lớn hơn về Việt Nam — một Việt Nam được tạo nên từ địa danh, ký ức và những kết nối rất riêng của mỗi người. Đó cũng là điều Một Mảnh Việt Nam muốn lưu giữ.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/40">
              KẾT NỐI DI SẢN
            </div>
          </motion.div>
        </div>

        {/* Reflection & Slogan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-foreground text-[#F5F2EB] p-8 md:p-12 border-4 border-foreground shadow-[8px_8px_0px_rgba(137,8,8,1)] relative overflow-hidden"
        >
          {/* Subtle gold noise */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-color-burn"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-4">
                <MessageSquareQuote className="w-4 h-4" />
                LỜI NGỎ TỪ CHÚNG MÌNH
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-white mb-3">
                💭 Một Mảnh Việt Nam của bạn là nơi nào?
              </h3>
              <p className="text-[#F5F2EB]/80 text-base md:text-lg font-medium leading-relaxed">
                Hãy kể cho chúng mình nghe câu chuyện phía sau địa danh đó. Mỗi góc nhìn, mỗi ký ức của bạn chính là một mảnh ghép quý giá làm trọn vẹn thêm hành trình này.
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
              <Link
                href="/story-hub"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-xs uppercase hover:bg-terracotta-hover transition-all shadow-[4px_4px_0px_rgba(230,195,106,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                GỬI CÂU CHUYỆN CỦA BẠN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="text-center lg:text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                  🇻🇳 MỘT MẢNH VIỆT NAM
                </p>
                <p className="text-xs italic text-[#F5F2EB]/70 font-serif mt-1">
                  “Mang một mảnh Việt Nam theo bên mình.”
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
