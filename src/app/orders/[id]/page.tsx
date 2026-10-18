import { getSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  ClipboardCheck, 
  Truck, 
  PackageCheck, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  ArrowRight, 
  Package, 
  Map, 
  Sparkles,
  ShoppingBag,
  AlertTriangle
} from "lucide-react";

export const revalidate = 0;

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;
  const supabase = getSupabaseServer();

  // 1. Lấy thông tin đơn hàng
  const { data: order, error } = await supabase
    .from("mm_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  // 2. Lấy danh sách sản phẩm trong đơn
  const { data: orderItems } = await supabase
    .from("mm_order_items")
    .select("*")
    .eq("order_id", orderId);

  // Xác định bước hiện tại trong tiến trình (1: Chờ xác nhận, 2: Đã xác nhận, 3: Đang giao, 4: Đã giao)
  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 1;
      case "confirmed":
      case "preparing":
        return 2;
      case "shipping":
        return 3;
      case "completed":
        return 4;
      case "cancelled":
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  const steps = [
    {
      step: 1,
      title: "Chờ xác nhận",
      subtitle: "Đơn hàng đã đặt",
      icon: Clock,
      description: "Hệ thống đã ghi nhận đơn, đội ngũ Một Mảnh Việt Nam đang kiểm tra thông tin."
    },
    {
      step: 2,
      title: "Đã xác nhận",
      subtitle: "Đang đóng gói",
      icon: ClipboardCheck,
      description: "Đơn hàng đã được xác nhận và đang được đóng gói nguyên seal kèm thẻ câu chuyện."
    },
    {
      step: 3,
      title: "Đang giao",
      subtitle: "Bàn giao bưu tá",
      icon: Truck,
      description: "Bưu kiện đã bàn giao cho đơn vị vận chuyển và đang trên đường chuyển đến bạn."
    },
    {
      step: 4,
      title: "Đã giao",
      subtitle: "Giao thành công",
      icon: PackageCheck,
      description: "Giao hàng thành công. Chúc bạn mở ra được mảnh ghép ưng ý!"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF9F5]">
      <div className="container mx-auto px-6 max-w-[1000px]">
        {/* Header Breadcrumb & Order Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta mb-3">
            <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
            HÀNH TRÌNH ĐƠN HÀNG
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-tight">
              MÃ ĐƠN: #{order.id.split("-")[0].toUpperCase()}
            </h1>
            <span className="text-xs text-foreground/50 font-mono">
              Đặt lúc: {new Date(order.created_at).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* 1. STATUS BANNER */}
        <div className={`p-6 rounded-2xl mb-10 border-2 shadow-[4px_4px_0px_rgba(42,42,39,0.06)] ${
          isCancelled
            ? "bg-red-50 border-red-200 text-red-800"
            : currentStep === 1
            ? "bg-amber-50 border-amber-200 text-amber-900"
            : currentStep === 2
            ? "bg-blue-50 border-blue-200 text-blue-900"
            : currentStep === 3
            ? "bg-purple-50 border-purple-200 text-purple-900"
            : "bg-emerald-50 border-emerald-200 text-emerald-900"
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCancelled ? "bg-red-100 text-red-600" :
              currentStep === 1 ? "bg-amber-100 text-amber-600" :
              currentStep === 2 ? "bg-blue-100 text-blue-600" :
              currentStep === 3 ? "bg-purple-100 text-purple-600" :
              "bg-emerald-100 text-emerald-600"
            }`}>
              {isCancelled ? <AlertTriangle className="w-6 h-6" /> :
               currentStep === 1 ? <Clock className="w-6 h-6" /> :
               currentStep === 2 ? <ClipboardCheck className="w-6 h-6" /> :
               currentStep === 3 ? <Truck className="w-6 h-6" /> :
               <PackageCheck className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-wide mb-1">
                {isCancelled ? "ĐƠN HÀNG ĐÃ BỊ HỦY" :
                 currentStep === 1 ? "ĐƠN HÀNG ĐANG CHỜ XÁC NHẬN" :
                 currentStep === 2 ? "ĐƠN HÀNG ĐÃ ĐƯỢC XÁC NHẬN" :
                 currentStep === 3 ? "ĐƠN HÀNG ĐANG TRÊN ĐƯỜNG GIAO" :
                 "ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG"}
              </h2>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                {isCancelled ? "Đơn hàng này đã bị hủy. Vui lòng liên hệ nếu có bất kỳ thắc mắc nào." :
                 currentStep === 1 ? "Một Mảnh Việt Nam đã tiếp nhận đơn của bạn. Chúng tôi sẽ nhanh chóng chuẩn bị và gửi hàng sớm nhất." :
                 currentStep === 2 ? "Đơn hàng đã được xác nhận. Chúng tôi đang đóng gói cẩn thận các mảnh ghép và thẻ câu chuyện cho bạn." :
                 currentStep === 3 ? "Bưu kiện đã được bàn giao cho đơn vị vận chuyển. Bạn vui lòng để ý điện thoại khi nhân viên giao hàng liên hệ." :
                 "Đơn hàng đã được giao tận tay bạn. Cảm ơn bạn đã đồng hành cùng hành trình Một Mảnh Việt Nam!"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. E-COMMERCE STEPPER TIMELINE (CHỜ XÁC NHẬN - ĐÃ XÁC NHẬN - ĐANG GIAO - ĐÃ GIAO) */}
        {!isCancelled && (
          <div className="bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-10 shadow-[6px_6px_0px_rgba(42,42,39,0.08)] mb-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/50 mb-8 text-center sm:text-left">
              TRẠNG THÁI TIẾN ĐỘ ĐƠN HÀNG
            </h3>

            {/* Stepper Bar Desktop */}
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden sm:block absolute top-7 left-12 right-12 h-1 bg-foreground/10 z-0">
                <div 
                  className="h-full bg-terracotta transition-all duration-500"
                  style={{ 
                    width: currentStep === 1 ? "0%" : 
                           currentStep === 2 ? "33%" : 
                           currentStep === 3 ? "66%" : "100%" 
                  }}
                ></div>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                {steps.map((st) => {
                  const Icon = st.icon;
                  const isCompleted = currentStep > st.step;
                  const isCurrent = currentStep === st.step;

                  return (
                    <div key={st.step} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                      {/* Circle Icon */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                        isCurrent
                          ? "bg-terracotta text-white border-terracotta ring-4 ring-terracotta/25 scale-110 shadow-md"
                          : isCompleted
                          ? "bg-terracotta text-white border-terracotta"
                          : "bg-white text-foreground/30 border-foreground/20"
                      }`}>
                        {isCompleted ? (
                          <Check className="w-6 h-6 stroke-[3]" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="flex-1 sm:flex-initial">
                        <div className="flex items-center sm:justify-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wider ${
                            isCurrent ? "text-terracotta font-extrabold" : isCompleted ? "text-foreground" : "text-foreground/40"
                          }`}>
                            {st.title}
                          </span>
                          {isCurrent && (
                            <span className="inline-block w-2 h-2 rounded-full bg-terracotta animate-ping"></span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-foreground/50 mt-0.5">
                          {st.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Step Description Box */}
            <div className="mt-8 pt-6 border-t border-foreground/10 bg-[#FAF9F5] p-4 rounded-xl flex items-center gap-3 text-xs font-medium text-foreground/80">
              <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
              <span>
                {steps[currentStep - 1]?.description || "Đơn hàng đang được cập nhật."}
              </span>
            </div>
          </div>
        )}

        {/* 3. ORDER DETAILS & DELIVERY INFO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Thông tin người nhận & giao hàng */}
          <div className="md:col-span-6 bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/60 mb-6 pb-3 border-b border-foreground/10 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              ĐỊA CHỈ NHẬN HÀNG
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">{order.customer_name}</span>
                  <span className="text-xs text-foreground/50">{order.customer_email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-foreground/40 shrink-0" />
                <span className="font-bold text-foreground">{order.phone || "Chưa cập nhật"}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
                <span className="text-foreground/80 font-medium leading-relaxed">
                  {order.address}
                </span>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mt-6 pt-4 border-t border-foreground/10">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-2">
                Phương thức thanh toán
              </span>
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CreditCard className="w-4 h-4 text-jade" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </div>
              <span className="inline-block mt-2 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Chưa thanh toán (Trả tiền mặt khi nhận bưu kiện)
              </span>
            </div>
          </div>

          {/* Danh sách sản phẩm & Tổng tiền */}
          <div className="md:col-span-6 bg-white border-2 border-foreground/10 rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/60 mb-6 pb-3 border-b border-foreground/10 flex items-center gap-2">
              <Package className="w-4 h-4 text-terracotta" />
              SẢN PHẨM TRONG ĐƠN ({orderItems?.length || 1})
            </h3>

            <div className="space-y-4 mb-6">
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-sm pb-3 border-b border-foreground/5 last:border-b-0">
                    <div>
                      <h4 className="font-bold text-foreground uppercase tracking-wide">
                        {item.product_name}
                      </h4>
                      <p className="text-xs text-foreground/50 font-medium">
                        Số lượng: x{item.quantity} • Đơn giá: {Number(item.unit_price).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                    <span className="font-bold text-foreground shrink-0">
                      {Number(item.subtotal).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-foreground/70">
                  <div className="font-bold text-foreground">BLIND BOX - MỘT MẢNH VIỆT NAM</div>
                  <span className="text-xs text-foreground/50">Số lượng: x1</span>
                </div>
              )}
            </div>

            {/* Breakdown tiền */}
            <div className="space-y-2 border-t-2 border-foreground/10 pt-4 text-sm">
              <div className="flex justify-between items-center text-foreground/70">
                <span>Tạm tính</span>
                <span className="font-bold text-foreground">
                  {(Number(order.total_amount) > 30000 ? Number(order.total_amount) - 30000 : Number(order.total_amount)).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between items-center text-foreground/70">
                <span>Phí vận chuyển COD</span>
                <span className="font-bold text-foreground">30.000 ₫</span>
              </div>
              <div className="border-t border-dashed border-foreground/20 pt-3 flex justify-between items-baseline">
                <span className="font-black text-foreground uppercase tracking-wider">TỔNG THANH TOÁN</span>
                <span className="text-2xl font-display font-black text-terracotta">
                  {Number(order.total_amount).toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>

          <Link
            href="/map"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground border-2 border-foreground/15 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-foreground hover:text-white transition-colors shadow-sm"
          >
            <Map className="w-4 h-4 text-gold" />
            Khám phá Bản Đồ Di Sản
          </Link>

          <Link
            href="/profile/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-foreground/60 hover:text-terracotta font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Xem tất cả đơn hàng <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
