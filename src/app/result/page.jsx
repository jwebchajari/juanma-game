"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, Timestamp, getDocs, query, where } from "firebase/firestore";

import QRCode from "react-qr-code";
import Loader from "@/components/Loader";
import styles from "./page.module.css";

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
    const [attemptNumber, setAttemptNumber] = useState(null);

    // CAMBIAR POR TU URL DE INVITACIÓN REAL
    const inviteUrl = "https://i.pinimg.com/236x/bb/52/4a/bb524a9c1d64543ec05c05299d9f300b.jpg";

    useEffect(() => {
        if (!answers.length) {
            router.push("/game");
            return;
        }

        const questions = require("@/data/questions.json");

        // Calcular score
        let correct = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correctIndex) correct++;
        });

        const s = Math.round((correct / questions.length) * 100);
        setScore(s);
        setPassed(s >= 70);

        const saveAttempt = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // Obtener cuántos intentos tiene esta persona
            const q = query(collection(db, "attempts"), where("userId", "==", user.uid));
            const snap = await getDocs(q);

            const attemptN = snap.size + 1; // Primer intento → 1
            setAttemptNumber(attemptN);

            // Guardar intento
            await addDoc(collection(db, "attempts"), {
                userId: user.uid,
                email: user.email,
                displayName: user.displayName,
                answers,
                score: s,
                attempt: attemptN,
                passed: s >= 70,
                createdAt: Timestamp.now(),
            });

            setSaving(false);
        };

        saveAttempt();
    }, [answers, router]);

    // WHATSAPP SHARE MEJORADO
    const shareWhatsApp = () => {
        const base = passed
            ? `🎉 ¡Aprobé el Quiz del cumple!`
            : `No pasé el Quiz del cumple 😅`;

        const msg = `${base}
Puntaje: ${score}%
Intento: ${attemptNumber}
${passed ? "Estoy invitado/a! 🎟️" : ""}
`;

        const url = encodeURIComponent(msg);
        window.open(`https://wa.me/+5493412275598?text=${url}`, "_blank");
    };

    if (score === null) return <Loader text="Calculando resultado..." />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tu Puntaje 🎯</h1>

            <div className={`${styles.score} ${!passed ? styles.bad : ""}`}>
                {score}%
            </div>

            <p className={styles.attemptText}>
                Intento número: <strong>{attemptNumber}</strong>
            </p>

            {passed ? (
                <>
                    <p className={styles.successMsg}>
                        🎉 ¡Felicidades! Superaste el 70% y estás invitad@ 🎉
                    </p>

                    <div className={styles.qrBox}>
                        <QRCode value={inviteUrl} size={140} />
                    </div>

                    <p className={styles.qrText}>
                        Mostrá este código para acceder a la invitación
                    </p>
                </>
            ) : (
                <p className={styles.failMsg}>
                    No llegaste al 70% 😢 Pero podés hablarme si querés revancha.
                </p>
            )}

            <button className={styles.whatsappBtn} onClick={shareWhatsApp}>
                Compartir resultado en WhatsApp
            </button>

            {!saving && (
                <p className={styles.savedText}>Resultado guardado ✔</p>
            )}
        </div>
    );
}
