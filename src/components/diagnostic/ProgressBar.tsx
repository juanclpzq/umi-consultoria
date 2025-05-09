import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  messages?: { [key: number]: string };
}

const ProgressBar = ({
  currentStep,
  totalSteps,
  messages,
}: ProgressBarProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>
          {messages && messages[currentStep]
            ? messages[currentStep]
            : `Paso ${currentStep} de ${totalSteps}`}
        </span>
        <span>{Math.round(progressPercentage)}% completado</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="bg-umi-blue-dark h-2.5 rounded-full"
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
