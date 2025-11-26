import styles from "./Question.module.css";

export default function Question({ question, index, selected, onSelect }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.text}>
                <span className={styles.index}>{index + 1}.</span> {question.text}
            </h3>

            <div className={styles.options}>
                {question.options.map((op, i) => (
                    <button
                        key={i}
                        className={`${styles.option} ${selected === i ? styles.active : ""
                            }`}
                        onClick={() => onSelect(i)}
                    >
                        {op}
                    </button>
                ))}
            </div>
        </div>
    );
}
