import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import SocialProof from "./SocialProof";

interface ResultPoint {
  title: string;
  description: string;
}

interface FullResultProps {
  title: string;
  description: string;
  recommendationPoints: ResultPoint[];
  contactInfo: {
    name: string;
    email: string;
  };
  onReset: () => void;
}

const FullResult = ({
  title,
  description,
  recommendationPoints,
  contactInfo,
  onReset,
}: FullResultProps) => (
  <motion.div
    key="result"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4 }}
    className="py-8"
  >
    <div className="text-center mb-10">
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-umi-blue-dark text-white mb-4">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04m-.023 7.032A11.955 11.955 0 0112 21.056a11.955 11.955 0 019.618-5.04m-9.618-9.072a3.18 3.18 0 00-.023 0m.023 0a3.18 3.18 0 01-.023 0M12 7.757a3 3 0 00-2.12 5.122 3 3 0 002.12.879 3 3 0 002.12-.879 3 3 0 00-2.12-5.122z"
          />
        </svg>
      </span>
      <h3 className="text-2xl font-domus font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>

      <div className="mt-4 bg-umi-blue-dark/5 rounded-md p-3 inline-block">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Informe enviado a:</span>{" "}
          {contactInfo.email}
        </p>
      </div>
    </div>

    <div className="bg-white shadow-md rounded-lg p-8 mb-8">
      <div className="mb-6">
        <h4 className="font-domus font-semibold text-xl mb-4">
          Plan de acción personalizado
        </h4>
        <p className="text-gray-600 mb-6">
          Basándonos en tu diagnóstico, te recomendamos estas acciones
          específicas para mejorar tu aprovechamiento de datos:
        </p>

        <div className="space-y-6">
          {recommendationPoints.map((point, idx) => (
            <div
              key={idx}
              className="border-l-4 border-umi-blue-dark pl-4 py-1"
            >
              <h5 className="font-medium text-lg mb-1">{point.title}</h5>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="font-medium mb-1">
              ¿Necesitas ayuda para implementar estas recomendaciones?
            </h5>
            <p className="text-sm text-gray-600">
              Agenda una consulta gratuita con nuestros especialistas
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "#contacto")}
          >
            Agendar consulta
          </Button>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h4 className="font-domus font-semibold mb-4">Recursos adicionales</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border border-gray-200">
          <h5 className="font-medium mb-2">Guía de inicio rápido</h5>
          <p className="text-sm text-gray-600 mb-3">
            Primeros pasos para implementar análisis de datos.
          </p>
          <a
            href="#"
            className="text-umi-blue-dark text-sm font-medium flex items-center hover:text-umi-light-blue"
          >
            Descargar PDF
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
        </div>
        <div className="bg-white p-4 rounded border border-gray-200">
          <h5 className="font-medium mb-2">Plantillas de visualización</h5>
          <p className="text-sm text-gray-600 mb-3">
            Dashboard básico para comenzar a visualizar datos.
          </p>
          <a
            href="#"
            className="text-umi-blue-dark text-sm font-medium flex items-center hover:text-umi-light-blue"
          >
            Acceder ahora
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={onReset}
        variant="secondary"
        className="flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Reiniciar diagnóstico
      </Button>
      <Button
        variant="primary"
        onClick={() => (window.location.href = "#contacto")}
      >
        Solicitar consultoría personalizada
      </Button>
    </div>

    <SocialProof />
  </motion.div>
);

export default FullResult;
