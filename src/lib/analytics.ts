export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Khởi tạo interface Window để TypeScript không báo lỗi khi gọi window.gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Gửi event page_view mỗi khi người dùng chuyển route
 */
export const trackPageView = (url: string) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.gtag !== 'undefined' &&
    GA_MEASUREMENT_ID &&
    process.env.NODE_ENV === 'production'
  ) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Gửi các custom events
 */
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.gtag !== 'undefined' &&
    GA_MEASUREMENT_ID &&
    process.env.NODE_ENV === 'production'
  ) {
    window.gtag('event', action, params);
  }
};
