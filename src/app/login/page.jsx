"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async () => {
        await signInWithPopup(auth, provider);
        router.push("/game");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quiz de Cumple 🎉</h1>
            <p className={styles.subtitle}>
                Iniciá sesión para ver qué tanto me conocés 😏
            </p>

            <button className={styles.googleBtn} onClick={handleLogin}>
                <img
                    className={styles.googleIcon}
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                />
                Continuar con Google
            </button>
        </div>
    );
}
