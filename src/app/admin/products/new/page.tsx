'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProductSignedUploadUrlsAction, createProductDirectAction } from '../actions';
import Link from 'next/link';
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, Sparkles, X, Package, Box, FileText, Languages } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('active');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('100');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // English Translation fields
  const [nameEn, setNameEn] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  // Main Box Image
  const [boxFile, setBoxFile] = useState<File | null>(null);
  const [boxPreview, setBoxPreview] = useState<string | null>(null);

  // Piece Images (Additional Images)
  const [pieceFiles, setPieceFiles] = useState<File[]>([]);
  const [piecePreviews, setPiecePreviews] = useState<string[]>([]);

  // 3-Frame "Trong mỗi hộp có gì?" Items:
  // 1. 01 x Blind Box
  const [boxItemFile, setBoxItemFile] = useState<File | null>(null);
  const [boxItemPreview, setBoxItemPreview] = useState<string | null>(null);

  // 2. 01 x Pin Kim Loại
  const [pinItemFile, setPinItemFile] = useState<File | null>(null);
  const [pinItemPreview, setPinItemPreview] = useState<string | null>(null);

  // 3. 01 x Story Card
  const [cardItemFile, setCardItemFile] = useState<File | null>(null);
  const [cardItemPreview, setCardItemPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; message: string } | null>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugCustomized) {
      setSlug(generateSlug(val));
    }
  };

  const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBoxFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBoxPreview(event.target?.result as string);
      };
      reader.onerror = () => {
        setBoxPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      setBoxFile(null);
      setBoxPreview(null);
    }
  };

  const handleRemoveBox = () => {
    setBoxFile(null);
    setBoxPreview(null);
  };

  const handlePieceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setPieceFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPiecePreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.onerror = () => {
          setPiecePreviews(prev => [...prev, URL.createObjectURL(file)]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePiece = (indexToRemove: number) => {
    setPieceFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPiecePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 3-Frame Handlers
  const handleBoxItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBoxItemFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setBoxItemPreview(event.target?.result as string);
      reader.onerror = () => setBoxItemPreview(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBoxItem = () => {
    setBoxItemFile(null);
    setBoxItemPreview(null);
  };

  const handlePinItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPinItemFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPinItemPreview(event.target?.result as string);
      reader.onerror = () => setPinItemPreview(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePinItem = () => {
    setPinItemFile(null);
    setPinItemPreview(null);
  };

  const handleCardItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCardItemFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setCardItemPreview(event.target?.result as string);
      reader.onerror = () => setCardItemPreview(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCardItem = () => {
    setCardItemFile(null);
    setCardItemPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || statusMessage?.success) return;

    if (!name.trim()) {
      setStatusMessage({ success: false, message: 'Tên sản phẩm là bắt buộc.' });
      return;
    }

    if (!slug.trim()) {
      setStatusMessage({ success: false, message: 'Slug đường dẫn là bắt buộc.' });
      return;
    }

    if (!boxFile && !boxPreview) {
      setStatusMessage({ success: false, message: 'Vui lòng tải lên ảnh hộp Blind Box chính.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      let uploadedBoxUrl: string | null = null;
      const uploadedPieceUrls: string[] = [];
      let uploadedBoxItemUrl: string | null = null;
      let uploadedPinItemUrl: string | null = null;
      let uploadedCardItemUrl: string | null = null;

      const uploadRequests: Array<{ name: string; type: string; isMain: boolean; kind?: string; index: number }> = [];
      if (boxFile) {
        uploadRequests.push({ name: boxFile.name, type: boxFile.type, isMain: true, index: 0 });
      }
      pieceFiles.forEach((file, idx) => {
        uploadRequests.push({ name: file.name, type: file.type, isMain: false, kind: 'piece', index: idx });
      });
      if (boxItemFile) {
        uploadRequests.push({ name: boxItemFile.name, type: boxItemFile.type, isMain: false, kind: 'item-box', index: 0 });
      }
      if (pinItemFile) {
        uploadRequests.push({ name: pinItemFile.name, type: pinItemFile.type, isMain: false, kind: 'item-pin', index: 0 });
      }
      if (cardItemFile) {
        uploadRequests.push({ name: cardItemFile.name, type: cardItemFile.type, isMain: false, kind: 'item-card', index: 0 });
      }

      if (uploadRequests.length > 0) {
        setSubmitProgress(`Đang chuẩn bị tải lên ${uploadRequests.length} ảnh...`);
        const signedRes = await getProductSignedUploadUrlsAction(uploadRequests);

        if (!signedRes.success || !signedRes.urls) {
          throw new Error(signedRes.message || 'Không thể tạo link tải ảnh trực tiếp');
        }

        const total = uploadRequests.length;
        let count = 0;

        for (const item of signedRes.urls) {
          count++;
          let targetFile: File | null = null;
          let label = 'ảnh';

          if (item.isMain) {
            targetFile = boxFile;
            label = 'ảnh Hộp Blind Box chính';
          } else if (item.kind === 'item-box') {
            targetFile = boxItemFile;
            label = 'ảnh Khung 1 (01 x Blind Box)';
          } else if (item.kind === 'item-pin') {
            targetFile = pinItemFile;
            label = 'ảnh Khung 2 (01 x Pin Kim Loại)';
          } else if (item.kind === 'item-card') {
            targetFile = cardItemFile;
            label = 'ảnh Khung 3 (01 x Story Card)';
          } else {
            targetFile = pieceFiles[item.index];
            label = `ảnh mảnh ghép #${item.index + 1}`;
          }

          if (!targetFile) continue;

          setSubmitProgress(`Đang tải ${label} (${count}/${total})...`);

          const uploadRes = await fetch(item.signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': targetFile.type || 'image/jpeg',
            },
            body: targetFile,
          });

          if (!uploadRes.ok) {
            throw new Error(`Lỗi tải ảnh lên lưu trữ: ${uploadRes.statusText}`);
          }

          if (item.isMain) {
            uploadedBoxUrl = item.publicUrl;
          } else if (item.kind === 'item-box') {
            uploadedBoxItemUrl = item.publicUrl;
          } else if (item.kind === 'item-pin') {
            uploadedPinItemUrl = item.publicUrl;
          } else if (item.kind === 'item-card') {
            uploadedCardItemUrl = item.publicUrl;
          } else {
            uploadedPieceUrls[item.index] = item.publicUrl;
          }
        }
      }

      setSubmitProgress('Đang lưu sản phẩm vào hệ thống...');

      const finalStory = JSON.stringify({
        box_image: uploadedBoxItemUrl || boxItemPreview || null,
        pin_image: uploadedPinItemUrl || pinItemPreview || null,
        card_image: uploadedCardItemUrl || cardItemPreview || null,
        name_en: nameEn.trim() || undefined,
        short_description_en: shortDescriptionEn.trim() || undefined,
        description_en: descriptionEn.trim() || undefined,
      });

      const saveRes = await createProductDirectAction({
        name,
        slug,
        city: city || 'Việt Nam',
        short_description: shortDescription,
        description,
        story: finalStory,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        status,
        image_url: uploadedBoxUrl,
        additional_images: uploadedPieceUrls.filter(Boolean),
      });

      if (!saveRes.success) {
        throw new Error(saveRes.message || 'Lỗi lưu sản phẩm');
      }

      setStatusMessage({ success: true, message: saveRes.message || 'Thêm sản phẩm thành công!' });
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ success: false, message: err.message || 'Có lỗi xảy ra khi lưu sản phẩm' });
      setIsSubmitting(false);
      setSubmitProgress('');
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Thêm Sản Phẩm Blind Box</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Đăng hộp Blind Box chính và các mảnh ghép bí ẩn bên trong
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Thông báo trạng thái */}
          {statusMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${statusMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {statusMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {statusMessage.message}
                {statusMessage.success && ' Đang tự động chuyển hướng về danh sách sản phẩm...'}
              </span>
            </div>
          )}

          {/* 1. THÔNG TIN CƠ BẢN */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">
              Thông tin sản phẩm
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Tên sản phẩm (Hộp Blind Box) *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                    placeholder="VD: Blind Box - Mảnh Sài Gòn"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-foreground/80 uppercase tracking-wider">Slug (Đường dẫn) *</label>
                    <button 
                      type="button" 
                      onClick={() => { setSlug(generateSlug(name)); setIsSlugCustomized(false); }}
                      className="text-xs text-terracotta font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Tự động tạo
                    </button>
                  </div>
                  <input 
                    type="text" 
                    required
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setIsSlugCustomized(true); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm"
                    placeholder="VD: blind-box-manh-sai-gon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Thành phố / Địa danh</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                    placeholder="VD: Sài Gòn, Hà Nội, Đà Nẵng..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Trạng thái</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                  >
                    <option value="active">Đang bán (Hiển thị công khai)</option>
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Giá bán (VNĐ) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="1000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                    placeholder="VD: 149000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Số lượng tồn kho *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                    placeholder="VD: 100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mô tả ngắn</label>
                <textarea 
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-none"
                  placeholder="Mô tả ngắn gọn về bộ Blind Box này..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mô tả chi tiết</label>
                <textarea 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-y leading-relaxed"
                  placeholder="Giới thiệu đầy đủ về sản phẩm, chất liệu, quy cách đóng gói, danh sách các mảnh ghép có thể mở ra..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* 2. HÌNH ẢNH: HỘP CHÍNH & CÁC MẢNH GHÉP */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">
              Hình ảnh Blind Box & Các mảnh ghép
            </h2>

            <div className="space-y-6">
              {/* Ảnh Hộp Chính */}
              <div className="p-5 rounded-2xl border-2 border-foreground/10 bg-[#FAF9F5]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-terracotta" />
                    <label className="text-sm font-black text-foreground uppercase tracking-wider">
                      1. Ảnh Hộp Blind Box (Ảnh chính sản phẩm) *
                    </label>
                  </div>
                  {boxPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveBox}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Xóa ảnh hộp
                    </button>
                  )}
                </div>
                <p className="text-xs text-foreground/60 mb-3">
                  Đây là ảnh chiếc hộp bên ngoài, sẽ hiển thị to nhất làm ảnh đại diện chính của sản phẩm.
                </p>

                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-white transition-colors bg-white/60">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleBoxChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  {boxPreview ? (
                    <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border border-foreground/10 bg-black/5 shadow-sm">
                      <img 
                        src={boxPreview} 
                        alt="Hộp Blind Box" 
                        className="w-full h-full object-contain" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Nhấn để đổi ảnh khác
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center">
                      <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-sm font-bold text-foreground/70">Tải ảnh hộp Blind Box lên</span>
                      <span className="text-xs text-foreground/40 mt-1">Định dạng JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ảnh Các Mảnh Ghép Bên Dưới */}
              <div className="p-5 rounded-2xl border-2 border-foreground/10 bg-[#FAF9F5]">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-terracotta" />
                  <label className="text-sm font-black text-foreground uppercase tracking-wider">
                    2. Các mảnh ghép bên trong hộp (Nhiều ảnh)
                  </label>
                </div>
                <p className="text-xs text-foreground/60 mb-3">
                  💡 <span className="font-bold text-foreground">Tính năng tương tác:</span> Khi khách hàng vào xem sản phẩm trên web, các mảnh này sẽ nằm bên dưới chiếc hộp. Khi bấm vào từng mảnh, ảnh mảnh đó sẽ phóng to lên cực nét để khách ngắm chi tiết!
                </p>

                {/* Previews grid of pieces */}
                {piecePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-emerald-700 mb-2">
                      Đã chọn {piecePreviews.length} mảnh ghép:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {piecePreviews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-foreground/10 bg-white shadow-sm group">
                          <img 
                            src={preview} 
                            alt={`Mảnh ${i + 1}`} 
                            className="w-full h-full object-contain p-2" 
                          />
                          <span className="absolute top-1.5 left-1.5 bg-foreground/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Mảnh #{i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePiece(i);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-20 shadow"
                            title="Xóa mảnh này"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload box for pieces */}
                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-white transition-colors bg-white/60">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handlePieceChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="py-6 flex flex-col items-center">
                    <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                    <span className="text-sm font-bold text-foreground/70">
                      {piecePreviews.length > 0 ? 'Tải thêm ảnh mảnh ghép khác' : 'Tải lên các mảnh ghép bên trong (chọn nhiều ảnh cùng lúc)'}
                    </span>
                    <span className="text-xs text-foreground/40 mt-1">Giữ phím Shift hoặc Ctrl / Cmd để chọn cùng lúc nhiều ảnh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. HÌNH ẢNH 3 KHUNG "TRONG MỖI HỘP BLIND BOX CÓ GÌ?" */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-foreground/10 pb-2">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">
                  3. Hình ảnh 3 khung &ldquo;Trong mỗi hộp Blind Box có gì?&rdquo;
                </h2>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Đăng ảnh thực tế cho 3 khung hiển thị trên trang sản phẩm: 01 x Blind Box, 01 x Pin Kim Loại, 01 x Story Card
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Khung 1: 01 x Blind Box */}
              <div className="p-5 rounded-2xl border-2 border-foreground/10 bg-[#FAF9F5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-md">
                      Khung 1
                    </span>
                    {boxItemPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveBoxItem}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground uppercase mb-1">
                    01 x Blind Box
                  </h3>
                  <p className="text-xs text-foreground/60 mb-3">
                    Ảnh hộp kín kraft bảo mật bên ngoài
                  </p>
                </div>

                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-3 text-center relative hover:bg-white transition-colors bg-white/60 aspect-square flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBoxItemChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {boxItemPreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden group">
                      <img
                        src={boxItemPreview}
                        alt="01 x Blind Box"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Bấm để đổi ảnh
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Package className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-xs font-bold text-foreground/70">Tải ảnh Hộp Blind Box</span>
                      <span className="text-[10px] text-foreground/40 mt-1">Khung 01 x Blind Box</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Khung 2: 01 x Pin Kim Loại */}
              <div className="p-5 rounded-2xl border-2 border-foreground/10 bg-[#FAF9F5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-1 rounded-md">
                      Khung 2
                    </span>
                    {pinItemPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePinItem}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground uppercase mb-1">
                    01 x Pin Kim Loại
                  </h3>
                  <p className="text-xs text-foreground/60 mb-3">
                    Ảnh huy hiệu pin tráng men cao cấp
                  </p>
                </div>

                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-3 text-center relative hover:bg-white transition-colors bg-white/60 aspect-square flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePinItemChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {pinItemPreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden group">
                      <img
                        src={pinItemPreview}
                        alt="01 x Pin Kim Loại"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Bấm để đổi ảnh
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Sparkles className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-xs font-bold text-foreground/70">Tải ảnh Pin Kim Loại</span>
                      <span className="text-[10px] text-foreground/40 mt-1">Khung 01 x Pin Kim Loại</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Khung 3: 01 x Story Card */}
              <div className="p-5 rounded-2xl border-2 border-foreground/10 bg-[#FAF9F5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-jade bg-jade/10 px-2.5 py-1 rounded-md">
                      Khung 3
                    </span>
                    {cardItemPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveCardItem}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground uppercase mb-1">
                    01 x Story Card
                  </h3>
                  <p className="text-xs text-foreground/60 mb-3">
                    Ảnh thẻ câu chuyện và mã QR
                  </p>
                </div>

                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-3 text-center relative hover:bg-white transition-colors bg-white/60 aspect-square flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCardItemChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {cardItemPreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden group">
                      <img
                        src={cardItemPreview}
                        alt="01 x Story Card"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Bấm để đổi ảnh
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <FileText className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-xs font-bold text-foreground/70">Tải ảnh Story Card</span>
                      <span className="text-[10px] text-foreground/40 mt-1">Khung 01 x Story Card</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. BẢN DỊCH TIẾNG ANH (ENGLISH TRANSLATION - TÙY CHỌN) */}
          <div className="pt-4">
            <div className="flex items-center justify-between border-b-2 border-foreground/10 pb-2 mb-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Languages className="w-5 h-5 text-terracotta" />
                  Bản dịch tiếng Anh (English Translation - Tùy chọn)
                </h2>
                <p className="text-xs text-foreground/60 mt-1">
                  Nội dung hiển thị khi người dùng đổi sang ngôn ngữ Tiếng Anh (EN). Nếu để trống, hệ thống sẽ tự động sử dụng bản dịch chuẩn.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/10 border border-terracotta/20 px-2.5 py-1 rounded-md">
                Bilingual Mode
              </span>
            </div>

            <div className="space-y-6 bg-[#FAF9F5] p-6 rounded-2xl border-2 border-foreground/10">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Tên sản phẩm tiếng Anh (Product Name - EN)
                </label>
                <input 
                  type="text" 
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-medium bg-white"
                  placeholder="VD: Saigon Piece - Official Blind Box Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Mô tả ngắn tiếng Anh (Short Description - EN)
                </label>
                <textarea 
                  rows={2}
                  value={shortDescriptionEn}
                  onChange={(e) => setShortDescriptionEn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-none bg-white"
                  placeholder="VD: Mystery blind box containing 01 random metal piece depicting iconic landmarks..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Mô tả chi tiết tiếng Anh (Detailed Description - EN)
                </label>
                <textarea 
                  rows={5}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-y leading-relaxed bg-white"
                  placeholder="VD: Each piece in the collection is an intimate tribute to the history, architectural essence, and cherished memories..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Dual status warning */}
          {statusMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${statusMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {statusMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {statusMessage.message}
                {statusMessage.success && ' Đang tự động chuyển hướng về danh sách sản phẩm...'}
              </span>
            </div>
          )}

          <div className="pt-6 border-t border-foreground/10 flex justify-end items-center gap-4">
            <Link 
              href="/admin/products" 
              className="px-6 py-3 rounded-xl border border-foreground/20 text-foreground font-bold hover:bg-background-alt transition-colors text-sm"
            >
              Hủy bỏ
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting || statusMessage?.success} 
              className="px-8 py-4 bg-foreground text-white rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
            >
              {statusMessage?.success ? 'Đã lưu thành công!' : isSubmitting ? (submitProgress || 'Đang lưu sản phẩm...') : 'Lưu sản phẩm Blind Box'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
