import styles from "./Question.module.css";

export default function Question({ question, index, selected, onSelect }) {
    return (
        <div className={styles.card}>
            <p className={styles.qText}>
                {index + 1}. {question.text}
            </p>

            {question.options.map((opt, i) => (
                <button
                    key={i}
                    className={`${styles.option} ${selected === i ? styles.selected : ""
                        }`}
                    onClick={() => onSelect(i)}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}
