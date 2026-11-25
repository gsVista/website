import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "gsVista | Geospatial Innovation, Science & Analysis",
  description:
    "Geospatial innovation, satellite remote sensing, coastal flood vulnerability modeling, precision agriculture NDVI, and environmental spatial analysis based in Lagos, Nigeria.",
  keywords: [
    "gsVista",
    "Geospatial Science",
    "Remote Sensing Nigeria",
    "Lagos Flood Risk Analysis",
    "SAR Inundation Analysis",
    "NDVI Agriculture",
    "GIS Consultancy Lagos",
    "Spatial Analysis",
  ],
  authors: [{ name: "gsVista" }],
  openGraph: {
    title: "gsVista | Geospatial Innovation, Science & Analysis",
    description:
      "Geospatial innovation, satellite remote sensing, coastal flood modeling, and GIS analysis based in Lagos, Nigeria.",
    url: "https://gsvista.com",
    siteName: "gsVista",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@6.19.0/dist/maplibre-gl.css"
        />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased selection:bg-brand selection:text-paper transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
