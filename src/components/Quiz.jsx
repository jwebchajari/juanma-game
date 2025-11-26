"use client";

import { useEffect, useState } from "react";
import Question from "./Question";
import Loader from "./Loader";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from "./Quiz.module.css";
import { useRouter } from "next/navigation";

export default function Quiz({ questions }) {
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));

    // estados de bloqueo
    const [checking, setChecking] = useState(true);
    const [blocked, setBlocked] = useState(false);
    const [attemptsCount, setAttemptsCount] = useState(0);

    const router = useRouter();

    useEffect(() => {
        async function check() {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(
                collection(db, "attempts"),
                where("userId", "==", user.uid)
            );

            const snap = await getDocs(q);
            const count = snap.size;
            setAttemptsCount(count);

            // limite 3 intentos
            if (count >= 3) {
                setBlocked(true);
            }

            setChecking(false);
        }

        check();
    }, []);

    const finish = () => {
        const params = new URLSearchParams({
            answers: JSON.stringify(answers),
        });
        router.push(`/result?${params.toString()}`);
    };

    if (checking) return <Loader text="Preparando el quiz..." />;

    if (blocked)
        return (
            <div className={styles.blocked}>
                <h2>Límite de intentos alcanzado 🚫</h2>
                <p>Ya hiciste los 3 intentos permitidos.</p>
                <p>Si necesitás más intentos, hablame.</p>
            </div>
        );

    return (
        <div className={styles.quiz}>
            <h1 className={styles.title}>¿Qué tanto me conocés?</h1>

            <p className={styles.attemptInfo}>
                Intento {attemptsCount + 1} de 3
            </p>

            {questions.map((q, i) => (
                <Question
                    key={i}
                    index={i}
                    question={q}
                    selected={answers[i]}
                    onSelect={(opt) => {
                        const copy = [...answers];
                        copy[i] = opt;
                        setAnswers(copy);
                    }}
                />
            ))}

            <button
                className={styles.finishBtn}
                disabled={answers.includes(null)}
                onClick={finish}
            >
                Finalizar
            </button>
        </div>
    );
}
