export const metadata = {
  title: "Quiz de Juanma",
  description: "¿Cuánto conocés a Juanma? Completá el quiz.",
  metadataBase: new URL("https://juanma-game.vercel.app"),

  openGraph: {
    title: "Quiz de Juanma",
    description: "¿Cuánto conocés a Juanma?",
    url: "https://juanma-game.vercel.app",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/juanma.png",
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
    images: ["/juanma.png"],
    creator: "@juanma",
  },

  icons: {
    icon: "/juanma.png",
    shortcut: "/juanma.png",
    apple: "/juanma.png",
  },

  authors: [{ name: "Juanma" }],
  creator: "Juanma",
  publisher: "Juanma",

  manifest: "/manifest.json",

  // 🧠 Evitar indexar (opcional)
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// LAYOUT
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
