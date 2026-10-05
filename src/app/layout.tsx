import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "ReciclaQro | Centros de Acopio RAEE en Querétaro",
    template: "%s | ReciclaQro",
  },
  description:
    "Plataforma ciudadana para ubicar centros de acopio de residuos electrónicos (RAEE), aprender sobre economía circular y registrar tu impacto ambiental en Querétaro.",
  keywords: [
    "Reciclaje Querétaro",
    "RAEE Querétaro",
    "Centros de acopio electrónicos",
    "Reciclar computadoras Querétaro",
    "Pilas y baterías Querétaro",
    "Economía circular",
    "Medio ambiente Querétaro",
  ],
  authors: [{ name: "Comunidad ReciclaQro" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://reciclaqro.mx",
    title: "ReciclaQro | Centros de Acopio RAEE en Querétaro",
    description: "Ubica tu centro de acopio más cercano y gestiona responsablemente tus residuos electrónicos.",
    siteName: "ReciclaQro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
