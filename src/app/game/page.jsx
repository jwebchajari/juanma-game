"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Quiz from "@/components/Quiz";
import Loader from "@/components/Loader";
import Link from "next/link";

import questions from "@/data/questions.json";

export default function GamePage() {
    const [userReady, setUserReady] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setUserReady(true);
        });
        return () => unsub();
    }, []);

    if (!userReady) return <Loader text="Cargando..." />;

    if (!user)
        return (
            <div
                style={{
                    padding: "30px",
                    textAlign: "center",
                    background: "white",
                    borderRadius: "14px",
                    maxWidth: "350px",
                    margin: "40px auto",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        color: "#1B4D89",
                        fontWeight: "700",
                        marginBottom: "8px",
                    }}
                >
                    No estás logueado
                </h2>

                <p style={{ color: "#555", marginBottom: "20px" }}>
                    Iniciá sesión para jugar.
                </p>

                <Link
                    href="/"
                    style={{
                        background: "#1B4D89",
                        padding: "12px 18px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "600",
                        display: "inline-block",
                    }}
                >
                    Volver al inicio
                </Link>
            </div>
        );

    return <Quiz questions={questions} />;
}
