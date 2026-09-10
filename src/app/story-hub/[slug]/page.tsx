import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Map, ArrowRight } from "lucide-react";

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fake story data
  const story = {
    id: slug,
    name: "MỘT SÁNG HÀ NỘI",
    city: "Hà Nội",
    collectionNumber: "COLL_01",
    imageUrl: "https://illustrations.popsy.co/amber/home-office.svg",
    content: `
      Chiếc xe đạp chở đầy hoa cúc họa mi lướt qua những con phố rêu phong. Tiếng rao của cô bán xôi đầu ngõ hòa cùng hơi ấm của tách cà phê trứng... Đó là cách một ngày ở Hà Nội bắt đầu.
      
      Chúng tôi muốn thu nhỏ cái không khí trầm mặc, cổ kính nhưng vô cùng lãng mạn đó vào mảnh Hà Nội. Nếu bạn đã từng thức dậy sớm ở thủ đô, đi dạo một vòng hồ Gươm khi sương còn chưa tan hết, hẳn bạn sẽ hiểu vì sao người ta lại yêu Hà Nội đến thế.
    `
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative bg-[#F5F2EB]">
      {/* Texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-6 max-w-[1000px] relative z-10">
        <Link href="/story-hub" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-terracotta transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại Story Hub
        </Link>

        {/* Story Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 font-mono">{story.collectionNumber}</span>
            <div className="w-8 h-px bg-foreground/20"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">{story.city}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tighter mb-8 leading-none">
            {story.name}
          </h1>
          
          <div className="w-full aspect-video md:aspect-[21/9] bg-white border-2 border-foreground relative flex items-center justify-center p-8 shadow-[12px_12px_0px_rgba(42,42,39,1)]">
             <Image src={story.imageUrl} alt={story.name} fill className="object-contain p-8" />
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg md:prose-xl prose-p:text-foreground prose-p:font-medium prose-p:leading-relaxed max-w-none">
          {story.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-8">{paragraph.trim()}</p>
          ))}
        </div>

        {/* Story Footer CTAs */}
        <div className="mt-20 pt-10 border-t border-foreground/10 flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/collection/manh-ha-noi" className="group flex items-center justify-center gap-3 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-sm uppercase transition-all shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)]">
            Xem Sản Phẩm
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/map" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-foreground font-bold tracking-widest text-sm uppercase border border-foreground hover:bg-foreground/5 transition-colors">
            <Map className="w-4 h-4" />
            Vị trí trên bản đồ
          </Link>
        </div>
      </div>
    </div>
  );
}
