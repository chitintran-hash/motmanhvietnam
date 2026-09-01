"use client";
import { motion } from "framer-motion";
import { PackageOpen, QrCode, Map as MapIcon } from "lucide-react";

const steps = [
  {
    icon: <PackageOpen className="w-8 h-8 text-terracotta" />,
    title: "1. Mở Hộp Bất Ngờ",
    description: "Nhận một Pin Di Sản ngẫu nhiên và Thẻ Câu Chuyện về một vùng đất của Việt Nam."
  },
  {
    icon: <QrCode className="w-8 h-8 text-jade" />,
    title: "2. Quét Mã Khám Phá",
    description: "Sử dụng mã QR trên Thẻ Câu Chuyện để truy cập nội dung số và câu chuyện chi tiết."
  },
  {
    icon: <MapIcon className="w-8 h-8 text-gold" />,
    title: "3. Thắp Sáng Bản Đồ",
    description: "Nhập mã định danh để mở khóa mảnh ghép của bạn trên Bản Đồ Việt Nam Số cá nhân."
  }
];

export default function Concept() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-bold mb-6"
          >
            Hành Trình Ký Ức
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 max-w-2xl mx-auto text-lg font-light"
          >
            Trải nghiệm không dừng lại ở việc mở hộp. Mỗi mảnh ghép là một chiếc chìa khóa mở ra không gian số, nơi bạn lưu giữ hành trình của riêng mình.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-background shadow-lg shadow-foreground/5 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">{step.title}</h3>
              <p className="text-foreground/70 font-light leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
