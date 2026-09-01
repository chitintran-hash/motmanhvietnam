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

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white text-sm shadow-md">M</div>
              Một Mảnh Việt Nam
            </h2>
            <p className="text-background/70 max-w-md mb-6 leading-relaxed font-light">
              Thương hiệu phụ kiện sưu tầm lấy cảm hứng từ địa danh, vùng đất, văn hóa và những ký ức đời thường của Việt Nam. Mang một mảnh Việt Nam theo bên mình.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-5 text-gold tracking-wide">Khám phá</h3>
            <ul className="space-y-3 font-light">
              <li><Link href="/collection" className="text-background/70 hover:text-white transition-colors">Bộ sưu tập</Link></li>
              <li><Link href="/map" className="text-background/70 hover:text-white transition-colors">Bản đồ Di sản</Link></li>
              <li><Link href="/pixel-memory" className="text-background/70 hover:text-white transition-colors">Pixel Memory</Link></li>
              <li><Link href="/about" className="text-background/70 hover:text-white transition-colors">Câu chuyện</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-5 text-gold tracking-wide">Liên hệ</h3>
            <ul className="space-y-4 font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm leading-relaxed">Khu vực Quận 7,<br/>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-terracotta shrink-0" />
                <span className="text-background/70 text-sm">hello@motmanhvietnam.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50 font-light">
          <p>© 2027 Một Mảnh Việt Nam. Dự án sinh viên.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
