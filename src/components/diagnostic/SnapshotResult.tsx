import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ProgressBar from "./ProgressBar";

interface SnapshotResultProps {
  score: number;
  levelName: string;
  description: string;
  primaryOpportunity: string;
  opportunityPercentage: number;
  onContinue: () => void;
  onReset: () => void;
}

const SnapshotResult = ({
  score,
  levelName,
  description,
  primaryOpportunity,
  opportunityPercentage,
  onContinue,
  onReset,
}: SnapshotResultProps) => (
  <motion.div
    key="snapshot"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="py-6"
  >
    <ProgressBar
      currentStep={4}
      totalSteps={5}
      messages={{
        4: "Resultados preliminares - 80% completado",
      }}
    />

    <div className="text-center mb-6">
      <h3 className="text-xl font-domus font-semibold text-gray-900 mb-3">
        Tu diagnóstico preliminar está listo
      </h3>
      <div className="inline-block mb-4 p-3 rounded-full bg-umi-light-blue-40">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
          <span className="text-4xl font-domus text-umi-blue-dark">
            {score}/10
          </span>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-800 mb-2">
        Nivel de madurez analítica: {levelName}
      </p>
      <p className="text-gray-600 max-w-xl mx-auto mb-4">{description}</p>
    </div>

    {/* Una recomendación de muestra para demostrar valor */}
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h4 className="font-domus font-semibold mb-3">
        Oportunidad principal identificada:
      </h4>
      <p className="text-gray-600 mb-4">{primaryOpportunity}</p>
      <div className="flex items-center text-umi-blue-dark">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">
          Más de {opportunityPercentage}% de empresas similares enfrentan este
          desafío
        </span>
      </div>
    </div>

    <div className="bg-umi-blue-dark/5 border border-umi-blue-dark/20 p-6 rounded-lg mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg
            className="w-6 h-6 text-umi-blue-dark"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04m-.023 7.032A11.955 11.955 0 0112 21.056a11.955 11.955 0 019.618-5.04m-9.618-9.072a3.18 3.18 0 00-.023 0m.023 0a3.18 3.18 0 01-.023 0M12 7.757a3 3 0 00-2.12 5.122 3 3 0 002.12.879 3 3 0 002.12-.879 3 3 0 00-2.12-5.122z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h4 className="font-domus font-semibold text-gray-900 mb-2">
            Tu informe completo está listo
          </h4>
          <p className="text-gray-600 mb-4">
            Recibe ahora tu estrategia personalizada con:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-umi-blue-dark mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Diagnóstico detallado de tus 5 áreas de datos</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-umi-blue-dark mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Plan de acción personalizado de 3 pasos</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-umi-blue-dark mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Estimación de ROI potencial para tu negocio</span>
            </li>
          </ul>
          <Button onClick={onContinue} variant="primary" className="w-full">
            Obtener mi informe completo
          </Button>
        </div>
      </div>
    </div>

    <div className="text-center">
      <button
        onClick={onReset}
        className="text-gray-500 hover:text-umi-blue-dark"
      >
        Reiniciar diagnóstico
      </button>
    </div>
  </motion.div>
);

export default SnapshotResult;
