"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const ServiceCard = ({
  title,
  description,
  icon,
  delay = 0,
}: ServiceCardProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="bg-umi-blue-dark w-12 h-12 rounded-full flex items-center justify-center mb-6">
      <span className="text-white text-2xl">{icon}</span>
    </div>
    <h3 className="font-domus text-xl font-semibold text-gray-900 mb-3">
      {title}
    </h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Services = () => {
  return (
    <section id="servicios" className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Soluciones adaptadas a cada perfil de cliente, enfocadas en
            resultados tangibles.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="Para Emprendedores"
            description="Estructura tus datos desde el inicio para tomar decisiones informadas. Ideal para startups y negocios en fase inicial."
            icon="🚀"
            delay={0.1}
          />
          <ServiceCard
            title="Para PyMEs"
            description="Organiza y visualiza la información de múltiples proyectos para optimizar procesos y aumentar la rentabilidad."
            icon="📊"
            delay={0.3}
          />
          <ServiceCard
            title="Para Directivos"
            description="Obtén dashboards claros y recomendaciones estratégicas para decisiones ejecutivas basadas en datos concretos."
            icon="📈"
            delay={0.5}
          />
        </div>

        <div className="mt-16 bg-gray-50 p-8 md:p-12 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl font-domus font-semibold text-gray-900 mb-4"
              >
                Visualización de Datos Simplificada
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-6"
              >
                Transformamos datos complejos en visualizaciones claras e
                intuitivas que facilitan la comprensión y aceleran la toma de
                decisiones.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="#contacto" className="btn-primary">
                  Solicitar demostración
                </Link>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="relative h-64 w-full bg-gray-100 rounded overflow-hidden"
                >
                  {/* Simple data visualization mockup */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-umi-light-blue-40 rounded-t-lg"></div>
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-umi-light-blue-60 rounded-t-lg"></div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-umi-light-blue-80 rounded-t-lg"></div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-umi-blue-dark rounded-t-lg"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      Vista previa de visualización
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
