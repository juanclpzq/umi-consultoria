"use client";

import { motion } from "framer-motion";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  delay?: number;
}

const ProcessStep = ({
  number,
  title,
  description,
  delay = 0,
}: ProcessStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="flex gap-6"
  >
    <div className="flex-shrink-0 relative z-10">
      <div className="w-12 h-12 rounded-full bg-umi-blue-dark text-white flex items-center justify-center font-domus font-bold text-xl">
        {number}
      </div>
    </div>
    <div>
      <h3 className="font-domus text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">{description}</p>
    </div>
  </motion.div>
);

const Process = () => {
  return (
    <section id="proceso" className="py-20 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
          >
            Nuestro Proceso
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Un enfoque estructurado y colaborativo para transformar tus datos en
            decisiones estratégicas.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12 relative">
          {/* Línea conectora */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-umi-light-blue-40 z-0"></div>

          <ProcessStep
            number="1"
            title="Diagnóstico Inicial"
            description="Evaluamos tu situación actual, identificamos fuentes de datos y definimos objetivos claros."
            delay={0.1}
          />
          <ProcessStep
            number="2"
            title="Estructuración de Información"
            description="Organizamos y limpiamos tus datos para prepararlos para un análisis efectivo."
            delay={0.3}
          />
          <ProcessStep
            number="3"
            title="Análisis y Visualización"
            description="Interpretamos los datos y creamos dashboards claros que revelan insights valiosos."
            delay={0.5}
          />
          <ProcessStep
            number="4"
            title="Recomendaciones Estratégicas"
            description="Convertimos los hallazgos en recomendaciones accionables para tu negocio."
            delay={0.7}
          />
          <ProcessStep
            number="5"
            title="Implementación y Seguimiento"
            description="Te acompañamos en la aplicación de las estrategias y medimos resultados."
            delay={0.9}
          />
        </div>
      </div>
    </section>
  );
};

export default Process;
