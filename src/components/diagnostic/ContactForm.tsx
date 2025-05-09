import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
}

export interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contactInfo);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="py-6"
    >
      <ProgressBar
        currentStep={5}
        totalSteps={5}
        messages={{
          5: "Paso final - Datos de contacto",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-domus font-semibold text-xl mb-3">
            Tu informe personalizado está listo
          </h3>
          <p className="text-gray-600 mb-6">
            Completa tus datos para recibir inmediatamente:
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-umi-blue-dark text-white flex items-center justify-center mr-3">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1">Diagnóstico completo</h4>
                <p className="text-sm text-gray-600">
                  Análisis detallado de tu madurez analítica
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-umi-blue-dark text-white flex items-center justify-center mr-3">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  Plan de acción personalizado
                </h4>
                <p className="text-sm text-gray-600">
                  Pasos concretos para implementar en tu negocio
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-umi-blue-dark text-white flex items-center justify-center mr-3">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">Calculadora de ROI</h4>
                <p className="text-sm text-gray-600">
                  Estimación de impacto financiero potencial
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="mr-3">
                <img
                  src="/api/placeholder/50/50"
                  alt="CEO"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">Ana Sofía Martínez</p>
                <p className="text-xs text-gray-500">
                  Fundadora, Umi Consultoría
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              "Nuestros clientes que implementaron las recomendaciones de este
              diagnóstico vieron un aumento promedio del 24% en eficiencia
              operativa en los primeros 3 meses."
            </p>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactInfo.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue"
                required
                placeholder="Tu nombre y apellido"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email profesional
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue"
                required
                placeholder="tu@empresa.com"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de tu empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={contactInfo.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue"
                required
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={contactInfo.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue"
                placeholder="Para seguimiento personal"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-umi-blue-dark hover:bg-umi-blue-80 text-white font-semibold py-4 px-6 rounded-md transition-colors duration-300 text-lg"
              >
                Descargar mi informe personalizado
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                Tus datos están seguros. Nunca compartiremos tu información.
                <br />
                Ver nuestra{" "}
                <a href="#" className="underline">
                  política de privacidad
                </a>
                .
              </p>
            </div>
          </form>

          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
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
              <span className="text-sm font-medium">
                Garantía de satisfacción
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Si no encuentras valor en el informe, te ofrecemos una consultoría
              gratuita de 30 minutos con nuestros especialistas.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
