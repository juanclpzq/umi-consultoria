"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

// Estados del formulario
type FormStatus = "idle" | "sending" | "success" | "error";

interface FormState {
  status: FormStatus;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    need: "emprendedor",
    message: "",
  });

  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (formState.status === "error") {
      setFormState({ status: "idle", message: "" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica del frontend
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormState({
        status: "error",
        message: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormState({
        status: "error",
        message: "Por favor ingresa un email válido.",
      });
      return;
    }

    setFormState({ status: "sending", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormState({
          status: "success",
          message:
            "¡Gracias! Hemos recibido tu consulta. Te contactaremos pronto.",
        });

        // Limpiar formulario después del éxito
        setFormData({
          name: "",
          email: "",
          company: "",
          need: "emprendedor",
          message: "",
        });

        // Opcional: Tracking para analytics
        if (typeof window !== "undefined" && "gtag" in window) {
          const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
          gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: formData.need,
          });
        }
      } else {
        setFormState({
          status: "error",
          message:
            result.error ||
            "Hubo un error al enviar tu consulta. Inténtalo de nuevo.",
        });
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setFormState({
        status: "error",
        message:
          "Error de conexión. Verifica tu internet e inténtalo de nuevo.",
      });
    }
  };

  // Función para obtener los colores del estado del formulario
  const getStatusColor = () => {
    switch (formState.status) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <section id="contacto" className="py-20 bg-umi-blue-dark text-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Información de contacto */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-domus font-semibold mb-6"
            >
              ¿Listo para transformar tus datos en{" "}
              <span className="text-umi-light-blue">ventaja competitiva</span>?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              Contáctanos para una consulta personalizada. Analizaremos tu
              situación actual y te presentaremos un plan de acción específico
              para tu empresa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-umi-light-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Consulta inicial gratuita de 30 minutos
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-umi-light-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Análisis de tu situación actual sin compromiso
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-umi-light-blue"
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
                  Te contactaremos en las próximas 2 horas
                </span>
              </div>
            </motion.div>
          </div>

          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white text-gray-900 p-8 rounded-lg shadow-lg"
          >
            <h3 className="font-domus font-semibold text-2xl mb-6">
              Contáctanos
            </h3>

            {/* Mensaje de estado */}
            {formState.message && (
              <div className={`p-4 rounded-lg border mb-6 ${getStatusColor()}`}>
                <div className="flex items-center">
                  {formState.status === "success" ? (
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">
                    {formState.message}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={formState.status === "sending"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue disabled:opacity-50"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={formState.status === "sending"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue disabled:opacity-50"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Empresa
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={formState.status === "sending"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue disabled:opacity-50"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div>
                <label
                  htmlFor="need"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ¿Cuál es tu necesidad?
                </label>
                <select
                  id="need"
                  name="need"
                  value={formData.need}
                  onChange={handleChange}
                  disabled={formState.status === "sending"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue disabled:opacity-50"
                >
                  <option value="emprendedor">
                    Soy emprendedor buscando estructurar mis datos
                  </option>
                  <option value="pyme">
                    Representamos una PyME con múltiples proyectos
                  </option>
                  <option value="directivo">
                    Soy directivo y necesito tomar decisiones basadas en datos
                  </option>
                  <option value="otro">Otra necesidad</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={formState.status === "sending"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-umi-light-blue focus:border-umi-light-blue disabled:opacity-50"
                  placeholder="Cuéntanos sobre tu proyecto y necesidades específicas..."
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center"
                  disabled={formState.status === "sending"}
                >
                  {formState.status === "sending" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </Button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Al enviar este formulario aceptas nuestra{" "}
                  <a href="#" className="underline hover:text-umi-blue-dark">
                    política de privacidad
                  </a>
                  . Te contactaremos en las próximas 2 horas.
                </p>
              </div>
            </form>

            {/* Información adicional de confianza */}
            {formState.status !== "success" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04m-.023 7.032A11.955 11.955 0 0112 21.056a11.955 11.955 0 019.618-5.04"
                      />
                    </svg>
                    Respuesta garantizada
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Datos seguros
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Consulta gratuita
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
