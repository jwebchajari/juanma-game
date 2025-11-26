"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import questions from "@/data/questions.json";
import QRCode from "react-qr-code";

export default function ResultPage() {
  const search = useSearchParams();
  const router = useRouter();
  const answers = useMemo(
    () => JSON.parse(search.get("answers") || "[]"),
    [search]
  );

  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    if (!answers.length) {
      router.push("/game");
      return;
    }

    const calcScoreAndSave = async () => {
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex) correct++;
      });
      const s = Math.round((correct / questions.length) * 100);
      setScore(s);
      const pass = s >= 70;
      setPassed(pass);

      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      await addDoc(collection(db, "attempts"), {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        answers,
        score: s,
        passed: pass,
        createdAt: Timestamp.now(),
      });

      setSaving(false);
    };

    calcScoreAndSave();
  }, [answers, router]);

  const handleShareWhatsApp = () => {
    const text = passed
      ? `Saqué ${score}% en el quiz de cumple y ¡quedé invitado/a! 🎉`
      : `Saqué ${score}% en el quiz de cumple, tengo que conocerlo/a mejor 😂`;
    const url = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  const inviteUrl = "https://tudominio.com/cumple"; // cambiá esto por tu URL real

  if (score === null) {
    return (
      <p className="text-center text-sm text-slate-300">Calculando resultado...</p>
    );
  }

  return (
    <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-6 shadow-lg space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Tu puntaje</h1>
      <p className="text-4xl font-bold text-emerald-400">{score}%</p>

      {passed ? (
        <div className="space-y-2">
          <p className="text-sm text-emerald-300">
            🎉 ¡Felicitaciones! Superaste el 70% y estás invitad@ a mi cumple.
          </p>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs text-slate-300">
              Mostrame este QR o guardalo para tener la info del evento:
            </p>
            <div className="bg-white p-3 rounded-xl inline-block">
              <QRCode value={inviteUrl} size={140} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-red-300">
          No llegaste al 70%, pero igual te quiero (?) Podés hablarme si querés
          revancha 😅
        </p>
      )}

      <button
        onClick={handleShareWhatsApp}
        className="w-full py-3 rounded-2xl bg-emerald-500 text-white text-sm font-medium active:scale-[0.98]"
      >
        Compartir resultado por WhatsApp
      </button>

      {!saving && (
        <p className="text-[11px] text-slate-400">
          Resultado guardado ✅
        </p>
      )}
    </div>
  );
}
