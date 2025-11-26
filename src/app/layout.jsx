export const metadata = {
  title: "Quiz de Juanma",
  description: "¿Cuánto conocés a Juanma? Completá el quiz.",
  openGraph: {
    title: "Quiz de Juanma",
    description: "¿Cuánto conocés a Juanma?",
    type: "website",
    images: [
      {
        url: "https://juanma-game.vercel.app/juanma.png", // ← tu foto en /public
        width: 1200,
        height: 630,
        alt: "Juanma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz de Juanma",
    description: "¿Cuánto conocés a Juanma?",
    images: ["hhttps://juanma-game.vercel.app//juanma.png"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        style={{
          background: "#F3F6FA",
          color: "#1A1A1A",
          minHeight: "100vh",
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
