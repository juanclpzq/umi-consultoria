import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface WelcomeProps {
  onStart: () => void;
}

const Welcome = ({ onStart }: WelcomeProps) => (
  <motion.div
    key="welcome"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="text-center py-8"
  >
    <div className="mb-6">
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-umi-blue-dark text-white mb-4">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 3.5V2m6 0v1.5m-3 0V2m3 0h3A2.5 2.5 0 0121 4.5v3m0 6v3a2.5 2.5 0 01-2.5 2.5h-3m-6 0h-3A2.5 2.5 0 013 16.5v-3m0-6v-3A2.5 2.5 0 015.5 2h3M12 7v5l3 3m4.5-4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          />
        </svg>
      </span>
      <h3 className="text-2xl font-domus font-semibold text-gray-900 mb-3">
        Diagnóstico de madurez analítica
      </h3>
      <p className="text-gray-600 mb-4 max-w-lg mx-auto">
        En menos de 2 minutos, descubre dónde se encuentra tu negocio en su
        aprovechamiento de datos y recibe una estrategia personalizada.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold mb-1">89%</p>
        <p className="text-sm text-gray-600">
          de las empresas mejoran su toma de decisiones con análisis de datos
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold mb-1">2-3x</p>
        <p className="text-sm text-gray-600">
          mayor ROI cuando los datos se analizan correctamente
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold mb-1">5 min</p>
        <p className="text-sm text-gray-600">
          para obtener tu estrategia personalizada
        </p>
      </div>
    </div>

    <Button
      onClick={onStart}
      variant="primary"
      className="px-8 inline-flex items-center"
    >
      Comenzar mi diagnóstico gratuito
      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Button>

    <p className="text-xs text-gray-500 mt-4">
      Ya lo han completado más de 320 empresas este mes
    </p>
  </motion.div>
);

export default Welcome;
