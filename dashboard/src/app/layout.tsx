import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Pi From Hungry - Detecção Autônoma de Fome",
  description: "Sistema autônomo que combina IA + Blockchain Pi Network + Dados Satelitais para combater a fome no mundo.",
  keywords: ["Pi Network", "blockchain", "fome", "humanitário", "IA", "satélites"],
  authors: [{ name: "@WeedzinxD" }],
  openGraph: {
    title: "Pi From Hungry",
    description: "Nenhum ser humano deve passar fome",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-zinc-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
