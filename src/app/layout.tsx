import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReciclaQro - Centros de Acopio en Querétaro",
  description: "Encuentra centros de acopio de reciclaje en Querétaro y aprende sobre reciclaje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
