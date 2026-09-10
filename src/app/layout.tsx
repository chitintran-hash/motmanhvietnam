import type { Metadata } from "next";
import { Be_Vietnam_Pro, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const beVietnam = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
});

const montserrat = Montserrat({
  weight: ['700', '800', '900'],
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Một Mảnh Việt Nam | Mang một mảnh Việt Nam theo bên mình",
  description: "Khám phá bộ sưu tập Blind Box Pin Di Sản. Mỗi hộp là một câu chuyện, một ký ức về văn hóa và con người Việt Nam. Sưu tầm, thắp sáng Bản đồ Việt Nam Số và lưu giữ ký ức của riêng bạn.",
  keywords: ["Một Mảnh Việt Nam", "Blind Box", "Pin di sản", "quà lưu niệm", "văn hóa Việt Nam", "phụ kiện"],
};

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html lang="vi" className={`${beVietnam.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-terracotta selection:text-white">
        <Header session={session} />
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
