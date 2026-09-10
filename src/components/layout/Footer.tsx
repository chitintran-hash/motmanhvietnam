import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const socialLinks = {
  facebook: "https://facebook.com/motmanhvietnam",
  instagram: "https://instagram.com/motmanhvietnam"
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-[#F5F2EB] pt-20 pb-10 border-t-8 border-terracotta relative overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display font-black text-3xl mb-6 tracking-tighter uppercase">
              MỘT MẢNH <span className="text-[#FF4A32]">VIỆT NAM</span>
            </h2>
            <p className="text-[#F5F2EB]/70 max-w-md mb-8 leading-relaxed font-medium">
              Thương hiệu phụ kiện sưu tầm lấy cảm hứng từ địa danh, vùng đất, văn hóa và những ký ức đời thường của Việt Nam. Mang một mảnh Việt Nam theo bên mình.
            </p>
            <div className="flex gap-4">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-[#F5F2EB]/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-colors">
                <FacebookIcon />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-[#F5F2EB]/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-sm mb-6 text-gold tracking-widest uppercase">Khám phá</h3>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link href="/collection" className="text-[#F5F2EB]/70 hover:text-white hover:underline underline-offset-4 decoration-terracotta transition-all">KHÁM PHÁ SẢN PHẨM</Link></li>
              <li><Link href="/map" className="text-[#F5F2EB]/70 hover:text-white hover:underline underline-offset-4 decoration-terracotta transition-all">BẢN ĐỒ DI SẢN</Link></li>
              <li><Link href="/story-hub" className="text-[#F5F2EB]/70 hover:text-white hover:underline underline-offset-4 decoration-terracotta transition-all">STORY HUB</Link></li>
              <li><Link href="/team" className="text-[#F5F2EB]/70 hover:text-white hover:underline underline-offset-4 decoration-terracotta transition-all">ĐỘI NGŨ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-sm mb-6 text-gold tracking-widest uppercase">Liên hệ</h3>
            <ul className="space-y-5 font-medium">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#C1531A] shrink-0" />
                <span className="text-[#F5F2EB]/70 text-sm leading-relaxed">Quận 7, TP. Hồ Chí Minh,<br/>Việt Nam</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#C1531A] shrink-0" />
                <span className="text-[#F5F2EB]/70 text-sm">hello@motmanhvietnam.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#F5F2EB]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase text-[#F5F2EB]/40">
          <p>© 2027 MỘT MẢNH VIỆT NAM.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
