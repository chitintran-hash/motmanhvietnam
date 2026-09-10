"use client";
import { motion } from "framer-motion";
import StoryCard from "@/components/ui/StoryCard";

const stories = [
  {
    id: "hanoi-01",
    name: "MỘT SÁNG HÀ NỘI",
    city: "Hà Nội",
    collectionNumber: "COLL_01",
    excerpt: "Chiếc xe đạp chở đầy hoa cúc họa mi lướt qua những con phố rêu phong. Tiếng rao của cô bán xôi đầu ngõ hòa cùng hơi ấm của tách cà phê trứng... Đó là cách một ngày ở Hà Nội bắt đầu.",
    imageUrl: "https://illustrations.popsy.co/amber/home-office.svg"
  },
  {
    id: "saigon-01",
    name: "CƠN MƯA SÀI GÒN",
    city: "Sài Gòn",
    collectionNumber: "COLL_01",
    excerpt: "Đến nhanh và đi cũng vội. Cơn mưa chiều Sài Gòn làm dịu đi cái nóng oi ả, nhường chỗ cho những ngọn đèn đường vàng vọt hắt xuống dòng người hối hả ngược xuôi.",
    imageUrl: "https://illustrations.popsy.co/amber/street-food.svg"
  },
  {
    id: "hoian-01",
    name: "ĐÊM RẰM PHỐ HỘI",
    city: "Hội An",
    collectionNumber: "COLL_01",
    excerpt: "Khi cả khu phố cổ chìm trong ánh sáng lung linh của hàng ngàn chiếc đèn lồng giấy. Tiếng mái chèo khua nước trên sông Hoài như đưa ta về một miền ký ức xa xăm.",
    imageUrl: "https://illustrations.popsy.co/amber/plant.svg"
  }
];

export default function StoryHubPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F5F2EB] -z-20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
              ARCHIVE
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-6 uppercase tracking-tighter">
            STORY HUB
          </h1>
          <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl border-l-2 border-foreground/10 pl-6">
            Nơi lưu giữ những câu chuyện, ký ức và thông tin văn hóa đằng sau mỗi mảnh ghép. Khám phá những góc nhìn khác về Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StoryCard {...story} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
