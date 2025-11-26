"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "firebase/firestore";

import styles from "./page.module.css";
import questions from "@/data/questions.json";

export default function AdminPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notAdmin, setNotAdmin] = useState(false);

    const [selectedAttempt, setSelectedAttempt] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user || user.email !== "juanmatoniolo2@gmail.com") {
                setNotAdmin(true);
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "attempts"),
                    orderBy("createdAt", "desc")
                );
                const snap = await getDocs(q);

                const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setAttempts(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setNotAdmin(true);
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    if (loading) return <div className={styles.loading}>Cargando panel admin...</div>;

    if (notAdmin)
        return (
            <div className={styles.denied}>
                Acceso restringido 🔒
                <br />
                Solo administrador autorizado.
            </div>
        );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Panel Admin — SmartPet</h1>

            {/* TABLA DE INTENTOS */}
            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Intentos registrados</h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Puntaje</th>
                                <th>Intento</th>
                                <th>Invitado</th>
                                <th>Respuestas</th>
                            </tr>
                        </thead>

                        <tbody>
                            {attempts.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.displayName}</td>
                                    <td>{a.email}</td>
                                    <td>{a.score}%</td>
                                    <td>{a.attempt}</td>
                                    <td>{a.passed ? "✔️" : "❌"}</td>

                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => setSelectedAttempt(a)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE DETALLE DE RESPUESTAS */}
            {selectedAttempt && (
                <div className={styles.modalOverlay} onClick={() => setSelectedAttempt(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            Respuestas de {selectedAttempt.displayName}
                        </h2>

                        <p className={styles.modalSub}>
                            Intento Nº {selectedAttempt.attempt} — Puntaje: {selectedAttempt.score}%
                        </p>

                        <div className={styles.answersList}>
                            {selectedAttempt.answers.map((ans, index) => {
                                const q = questions[index];
                                const userAnswer = q.options[ans];
                                const correctAnswer = q.options[q.correctIndex];
                                const isCorrect = ans === q.correctIndex;

                                return (
                                    <div key={index} className={styles.answerCard}>
                                        <h4 className={styles.qText}>
                                            {index + 1}. {q.text}
                                        </h4>

                                        <p
                                            className={`${styles.userAnswer} ${isCorrect ? styles.correct : styles.incorrect
                                                }`}
                                        >
                                            Respuesta: {userAnswer}
                                        </p>

                                        {!isCorrect && (
                                            <p className={styles.correctAnswer}>
                                                Correcta: {correctAnswer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedAttempt(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
