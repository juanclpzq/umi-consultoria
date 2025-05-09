import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    description: string;
  }[];
}

interface QuestionStepProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onPrevious: () => void;
}

const QuestionStep = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedValue,
  onSelect,
  onPrevious,
}: QuestionStepProps) => (
  <motion.div
    key={`question-${question.id}`}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="py-4"
  >
    <ProgressBar
      currentStep={currentQuestion}
      totalSteps={totalQuestions + 2} // +2 for welcome and result steps
      messages={{
        1: "Diagnóstico - Primera pregunta",
        2: "Diagnóstico - Casi a mitad de camino",
        3: "Diagnóstico - Última pregunta",
      }}
    />

    <div className="flex justify-between items-center mb-6">
      <h3 className="font-domus font-semibold text-lg">{question.question}</h3>
      <span className="text-sm text-gray-500">
        Pregunta {currentQuestion} de {totalQuestions}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {question.options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`bg-gray-100 hover:bg-umi-light-blue-40 p-4 rounded-lg text-left transition-colors ${
            selectedValue === option.value
              ? "ring-2 ring-umi-blue-dark bg-umi-light-blue-40"
              : ""
          }`}
        >
          <h4 className="font-semibold mb-2">{option.text}</h4>
          <p className="text-sm text-gray-600">{option.description}</p>
        </button>
      ))}
    </div>

    <div className="flex justify-between mt-4">
      {currentQuestion > 1 && (
        <button
          onClick={onPrevious}
          className="text-umi-blue-dark hover:text-umi-light-blue flex items-center gap-2"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5M5 12L12 19M5 12L12 5"
            />
          </svg>
          Anterior
        </button>
      )}
      <div></div> {/* Spacer */}
    </div>

    <div className="text-center text-sm text-gray-500 pt-6 mt-6 border-t border-gray-200">
      <p>
        {currentQuestion === totalQuestions
          ? "Última pregunta - ¡Ya casi terminas!"
          : `Pregunta ${currentQuestion} de ${totalQuestions} - ¡Sigue avanzando!`}
      </p>
    </div>
  </motion.div>
);

export default QuestionStep;
