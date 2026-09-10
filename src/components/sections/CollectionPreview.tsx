"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ui/ProductCard";

const mockProducts = [
  {
    slug: "manh-ha-noi",
    name: "MẢNH HÀ NỘI",
    city: "Hà Nội",
    collectionNumber: "COLL_01",
    price: "350,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/home-office.svg", // Placeholder
    isNew: true
  },
  {
    slug: "manh-sai-gon",
    name: "MẢNH SÀI GÒN",
    city: "Sài Gòn",
    collectionNumber: "COLL_01",
    price: "350,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/street-food.svg", // Placeholder
    isNew: true
  },
  {
    slug: "manh-da-nang",
    name: "MẢNH ĐÀ NẴNG",
    city: "Đà Nẵng",
    collectionNumber: "COLL_01",
    price: "350,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/surfer.svg", // Placeholder
    isNew: true
  }
];

export default function CollectionPreview() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">COLLECTION 01</span>
              <div className="w-12 h-px bg-terracotta/50"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-foreground mb-4 uppercase tracking-tight">
              Những Mảnh Đầu Tiên
            </h2>
            <p className="text-lg text-foreground-muted font-medium">
              Ba thành phố. Ba nhịp sống. Ba mảnh ký ức để bắt đầu hành trình khám phá Việt Nam.
            </p>
          </div>
          <Link href="/collection" className="group flex items-center gap-3 px-6 py-3 bg-transparent border-2 border-foreground text-foreground font-bold tracking-widest text-xs uppercase hover:bg-foreground hover:text-white transition-colors">
            Xem Toàn Bộ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
