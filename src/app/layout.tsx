import "./globals.css";
import { Inter, Source_Sans_3 } from "next/font/google";

// Configurar fuente principal (reemplazo de Domus)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

// Configurar fuente secundaria
const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "600"],
});

export const metadata = {
  title: "Umi Consultoría - Análisis de datos e Inteligencia de Negocio",
  description:
    "Servicios especializados en análisis de información y business intelligence para la toma de decisiones estratégicas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSansPro.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
