import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Một Mảnh Việt Nam | Mang một mảnh Việt Nam theo bên mình",
  description: "Khám phá bộ sưu tập Blind Box Pin Di Sản. Mỗi hộp là một câu chuyện, một ký ức về văn hóa và con người Việt Nam. Sưu tầm, thắp sáng Bản đồ Việt Nam Số và lưu giữ ký ức của riêng bạn.",
  keywords: ["Một Mảnh Việt Nam", "Blind Box", "Pin di sản", "quà lưu niệm", "văn hóa Việt Nam", "phụ kiện"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${lora.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-terracotta selection:text-white">
        <Header />
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
