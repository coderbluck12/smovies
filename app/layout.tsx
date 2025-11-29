import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import ReactToast from "@/lib/configs/react-toast";
import "remixicon/fonts/remixicon.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMovies",
  description: "SMovies - Watch and download movies online for free",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5981344326362620" crossOrigin="anonymous"></script>
      </head>
      <body className={dmSans.className}>
        <ReactToast />
        {children}
      </body>
    </html>
  );
}
