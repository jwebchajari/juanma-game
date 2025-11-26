
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; // si lo usás




export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
