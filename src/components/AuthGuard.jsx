"use client";

import { useAuth } from "@/lib/useAuth";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
    const user = useAuth();
    const router = useRouter();

    if (user === undefined) return <Loader text="Verificando sesión..." />;

    if (!user) {
        router.push("/login");
        return <Loader text="Redirigiendo..." />;
    }

    return children;
}
