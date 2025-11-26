import Quiz from "@/components/Quiz";
import questions from "@/data/questions.json";

export default function GamePage() {
    return (
        <div className="w-full flex justify-center">
            <Quiz questions={questions} />
        </div>
    );
}
