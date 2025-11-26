"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    query,
    orderBy,
    updateDoc,
    doc
} from "firebase/firestore";

import styles from "./page.module.css";
import questions from "@/data/questions.json";

export default function AdminPage() {
    const [attempts, setAttempts] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [notAdmin, setNotAdmin] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user || user.email !== "juanmatoniolo2@gmail.com") {
                setNotAdmin(true);
                setLoading(false);
                return;
            }

            try {
                const attSnap = await getDocs(
                    query(collection(db, "attempts"), orderBy("createdAt", "desc"))
                );
                setAttempts(attSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

                const reqSnap = await getDocs(collection(db, "attemptRequests"));
                setRequests(reqSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

                setLoading(false);
            } catch (e) {
                console.error(e);
                setNotAdmin(true);
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    if (loading) return <div className={styles.loading}>Cargando...</div>;
    if (notAdmin) return <div className={styles.denied}>Acceso restringido 🔒</div>;

    // ============================ AGRUPAR INTENTOS POR USUARIO ============================
    const users = {};
    attempts.forEach((a) => {
        if (!users[a.email]) users[a.email] = [];
        users[a.email].push(a);
    });

    // ============================ ESTADÍSTICAS ============================
    const total = attempts.length;
    const approved = attempts.filter((a) => a.passed).length;
    const failed = total - approved;
    const avg = total > 0
        ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / total)
        : 0;

    // ============================ ANALISIS DE PREGUNTAS ============================
    const stats = questions.map(() => ({ hits: 0, misses: 0 }));

    attempts.forEach((att) => {
        att.answers.forEach((ans, i) => {
            const correct = questions[i].correctIndex;
            if (ans === correct) stats[i].hits++;
            else stats[i].misses++;
        });
    });

    const mostFailed = [...stats]
        .map((s, i) => ({ ...s, index: i }))
        .sort((a, b) => b.misses - a.misses);

    const mostCorrect = [...stats]
        .map((s, i) => ({ ...s, index: i }))
        .sort((a, b) => b.hits - a.hits);

    // ============================ APROBAR SOLICITUD ============================
    const enableMoreAttempts = async (req) => {
        try {
            await updateDoc(doc(db, "attemptRequests", req.id), {
                approved: true,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Panel Admin</h1>

            {/* ====== ESTADÍSTICAS ====== */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}><h3>Personas únicas</h3><p>{Object.keys(users).length}</p></div>
                <div className={styles.statCard}><h3>Total intentos</h3><p>{total}</p></div>
                <div className={styles.statCard}><h3>Aprobados</h3><p>{approved}</p></div>
                <div className={styles.statCard}><h3>Desaprobados</h3><p>{failed}</p></div>
                <div className={styles.statCard}><h3>Promedio</h3><p>{avg}%</p></div>
            </div>

            {/* ====== PREGUNTAS MÁS FALLADAS / ACERTADAS ====== */}
            <div className={styles.statsSection}>
                <h2 className={styles.sectionTitle}>Preguntas más falladas</h2>
                {mostFailed.slice(0, 3).map((q, i) => (
                    <div key={i} className={styles.statItem}>
                        <strong>{i + 1}. {questions[q.index].question}</strong>
                        <p>Falladas: {q.misses}</p>
                    </div>
                ))}

                <h2 className={styles.sectionTitle}>Preguntas más acertadas</h2>
                {mostCorrect.slice(0, 3).map((q, i) => (
                    <div key={i} className={styles.statItem}>
                        <strong>{i + 1}. {questions[q.index].question}</strong>
                        <p>Acertadas: {q.hits}</p>
                    </div>
                ))}
            </div>

            {/* ====== LISTADO DE USUARIOS ====== */}
            {!selectedUser ? (
                <>
                    <h2 className={styles.sectionTitle}>Personas</h2>
                    <div className={styles.cardList}>
                        {Object.keys(users).map((email) => {
                            const list = users[email];
                            const req = requests.find((r) => r.email === email);

                            return (
                                <div key={email} className={styles.userCard}>
                                    <h3>{email}</h3>
                                    <p>Intentos: {list.length}</p>

                                    {req && (
                                        <p className={styles.requestNote}>
                                            Solicitó más intentos
                                        </p>
                                    )}

                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => setSelectedUser(email)}
                                    >
                                        Ver detalles
                                    </button>

                                    {req && (
                                        <button
                                            className={styles.enableBtn}
                                            onClick={() => enableMoreAttempts(req)}
                                        >
                                            Autorizar intentos
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <>
                    <button
                        className={styles.backBtn}
                        onClick={() => setSelectedUser(null)}
                    >
                        ← Volver
                    </button>

                    <h2 className={styles.sectionTitle}>Intentos de {selectedUser}</h2>

                    {users[selectedUser].map((a, idx) => (
                        <div key={idx} className={styles.attemptBox}>
                            <h3>Intento — {a.score}%</h3>

                            {a.answers.map((ans, i) => {
                                const q = questions[i];
                                return (
                                    <div key={i} className={styles.answerItem}>
                                        <p><strong>{i + 1}. {q.question}</strong></p>

                                        <p className={ans === q.correctIndex ? styles.correct : styles.incorrect}>
                                            Respuesta: {q.options[ans]}
                                        </p>

                                        {ans !== q.correctIndex && (
                                            <p className={styles.correctShow}>
                                                Correcta: {q.options[q.correctIndex]}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            <hr />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
