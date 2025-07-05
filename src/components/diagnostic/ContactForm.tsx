import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const ContactForm = ({
  onSubmit,
  isLoading = false,
  errorMessage,
}: ContactFormProps) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<ContactInfo>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<ContactInfo> = {};

    if (!contactInfo.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!contactInfo.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.email = "Formato de email inválido";
    }

    if (!contactInfo.company.trim()) {
      errors.company = "La empresa es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(contactInfo);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[name as keyof ContactInfo]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
                <h4 className="font-medium text-gray-900 mb-1">
                  Análisis detallado personalizado
                </h4>
                <p className="text-sm text-gray-600">
                  Diagnóstico completo de tu situación actual con
                  recomendaciones específicas
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-umi-blue-dark text-white flex items-center justify-center mr-3">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Hoja de ruta estratégica
                </h4>
                <p className="text-sm text-gray-600">
                  Plan de acción paso a paso para implementar mejoras en tu
                  organización
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-umi-blue-dark text-white flex items-center justify-center mr-3">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Estimación de ROI
                </h4>
                <p className="text-sm text-gray-600">
                  Cálculo del retorno de inversión esperado y tiempo de
                  implementación
                </p>
              </div>
            </div>
          </div>

          <div className="bg-umi-light-blue-40 p-4 rounded-lg">
            <p className="text-sm text-umi-blue-dark font-medium">
              📧 Te enviaremos el informe completo por email en los próximos
              minutos
            </p>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactInfo.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-umi-blue-dark focus:border-transparent ${
                  validationErrors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Tu nombre completo"
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email profesional *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactInfo.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-umi-blue-dark focus:border-transparent ${
                  validationErrors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="tu@empresa.com"
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Empresa *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={contactInfo.company}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-umi-blue-dark focus:border-transparent ${
                  validationErrors.company
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Nombre de tu empresa"
                disabled={isLoading}
              />
              {validationErrors.company && (
                <p className="text-sm text-red-600 mt-1">
                  {validationErrors.company}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={contactInfo.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umi-blue-dark focus:border-transparent"
                placeholder="+52 123 456 7890"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-umi-blue-dark hover:bg-umi-light-blue"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando diagnóstico...
                </div>
              ) : (
                "Recibir mi diagnóstico personalizado"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Al enviar este formulario aceptas recibir comunicaciones de Umi
            Consultoría. No compartiremos tu información con terceros.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
