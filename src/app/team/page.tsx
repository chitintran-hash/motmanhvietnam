"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const teamMembers = [
  { id: "member-01", name: "Nguyễn Văn A", role: "Creative Director", shortDesc: "Người kể chuyện bằng hình ảnh.", image: "https://illustrations.popsy.co/amber/student-going-to-school.svg" },
  { id: "member-02", name: "Trần Thị B", role: "Lead Designer", shortDesc: "Thổi hồn vào từng mảnh ghép.", image: "https://illustrations.popsy.co/amber/designer.svg" },
  { id: "member-03", name: "Lê Văn C", role: "Product Manager", shortDesc: "Người biến ý tưởng thành hiện thực.", image: "https://illustrations.popsy.co/amber/product-manager.svg" },
  { id: "member-04", name: "Phạm Thị D", role: "Content Strategist", shortDesc: "Kết nối những câu chuyện lịch sử.", image: "https://illustrations.popsy.co/amber/content-creator.svg" },
  { id: "member-05", name: "Hoàng Văn E", role: "Frontend Engineer", shortDesc: "Kiến trúc sư của không gian số.", image: "https://illustrations.popsy.co/amber/developer.svg" },
  { id: "member-06", name: "Ngô Thị F", role: "Marketing Lead", shortDesc: "Đưa Một Mảnh Việt Nam đi xa hơn.", image: "https://illustrations.popsy.co/amber/marketing-manager.svg" },
  { id: "member-07", name: "Bùi Văn G", role: "Operations", shortDesc: "Đảm bảo trải nghiệm mượt mà.", image: "https://illustrations.popsy.co/amber/office-worker.svg" },
  { id: "member-08", name: "Đặng Thị H", role: "Customer Success", shortDesc: "Người đồng hành cùng người sưu tầm.", image: "https://illustrations.popsy.co/amber/customer-support.svg" },
  { id: "member-09", name: "Vũ Văn I", role: "Research & Archive", shortDesc: "Người gìn giữ những ký ức.", image: "https://illustrations.popsy.co/amber/reading.svg" },
];

export default function TeamHubPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
              THE ARCHITECTS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-6 uppercase tracking-tighter">
            ĐỘI NGŨ<br/>MỘT MẢNH VIỆT NAM
          </h1>
          <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl border-l-2 border-foreground/10 pl-6">
            Mỗi thành viên mang đến một góc nhìn, kỹ năng và câu chuyện khác nhau để cùng tạo nên MỘT MẢNH VIỆT NAM. Khám phá những người đứng sau dự án.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#FAFAFA] border-2 border-foreground p-6 shadow-[8px_8px_0px_rgba(42,42,39,1)] hover:shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex flex-col group relative"
            >
              <div className="absolute top-4 right-4 w-10 h-10 border border-foreground/20 rounded-full flex items-center justify-center font-serif italic text-foreground/40 text-sm">
                0{index + 1}
              </div>
              
              <div className="relative w-full aspect-square mb-6 bg-[#F5F2EB] border border-foreground/10 flex items-center justify-center overflow-hidden">
                 <Image src={member.image} alt={member.name} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono mb-2">ARCHIVE_NO_0{index + 1}</span>
                <h3 className="font-display font-black text-3xl text-foreground uppercase tracking-wider mb-2">{member.name}</h3>
                <p className="text-sm font-bold text-terracotta uppercase tracking-widest mb-4">{member.role}</p>
                <div className="w-12 h-px bg-foreground/20 mb-4"></div>
                <p className="text-foreground-muted font-medium mb-8 flex-1 leading-relaxed">{member.shortDesc}</p>
                
                <Link href={`/team/${member.id}`} className="group/link flex items-center justify-between w-full p-4 border border-foreground/10 hover:border-terracotta bg-white transition-colors mt-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover/link:text-terracotta transition-colors">
                    HỒ SƠ CHI TIẾT
                  </span>
                  <ArrowRight className="w-5 h-5 text-foreground/40 group-hover/link:text-terracotta transform group-hover/link:translate-x-1 transition-all" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
