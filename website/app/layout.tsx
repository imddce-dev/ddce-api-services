import type { Metadata,Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "../styles/globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets:["latin", "thai"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
   icons: {
    icon: '/mophlogo.png',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} antialiased bg-[#060913]`}>
        {children}
      </body>
    </html>
  );
}
