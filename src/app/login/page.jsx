"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            router.push("/game");
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quiz de Cumple 🎉</h1>
            <p className={styles.subtitle}>
                Iniciá sesión para ver qué tanto me conocés 😏
            </p>

            <button
                onClick={handleLogin}  // 👈 ESTO FALTABA
                style={{
                    background: "#1B4D89",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >
                Iniciar sesión
            </button>
        </div>
    );
}
