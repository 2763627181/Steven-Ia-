import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steven IA — Inteligencia Ejecutiva para Empresas Dominicanas",
  description:
    "Plataforma de auditoría fiscal, nómina, RRHH y cumplimiento legal para empresas en República Dominicana. Detecta errores, genera alertas y toma decisiones con inteligencia real.",
  keywords: [
    "auditoría fiscal República Dominicana",
    "DGII",
    "nómina inteligente RD",
    "facturación electrónica",
    "cumplimiento laboral",
    "TSS",
    "ISR",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
