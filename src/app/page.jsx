"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import styles from "./page.module.css";

export default function HomePage() {

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/game";
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Quiz de Juanma</h1>
        <p className={styles.subtitle}>
          Iniciá sesión para comprobar cuánto me conocés
        </p>

        <button className={styles.loginBtn} onClick={handleLogin}>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
