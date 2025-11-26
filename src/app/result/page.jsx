// app/result/page.jsx  (SIN "use client")
export const dynamic = "force-dynamic";   // si lo estabas usando
export const revalidate = 0;              // si lo querés
export const fetchCache = "force-no-store"; // opcional

import ResultPageClient from "./ResultPageClient";

export default function Page() {
    return <ResultPageClient />;
}
