"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { auth, db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

import QRCode from "react-qr-code";
import Loader from "@/components/Loader";
import styles from "./page.module.css";

import questions from "@/data/questions.json";

export default function ResultPage() {
    const router = useRouter();
    const params = useSearchParams();

    const answers = useMemo(() => {
        const a = params.get("answers");
        return a ? JSON.parse(a) : [];
    }, [params]);

    const [score, setScore] = useState(null);
    const [saving, setSaving] = useState(true);
    const [passed, setPassed] = useState(false);

    const inviteUrl =
        "https://i.pinimg.com/236x/bb/52/4a/bb524a9c1d64543ec05c05299d9f300b.jpg";

    useEffect(() => {
        if (!answers.length) {
            router.push("/game");
            return;
        }

        // Calcular puntaje
        let correct = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correctIndex) correct++;
        });

        const s = Math.round((correct / questions.length) * 100);
        setScore(s);
        setPassed(s >= 70);

        // Guardar intento en Firestore
        const saveAttempt = async () => {
            const user = auth.currentUser;
            if (!user) return;

            await addDoc(collection(db, "attempts"), {
                userId: user.uid,
                email: user.email,
                displayName: user.displayName,
                answers,
                score: s,
                passed: s >= 70,
                createdAt: Timestamp.now(),
            });

            setSaving(false);
        };

        saveAttempt();
    }, [answers, router]);

    const shareWhatsApp = () => {
        const msg = passed
            ? `Acabo de sacar ${score}% en el quiz de cumple de Juanma 🎉\n\nConfirmo asistencia ✔`
            : `Saqué ${score}% en el quiz de cumple 😅`;

        const text = encodeURIComponent(msg);
        window.open(`https://wa.me/?text=${text}`, "_blank");
    };

    if (score === null) return <Loader text="Calculando resultado..." />;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Resultado</h1>

                <div className={styles.scoreCircle}>
                    <span>{score}%</span>
                </div>

                {/* Barra de progreso */}
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${score}%` }}
                    />
                </div>

                {passed ? (
                    <>
                        <p className={styles.passMsg}>
                            🎉 ¡Felicitaciones! Superaste el 70%
                        </p>

                        <div className={styles.qrBox}>
                            <QRCode value={inviteUrl} size={140} />
                        </div>

                        <p className={styles.qrText}>
                            Mostrá este código para ver tu invitación
                        </p>

                        <p className={styles.assistNote}>
                            Tocá el botón de WhatsApp para confirmar asistencia 👇
                        </p>
                    </>
                ) : (
                    <>
                        <p className={styles.failMsg}>
                            No llegaste al 70%, podés intentarlo de nuevo.
                        </p>

                        {/* BOTÓN REINTENTAR */}
                        <button
                            className={styles.retryBtn}
                            onClick={() => router.push("/game")}
                        >
                            Reintentar
                        </button>
                    </>
                )}

                <button className={styles.whatsBtn} onClick={shareWhatsApp}>
                    Enviar WhatsApp
                </button>

                {!saving && <p className={styles.saved}>Intento guardado ✔</p>}
            </div>
        </div>
    );
}
