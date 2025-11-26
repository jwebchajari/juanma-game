// app/admin/page.jsx  (SIN "use client")
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import AdminPageClient from "./AdminPageClient";

export default function Page() {
    return <AdminPageClient />;
}
