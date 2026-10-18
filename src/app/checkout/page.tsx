"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CheckCircle2, User, Phone, MapPin, Mail, FileText, AlertCircle, Loader2 } from "lucide-react";
import { getAuthSession, createOrder } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 1. Kiểm tra session
    getAuthSession().then((sess) => {
      setSession(sess);
      if (sess?.user) {
        setName(sess.user.name || "");
        setEmail(sess.user.email || "");
      }
      setCheckingAuth(false);
    });

    // 2. Load giỏ hàng
    const saved = localStorage.getItem("mm_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!session?.user) {
      setErrorMessage("Vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp tục thanh toán.");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên người nhận hàng.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại nhận hàng.");
      return;
    }

    // Kiểm tra định dạng số điện thoại Việt Nam (10 chữ số)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
      setErrorMessage("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số.");
      return;
    }

    if (!address.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ nhận hàng chi tiết.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Giỏ hàng của bạn đang trống.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customer_name: name,
        customer_email: email || session.user.email,
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
        items: items,
        total_amount: total
      });

      if (!res.success) {
        setErrorMessage(res.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        setIsSubmitting(false);
        return;
      }

      // Xóa giỏ hàng
      localStorage.removeItem("mm_cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Chuyển sang màn hình theo dõi đơn hàng
      router.push(`/orders/${res.orderId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Đã có lỗi kết nối. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          <span className="text-sm font-bold text-foreground/60 uppercase tracking-wider">
            Đang tải thông tin thanh toán...
          </span>
        </div>
      </div>
    );
  }

  // 1. Nếu chưa đăng nhập: Yêu cầu đăng ký hoặc đăng nhập
  if (!session?.user) {
    return (
      <div className="min-h-screen pt-40 pb-24 bg-[#FAF9F5] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border-2 border-foreground/15 rounded-2xl p-8 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] text-center">
          <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tight mb-3">
            Yêu cầu tài khoản
          </h2>

          <p className="text-sm text-foreground/70 font-medium mb-8 leading-relaxed">
            Để tiến hành thanh toán, lưu trữ thông tin giao hàng và theo dõi hành trình đơn hàng theo thời gian thực, bạn vui lòng đăng ký hoặc đăng nhập tài khoản.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/register?callbackUrl=/checkout"
              className="w-full py-3.5 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors shadow-sm"
            >
              Đăng ký tài khoản mới
            </Link>

            <Link
              href="/login?callbackUrl=/checkout"
              className="w-full py-3.5 bg-background-alt text-foreground font-bold text-xs uppercase tracking-widest rounded-xl border border-foreground/10 hover:bg-foreground hover:text-white transition-colors"
            >
              Đã có tài khoản? Đăng nhập
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-24 bg-[#FAF9F5] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border-2 border-foreground/15 rounded-2xl p-8 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] text-center">
          <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tight mb-3">
            Giỏ hàng trống
          </h2>
          <p className="text-sm text-foreground/70 font-medium mb-6">
            Bạn chưa chọn mảnh ghép nào trong giỏ hàng.
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF9F5]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        {/* Back Link & Header */}
        <div className="mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-terracotta transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
          </Link>

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              XÁC NHẬN ĐƠN HÀNG
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mt-2">
            THANH TOÁN ĐƠN HÀNG
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* 1. THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                <MapPin className="w-5 h-5 text-terracotta" />
                <h2 className="text-lg font-display font-black text-foreground uppercase tracking-wider">
                  1. THÔNG TIN GIAO HÀNG
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      Số điện thoại nhận hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      Email thông báo đơn hàng
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@vidu.com"
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                    className="w-full p-4 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao hàng giờ hành chính, gọi trước khi giao..."
                    className="w-full px-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. PHƯƠNG THỨC THANH TOÁN (COD) */}
            <div className="bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                <ShieldCheck className="w-5 h-5 text-jade" />
                <h2 className="text-lg font-display font-black text-foreground uppercase tracking-wider">
                  2. PHƯƠNG THỨC THANH TOÁN
                </h2>
              </div>

              {/* Lựa chọn COD */}
              <div className="border-2 border-terracotta bg-terracotta/5 rounded-xl p-5 flex items-start gap-4 cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 border-terracotta flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta"></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground text-sm uppercase tracking-wider">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-jade bg-jade/10 px-2.5 py-0.5 rounded-full">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 font-medium leading-relaxed">
                    Bạn chỉ thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận và kiểm tra bưu kiện. An toàn và tiện lợi 100%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_rgba(42,42,39,0.08)]">
              <h3 className="font-display font-black text-xl text-foreground uppercase tracking-wider mb-6 pb-4 border-b-2 border-foreground/10">
                ĐƠN HÀNG CỦA BẠN ({items.length} món)
              </h3>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2 border-b border-foreground/5 last:border-b-0">
                    <div className="relative w-16 h-16 bg-[#FAF9F5] border border-foreground/15 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-foreground/5 flex items-center justify-center text-xs font-bold text-foreground/40">
                          Hộp
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-wide truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-foreground/60 font-medium">
                        Số lượng: x{item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-foreground text-right shrink-0">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))}
              </div>

              {/* Phí và tổng tiền */}
              <div className="space-y-3 border-t-2 border-foreground/10 pt-4 mb-6 text-sm">
                <div className="flex justify-between items-center text-foreground/70 font-medium">
                  <span>Tạm tính</span>
                  <span className="font-bold text-foreground">{subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between items-center text-foreground/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-terracotta" />
                    Phí vận chuyển toàn quốc
                  </span>
                  <span className="font-bold text-foreground">{shipping.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="border-t border-dashed border-foreground/15 pt-3 flex justify-between items-baseline">
                  <span className="font-black text-foreground uppercase tracking-wider text-base">
                    TỔNG CỘNG
                  </span>
                  <span className="text-2xl md:text-3xl font-display font-black text-terracotta">
                    {total.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-terracotta text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-all shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>ĐANG XỬ LÝ ĐẶT HÀNG...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>XÁC NHẬN ĐẶT HÀNG (COD)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-foreground/50 text-center mt-4 font-medium leading-relaxed">
                Bằng việc nhấn đặt hàng, bạn đồng ý với các điều khoản mua sắm và chính sách vận chuyển của Một Mảnh Việt Nam.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
