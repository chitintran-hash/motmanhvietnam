"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CheckCircle2, User, Phone, MapPin, Mail, AlertCircle, Loader2, Sparkles, Building2, Home, ChevronDown } from "lucide-react";
import { getAuthSession, createOrder } from "./actions";
import { useLanguage } from "@/context/LanguageContext";
import { 
  VIETNAM_PROVINCES, 
  POPULAR_PROVINCES, 
  POPULAR_DISTRICTS, 
  getDistricts, 
  fetchWards, 
  District, 
  Ward 
} from "@/lib/vietnam-address";

export default function CheckoutPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  // Detailed address states
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | "">("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [districtsList, setDistrictsList] = useState<District[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | "">("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [wardsList, setWardsList] = useState<Ward[]>([]);
  const [selectedWardCode, setSelectedWardCode] = useState<number | "">("");
  const [selectedWardName, setSelectedWardName] = useState("");
  const [loadingWards, setLoadingWards] = useState(false);
  const [isManualWard, setIsManualWard] = useState(false);
  const [manualWard, setManualWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectProvince = (codeStr: string) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedProvinceCode("");
      setSelectedProvinceName("");
      setDistrictsList([]);
      setSelectedDistrictCode("");
      setSelectedDistrictName("");
      setWardsList([]);
      setSelectedWardCode("");
      setSelectedWardName("");
      setManualWard("");
      return;
    }
    const prov = VIETNAM_PROVINCES.find((p) => p.code === code);
    if (prov) {
      setSelectedProvinceCode(code);
      setSelectedProvinceName(prov.name);
      const districts = getDistricts(code);
      setDistrictsList(districts);
      setSelectedDistrictCode("");
      setSelectedDistrictName("");
      setWardsList([]);
      setSelectedWardCode("");
      setSelectedWardName("");
      setManualWard("");
    }
  };

  const handleSelectDistrict = (codeStr: string) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedDistrictCode("");
      setSelectedDistrictName("");
      setWardsList([]);
      setSelectedWardCode("");
      setSelectedWardName("");
      setManualWard("");
      return;
    }
    const dist = districtsList.find((d) => d.code === code);
    if (dist) {
      setSelectedDistrictCode(code);
      setSelectedDistrictName(dist.name);
      setSelectedWardCode("");
      setSelectedWardName("");
      setManualWard("");
      setLoadingWards(true);
      fetchWards(code).then((wards) => {
        setWardsList(wards);
        setLoadingWards(false);
      });
    }
  };

  const handleSelectWard = (codeStr: string) => {
    const code = Number(codeStr);
    if (!code) {
      setSelectedWardCode("");
      setSelectedWardName("");
      return;
    }
    const w = wardsList.find((item) => item.code === code);
    if (w) {
      setSelectedWardCode(code);
      setSelectedWardName(w.name);
      setIsManualWard(false);
    }
  };

  const effectiveWard = isManualWard ? manualWard.trim() : selectedWardName;
  const addressParts = [
    streetAddress.trim(),
    effectiveWard,
    selectedDistrictName,
    selectedProvinceName
  ].filter(Boolean);
  const fullAddress = addressParts.join(", ");

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
      setErrorMessage(t("checkout.errRequireAuth", "Vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp tục thanh toán."));
      return;
    }

    if (!name.trim()) {
      setErrorMessage(t("checkout.errName", "Vui lòng nhập họ và tên người nhận hàng."));
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(t("checkout.errPhone", "Vui lòng nhập số điện thoại nhận hàng."));
      return;
    }

    // Kiểm tra định dạng số điện thoại Việt Nam (10 chữ số)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
      setErrorMessage(t("checkout.errPhoneInvalid", "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số."));
      return;
    }

    if (!selectedProvinceName) {
      setErrorMessage(t("checkout.errProvince", "Vui lòng chọn Tỉnh / Thành phố nhận hàng."));
      return;
    }

    if (!selectedDistrictName) {
      setErrorMessage(t("checkout.errDistrict", "Vui lòng chọn Quận / Huyện nhận hàng."));
      return;
    }

    if (!effectiveWard) {
      setErrorMessage(t("checkout.errWard", "Vui lòng chọn hoặc nhập Phường / Xã nhận hàng."));
      return;
    }

    if (!streetAddress.trim()) {
      setErrorMessage(t("checkout.errStreetAddress", "Vui lòng nhập số nhà, tên đường cụ thể."));
      return;
    }

    if (!fullAddress.trim()) {
      setErrorMessage(t("checkout.errAddress", "Vui lòng nhập địa chỉ nhận hàng chi tiết."));
      return;
    }

    if (items.length === 0) {
      setErrorMessage(t("checkout.errEmptyCart", "Giỏ hàng của bạn đang trống."));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customer_name: name,
        customer_email: email || session.user.email,
        phone: phone.trim(),
        address: fullAddress,
        note: note.trim(),
        items: items,
        total_amount: total
      });

      if (!res.success) {
        setErrorMessage(res.message || t("checkout.errFailed", "Đặt hàng thất bại. Vui lòng thử lại."));
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
      setErrorMessage(t("checkout.errFailed", "Đã có lỗi kết nối. Vui lòng thử lại sau."));
      setIsSubmitting(false);
    }
  };

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          <span className="text-sm font-bold text-foreground/60 uppercase tracking-wider">
            {t("checkout.loading", "Đang tải thông tin thanh toán...")}
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
            {t("checkout.authRequiredTitle", "Yêu cầu tài khoản")}
          </h2>

          <p className="text-sm text-foreground/70 font-medium mb-8 leading-relaxed">
            {t("checkout.authRequiredDesc", "Để tiến hành thanh toán, lưu trữ thông tin giao hàng và theo dõi hành trình đơn hàng theo thời gian thực, bạn vui lòng đăng ký hoặc đăng nhập tài khoản.")}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/register?callbackUrl=/checkout"
              className="w-full py-3.5 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors shadow-sm"
            >
              {t("checkout.registerNow", "Đăng ký tài khoản mới")}
            </Link>

            <Link
              href="/login?callbackUrl=/checkout"
              className="w-full py-3.5 bg-background-alt text-foreground font-bold text-xs uppercase tracking-widest rounded-xl border border-foreground/10 hover:bg-foreground hover:text-white transition-colors"
            >
              {t("checkout.loginNow", "Đã có tài khoản? Đăng nhập")}
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {t("checkout.backToCart", "Quay lại giỏ hàng")}
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
            {t("cart.emptyTitle", "Giỏ hàng trống")}
          </h2>
          <p className="text-sm text-foreground/70 font-medium mb-6">
            {t("cart.emptyDesc", "Bạn chưa chọn mảnh ghép nào trong giỏ hàng.")}
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors"
          >
            {t("cart.exploreBtn", "Khám phá bộ sưu tập")}
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
            <ArrowLeft className="w-4 h-4" /> {t("checkout.backToCart", "Quay lại giỏ hàng")}
          </Link>

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              {t("checkout.badge", "XÁC NHẬN ĐƠN HÀNG")}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mt-2">
            {t("checkout.title", "THANH TOÁN ĐƠN HÀNG")}
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
                  {t("checkout.step1", "1. THÔNG TIN GIAO HÀNG")}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    {t("checkout.fullName", "Họ và tên người nhận")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("checkout.fullNamePlaceholder", "Nguyễn Văn A")}
                      className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      {t("checkout.phone", "Số điện thoại nhận hàng")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("checkout.phonePlaceholder", "0912 345 678")}
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      {t("checkout.email", "Email thông báo đơn hàng")}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("checkout.emailPlaceholder", "email@vidu.com")}
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* CHỌN ĐỊA CHỈ GIAO HÀNG CHI TIẾT */}
                <div className="pt-2 border-t border-foreground/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                      {t("checkout.address", "Địa chỉ giao hàng chi tiết")} <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-bold text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-md border border-terracotta/20">
                      Chuẩn xác 4 cấp
                    </span>
                  </div>

                  {/* 1. GỢI Ý CHỌN NHANH TỈNH / THÀNH PHỐ */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/60 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                      <span>{t("checkout.quickSuggestTitle", "Gợi ý chọn nhanh Tỉnh / Thành phố:")}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_PROVINCES.map((p) => {
                        const isSelected = selectedProvinceCode === p.code;
                        return (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleSelectProvince(p.code.toString())}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isSelected
                                ? "bg-terracotta text-white border-terracotta shadow-sm scale-105"
                                : "bg-[#FAF9F5] text-foreground/80 border-foreground/15 hover:border-terracotta hover:bg-white"
                            }`}
                          >
                            <span>{p.icon}</span>
                            <span>{p.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. CHỌN TỈNH/THÀNH VÀ QUẬN/HUYỆN (GRID 2 CỘT) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tỉnh / Thành phố */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                        {t("checkout.province", "Tỉnh / Thành phố")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={selectedProvinceCode}
                          onChange={(e) => handleSelectProvince(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">{t("checkout.provincePlaceholder", "-- Chọn Tỉnh / Thành phố --")}</option>
                          <optgroup label="Tỉnh / Thành phố trực thuộc Trung ương">
                            {POPULAR_PROVINCES.map((p) => (
                              <option key={`pop-${p.code}`} value={p.code}>
                                {p.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Tất cả 63 Tỉnh / Thành">
                            {VIETNAM_PROVINCES.map((p) => (
                              <option key={p.code} value={p.code}>
                                {p.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <ChevronDown className="w-4 h-4 text-foreground/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Quận / Huyện */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                        {t("checkout.district", "Quận / Huyện")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          disabled={!selectedProvinceCode}
                          value={selectedDistrictCode}
                          onChange={(e) => handleSelectDistrict(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <option value="">
                            {selectedProvinceCode
                              ? t("checkout.districtPlaceholder", "-- Chọn Quận / Huyện --")
                              : t("checkout.selectProvinceFirst", "-- Chọn Tỉnh/Thành trước --")}
                          </option>
                          {districtsList.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-foreground/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* GỢI Ý QUẬN/HUYỆN TRUNG TÂM CHO TỈNH ĐANG CHỌN (NẾU CÓ) */}
                  {selectedProvinceCode && POPULAR_DISTRICTS[Number(selectedProvinceCode)] && (
                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-foreground/10">
                      <div className="text-[11px] font-bold text-foreground/60 mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-terracotta" />
                        <span>{t("checkout.quickDistrictTitle", "Gợi ý Quận / Huyện trung tâm:")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_DISTRICTS[Number(selectedProvinceCode)].map((distName) => {
                          const matchedDistrict = districtsList.find((d) => d.name === distName);
                          if (!matchedDistrict) return null;
                          const isSelected = selectedDistrictCode === matchedDistrict.code;
                          return (
                            <button
                              key={matchedDistrict.code}
                              type="button"
                              onClick={() => handleSelectDistrict(matchedDistrict.code.toString())}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                isSelected
                                  ? "bg-foreground text-white border-foreground shadow-xs"
                                  : "bg-white text-foreground/75 border-foreground/15 hover:border-foreground/30 hover:bg-neutral-50"
                              }`}
                            >
                              {matchedDistrict.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. CHỌN PHƯỜNG/XÃ VÀ SỐ NHÀ, TÊN ĐƯỜNG (GRID 2 CỘT) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phường / Xã */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70">
                          {t("checkout.ward", "Phường / Xã")} <span className="text-red-500">*</span>
                        </label>
                        {selectedDistrictCode && (
                          <button
                            type="button"
                            onClick={() => setIsManualWard(!isManualWard)}
                            className="text-[11px] text-terracotta font-bold hover:underline cursor-pointer"
                          >
                            {isManualWard
                              ? t("checkout.dropdownWardSwitch", "Chọn từ danh sách")
                              : t("checkout.manualWardSwitch", "Nhập tay Phường/Xã")}
                          </button>
                        )}
                      </div>

                      {isManualWard ? (
                        <input
                          type="text"
                          required
                          value={manualWard}
                          onChange={(e) => setManualWard(e.target.value)}
                          placeholder={t("checkout.manualWardPlaceholder", "Nhập tên Phường hoặc Xã...")}
                          className="w-full px-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                        />
                      ) : (
                        <div className="relative">
                          <select
                            required
                            disabled={!selectedDistrictCode || loadingWards}
                            value={selectedWardCode}
                            onChange={(e) => handleSelectWard(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <option value="">
                              {loadingWards
                                ? t("checkout.loadingWards", "Đang tải danh sách Phường/Xã...")
                                : selectedDistrictCode
                                ? t("checkout.wardPlaceholder", "-- Chọn Phường / Xã --")
                                : t("checkout.selectDistrictFirst", "-- Chọn Quận/Huyện trước --")}
                            </option>
                            {wardsList.map((w) => (
                              <option key={w.code} value={w.code}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                          {loadingWards ? (
                            <Loader2 className="w-4 h-4 text-terracotta animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-foreground/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Số nhà, tên đường cụ thể */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                        {t("checkout.streetAddress", "Số nhà, tên đường, tòa nhà...")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder={t("checkout.streetAddressPlaceholder", "Số 123 Đường Lê Lợi, Căn hộ A2...")}
                          className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border-2 border-foreground/15 rounded-xl font-medium text-foreground focus:outline-none focus:border-terracotta transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HỘP XEM TRƯỚC ĐỊA CHỈ GIAO HÀNG ĐẦY ĐỦ (LIVE PREVIEW) */}
                  {fullAddress && (
                    <div className="bg-gradient-to-r from-terracotta/[0.08] via-terracotta/[0.03] to-white border-2 border-terracotta/30 p-4 rounded-xl flex items-start gap-3 shadow-xs">
                      <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase tracking-wider text-terracotta">
                            {t("checkout.addressPreviewTitle", "Địa chỉ nhận hàng đầy đủ:")}
                          </span>
                          {streetAddress.trim() && effectiveWard && selectedDistrictName && selectedProvinceName && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Đầy đủ 4 cấp
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-foreground leading-relaxed break-words">
                          {fullAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    {t("checkout.note", "Ghi chú đơn hàng (Tùy chọn)")}
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("checkout.notePlaceholder", "Giao hàng giờ hành chính, gọi trước khi giao...")}
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
                  {t("checkout.step2", "2. PHƯƠNG THỨC THANH TOÁN")}
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
                      {t("checkout.codTitle", "Thanh toán khi nhận hàng (COD)")}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-jade bg-jade/10 px-2.5 py-0.5 rounded-full">
                      {lang === 'en' ? "Recommended" : "Khuyên dùng"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 font-medium leading-relaxed">
                    {t("checkout.codDesc", "Bạn chỉ thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận và kiểm tra bưu kiện. An toàn và tiện lợi 100%.")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_rgba(42,42,39,0.08)]">
              <h3 className="font-display font-black text-xl text-foreground uppercase tracking-wider mb-6 pb-4 border-b-2 border-foreground/10">
                {t("checkout.summaryTitle", "ĐƠN HÀNG CỦA BẠN")} ({items.length} {t("checkout.itemsTitle", "món").toLowerCase()})
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
                          Box
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-wide truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-foreground/60 font-medium">
                        {t("checkout.quantityShort", "Số lượng")}: x{item.quantity}
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
                  <span>{t("checkout.subtotal", "Tạm tính")}</span>
                  <span className="font-bold text-foreground">{subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between items-center text-foreground/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-terracotta" />
                    {t("checkout.shipping", "Phí vận chuyển")}
                  </span>
                  <span className="font-bold text-foreground">{shipping.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="border-t border-dashed border-foreground/15 pt-3 flex justify-between items-baseline">
                  <span className="font-black text-foreground uppercase tracking-wider text-base">
                    {t("checkout.total", "TỔNG CỘNG")}
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
                    <span>{t("checkout.submittingBtn", "ĐANG XỬ LÝ ĐẶT HÀNG...")}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t("checkout.placeOrderBtn", "XÁC NHẬN ĐẶT HÀNG (COD)")}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-foreground/50 text-center mt-4 font-medium leading-relaxed">
                {t("checkout.commitment", "Cam kết đóng gói chống sốc và bảo mật seal nguyên bản 100%.")}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
