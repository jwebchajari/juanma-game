"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    query,
    where,
    addDoc,
    Timestamp,
    doc,
} from "firebase/firestore";

import Loader from "./Loader";
import Question from "./Question";
import styles from "./Quiz.module.css";
import { useRouter } from "next/navigation";

export default function Quiz({ questions }) {
    const [authReady, setAuthReady] = useState(false);
    const [user, setUser] = useState(null);

    const [checking, setChecking] = useState(true);
    const [blocked, setBlocked] = useState(false);
    const [attemptsCount, setAttemptsCount] = useState(0);
    const [requestSent, setRequestSent] = useState(false);
    const [answers, setAnswers] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthReady(true);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!authReady || !user) return;

        async function load() {
            // Intentos normales
            const attemptsQ = query(
                collection(db, "attempts"),
                where("userId", "==", user.uid)
            );
            const attemptsSnap = await getDocs(attemptsQ);
            let currentAttempts = attemptsSnap.size;

            // Extra attempts
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            let extra = userSnap.exists() ? userSnap.data().extraAttempts || 0 : 0;

            // Request check
            const reqRef = doc(db, "attemptRequests", user.uid);
            const reqSnap = await getDoc(reqRef);
            setRequestSent(reqSnap.exists());

            // Bloqueo
            setBlocked(currentAttempts >= 3 + extra);

            setAttemptsCount(currentAttempts);
            setAnswers(Array(questions.length).fill(null));
            setChecking(false);
        }

        load();
    }, [authReady, user, questions.length]);

    // único request por user
    const sendRequest = async () => {
        const reqRef = doc(db, "attemptRequests", user.uid);
        await setDoc(reqRef, {
            uid: user.uid,
            email: user.email,
            createdAt: Timestamp.now(),
        });

        setRequestSent(true);
    };

    if (!authReady) return <Loader text="Cargando..." />;
    if (checking) return <Loader text="Preparando preguntas..." />;

    if (blocked)
        return (
            <div className={styles.blocked}>
                <h2>Límite alcanzado</h2>

                {!requestSent ? (
                    <button className={styles.requestBtn} onClick={sendRequest}>
                        Solicitar intento extra
                    </button>
                ) : (
                    <p className={styles.requestSent}>Solicitud enviada ✔</p>
                )}
            </div>
        );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quiz de Cumple</h1>
            <p className={styles.attemptInfo}>
                Intento {attemptsCount + 1} de {3}
                {"+ extra"}
            </p>

            {questions.map((q, i) => (
                <Question
                    key={i}
                    index={i}
                    question={q}
                    selected={answers[i]}
                    onSelect={(v) => {
                        const arr = [...answers];
                        arr[i] = v;
                        setAnswers(arr);
                    }}
                />
            ))}

            <button
                className={styles.finishBtn}
                disabled={answers.includes(null)}
                onClick={() => {
                    const p = new URLSearchParams({
                        answers: JSON.stringify(answers),
                    });
                    router.push(`/result?${p.toString()}`);
                }}
            >
                Finalizar intento
            </button>
        </div>
    );
}
