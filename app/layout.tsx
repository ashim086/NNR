import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NNR Removals | Trusted Man & Van Service in Sydney, Australia",
    template: "%s | NNR Removals",
  },
  description:
    "NNR Removals – Your trusted Nepali-owned removal service in Sydney, Australia. Affordable man and van, house removals, office relocation, piano moving & rubbish pickup. Get a free quote today!",
  keywords: [
    "man and van Sydney",
    "removals Sydney",
    "house removals Australia",
    "office relocation Sydney",
    "NNR removals",
    "Nepali removals Sydney",
    "affordable movers Sydney",
    "piano moving Sydney",
    "rubbish pickup Sydney",
    "moving service Australia",
    "man with van near me",
  ],
  authors: [{ name: "NNR Removals" }],
  creator: "NNR Removals",
  metadataBase: new URL("https://nnremovals.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "NNR Removals",
    title: "NNR Removals | Trusted Man & Van Service in Sydney, Australia",
    description:
      "Affordable and reliable removal services in Sydney. House moving, office relocation, man and van, piano moving & more. Nepali-owned, family values.",
    images: [
      {
        url: "/logoOfficial.png",
        width: 800,
        height: 600,
        alt: "NNR Removals Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NNR Removals | Trusted Man & Van Service in Sydney",
    description:
      "Affordable and reliable removal services in Sydney. Get a free quote today!",
    images: ["/logoOfficial.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
