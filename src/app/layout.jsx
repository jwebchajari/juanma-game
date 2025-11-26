export const metadata = {
  title: "Quiz de Juanma",
  description: "¿Cuánto conocés a Juanma? Completá el quiz.",
  openGraph: {
    title: "Quiz de Juanma",
    description: "¿Cuánto conocés a Juanma?",
    images: [
      {
        url: "/juanma.jpg", // ← tu foto (ponela en /public)
        width: 1200,
        height: 630,
        alt: "Juanma",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz de Juanma",
    description: "¿Cuánto conocés a Juanma?",
    images: ["/juanma.jpg"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning={true}
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
