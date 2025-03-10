import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "../../public/globals.css";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["cyrillic"],
});

const notosansMono = Noto_Sans_KR({
  variable: "--font-noto-mono",
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "타이틀",
  description: "설명",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notosansMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
