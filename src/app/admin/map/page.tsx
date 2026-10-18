'use client';

import { useState, useEffect } from 'react';
import { getMapConfigAction, saveMapConfigAction, getMapImageSignedUploadUrlAction } from './actions';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  Save,
  KeyRound,
  Star
} from 'lucide-react';

export default function AdminMapPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Thành phố Hồ Chí Minh');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; message: string } | null>(null);

  // Load config on mount
  useEffect(() => {
    async function load() {
      const res = await getMapConfigAction();
      if (res.success && res.config) {
        setConfig(res.config);
        const cityNames = Object.keys(res.config.cities || {});
        if (cityNames.length > 0 && !cityNames.includes(selectedCity)) {
          setSelectedCity(cityNames[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const cities = config?.cities || {};
  const currentCity = cities[selectedCity];

  const handleCityFieldChange = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      cities: {
        ...prev.cities,
        [selectedCity]: {
          ...prev.cities[selectedCity],
          [field]: value
        }
      }
    }));
  };

  const handleStoryChange = (storyIndex: number, field: string, value: any) => {
    const updatedStories = [...(currentCity?.stories || [])];
    updatedStories[storyIndex] = {
      ...updatedStories[storyIndex],
      [field]: value
    };

    handleCityFieldChange('stories', updatedStories);
  };

  const handleSetFeaturedStory = (storyIndex: number) => {
    const updatedStories = (currentCity?.stories || []).map((s: any, idx: number) => ({
      ...s,
      isFeatured: idx === storyIndex
    }));
    handleCityFieldChange('stories', updatedStories);
  };

  const handleAddStory = () => {
    const newStory = {
      id: `${currentCity?.id || 'city'}-${Date.now().toString().slice(-4)}`,
      title: 'Địa điểm mới',
      desc: 'Mô tả ngắn gọn về địa điểm này...',
      img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ben-thanh.jpg',
      code: '',
      isFeatured: false
    };

    const updatedStories = [...(currentCity?.stories || []), newStory];
    handleCityFieldChange('stories', updatedStories);
  };

  const handleRemoveStory = (storyIndex: number) => {
    const updatedStories = (currentCity?.stories || []).filter((_: any, idx: number) => idx !== storyIndex);
    handleCityFieldChange('stories', updatedStories);
  };

  const handleUploadImageForStory = async (storyIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatusMessage({ success: true, message: `Đang tải ảnh lên...` });
      const signRes = await getMapImageSignedUploadUrlAction(file.name, file.type);
      if (!signRes.success || !signRes.signedUrl) {
        throw new Error(signRes.message || 'Không thể tạo link tải ảnh');
      }

      const uploadRes = await fetch(signRes.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error(`Tải ảnh thất bại: ${uploadRes.statusText}`);
      }

      handleStoryChange(storyIndex, 'img', signRes.publicUrl);
      setStatusMessage({ success: true, message: `Đã cập nhật ảnh thành công! Nhớ nhấn "Lưu thay đổi bản đồ" ở góc dưới.` });
    } catch (err: any) {
      setStatusMessage({ success: false, message: err.message || 'Lỗi tải ảnh' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await saveMapConfigAction(config);
      if (!res.success) {
        throw new Error(res.message || 'Lỗi lưu cấu hình');
      }

      setStatusMessage({ success: true, message: 'Lưu thay đổi Bản Đồ Di Sản thành công!' });
    } catch (err: any) {
      setStatusMessage({ success: false, message: err.message || 'Có lỗi xảy ra khi lưu' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-foreground/50">Đang tải cấu hình Bản Đồ Di Sản...</div>;
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">
              Quản Lý Bản Đồ Di Sản
            </h1>
            <p className="text-xs text-foreground/60 mt-1">
              Chỉnh sửa thông tin địa điểm, ảnh minh họa và mã mở khóa bí mật
            </p>
          </div>
        </div>

        <Link
          href="/map"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-foreground/10 rounded-xl text-xs font-bold text-terracotta hover:bg-terracotta/5 transition-colors shadow-sm"
        >
          <span>Xem Bản Đồ trên web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 mb-6 ${statusMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {statusMessage.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          )}
          <span>{statusMessage.message}</span>
        </div>
      )}

      {/* City Selector Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-foreground/10 pb-4 mb-8 overflow-x-auto">
        {Object.keys(cities).map((cityName) => (
          <button
            key={cityName}
            type="button"
            onClick={() => setSelectedCity(cityName)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
              selectedCity === cityName 
                ? 'bg-foreground text-white shadow-md' 
                : 'bg-white text-foreground/70 hover:bg-foreground/5 border border-foreground/10'
            }`}
          >
            <MapPin className={`w-4 h-4 ${selectedCity === cityName ? 'text-terracotta' : 'text-foreground/40'}`} />
            {cityName}
          </button>
        ))}
      </div>

      {currentCity && (
        <div className="space-y-8">
          {/* 1. Thông tin thành phố */}
          <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider mb-4 text-foreground flex items-center gap-2 border-b border-foreground/10 pb-3">
              <MapPin className="w-5 h-5 text-terracotta" />
              Thông tin thành phố / Vùng đất: {selectedCity}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Tên thành phố hiển thị
                </label>
                <input
                  type="text"
                  value={currentCity.title || ''}
                  onChange={(e) => handleCityFieldChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Tiêu đề phụ (Subtitle)
                </label>
                <input
                  type="text"
                  value={currentCity.subtitle || ''}
                  onChange={(e) => handleCityFieldChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm"
                  placeholder="VD: Một mảnh miền Nam"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                Mô tả giới thiệu thành phố
              </label>
              <textarea
                rows={3}
                value={currentCity.description || ''}
                onChange={(e) => handleCityFieldChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm leading-relaxed"
                placeholder="Những nét đẹp, câu chuyện đặc trưng..."
              ></textarea>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-terracotta" />
                  Mã mở khóa chung cho thành phố này (Ngăn cách bằng dấu phẩy)
                </label>
              </div>
              <input
                type="text"
                value={Array.isArray(currentCity.unlockCodes) ? currentCity.unlockCodes.join(', ') : ''}
                onChange={(e) => {
                  const codes = e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
                  handleCityFieldChange('unlockCodes', codes);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm uppercase text-terracotta font-bold"
                placeholder="VD: HCM, SAIGON, BENTHANH"
              />
              <p className="text-[11px] text-foreground/50 mt-1">
                Khi khách hàng nhập bất kỳ mã nào trong danh sách này, thành phố này sẽ lập tức được thắp sáng trên bản đồ.
              </p>
            </div>
          </div>

          {/* 2. Danh sách các địa điểm / Mảnh ghép */}
          <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-foreground/10 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-terracotta" />
                  Các địa điểm / Mảnh ghép tại {selectedCity} ({currentCity.stories?.length || 0})
                </h2>
                <p className="text-xs text-foreground/60 mt-1">
                  💡 Bạn có thể tải ảnh mới cho từng địa điểm, gán mã mở khóa bí mật và chọn địa điểm nổi bật.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStory}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-terracotta transition-colors cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                Thêm địa điểm mới
              </button>
            </div>

            {/* List of Landmarks */}
            <div className="space-y-6">
              {(currentCity.stories || []).map((story: any, idx: number) => {
                const isFeatured = !!story.isFeatured;
                return (
                  <div
                    key={story.id || idx}
                    className={`p-5 rounded-2xl border-2 transition-all relative ${
                      isFeatured 
                        ? 'border-terracotta bg-terracotta/5 shadow-sm' 
                        : 'border-foreground/10 bg-[#FAF9F5] hover:border-foreground/25'
                    }`}
                  >
                    {/* Featured badge toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-foreground text-white text-xs font-mono font-bold flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-black uppercase tracking-wider text-foreground">
                          {story.title || 'Địa điểm chưa đặt tên'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSetFeaturedStory(idx)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isFeatured
                              ? 'bg-terracotta text-white shadow-sm'
                              : 'bg-white text-foreground/60 border border-foreground/20 hover:text-terracotta hover:border-terracotta'
                          }`}
                          title="Chọn làm địa điểm nổi bật khi nhập mã"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-white' : ''}`} />
                          {isFeatured ? 'Địa điểm nổi bật ⭐' : 'Đặt làm nổi bật'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveStory(idx)}
                          className="p-1.5 text-foreground/40 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa địa điểm này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                      {/* Image Preview & Upload */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-foreground/10 bg-white shadow-sm mb-2 group">
                          <img
                            src={story.img}
                            alt={story.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ben-thanh.jpg';
                            }}
                          />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold cursor-pointer p-2 text-center">
                            <Upload className="w-5 h-5 mb-1" />
                            Đổi ảnh
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImageForStory(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <label className="text-xs text-terracotta font-bold hover:underline cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Tải ảnh mới
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadImageForStory(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Info Inputs */}
                      <div className="md:col-span-3 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-foreground/70 mb-1 uppercase tracking-wider">
                              Tên địa điểm / Mảnh ghép *
                            </label>
                            <input
                              type="text"
                              value={story.title || ''}
                              onChange={(e) => handleStoryChange(idx, 'title', e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm font-bold bg-white"
                              placeholder="VD: Chợ Bến Thành"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-foreground/70 mb-1 uppercase tracking-wider flex items-center gap-1">
                              <KeyRound className="w-3.5 h-3.5 text-terracotta" />
                              Mã mở khóa riêng (Tùy chọn)
                            </label>
                            <input
                              type="text"
                              value={story.code || ''}
                              onChange={(e) => handleStoryChange(idx, 'code', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2.5 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-xs uppercase font-bold text-terracotta bg-white"
                              placeholder="VD: BENTHANH"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-foreground/70 mb-1 uppercase tracking-wider">
                            Mô tả ngắn
                          </label>
                          <input
                            type="text"
                            value={story.desc || ''}
                            onChange={(e) => handleStoryChange(idx, 'desc', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-xs bg-white"
                            placeholder="VD: Nhịp đập giao thương không ngủ."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-foreground/70 mb-1 uppercase tracking-wider">
                            Link ảnh trực tiếp (URL)
                          </label>
                          <input
                            type="text"
                            value={story.img || ''}
                            onChange={(e) => handleStoryChange(idx, 'img', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-xs font-mono text-foreground/60 bg-white"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-foreground/10">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl border border-foreground/20 text-foreground font-bold hover:bg-background-alt transition-colors text-sm"
            >
              Hủy bỏ
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-4 bg-foreground text-white rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md text-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu bản đồ...' : 'Lưu thay đổi bản đồ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
