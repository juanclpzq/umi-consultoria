// src/components/home/Services.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Definir interfaces para las props
interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image?: string; // Hacer imagen opcional
}

// Datos de los servicios
const servicesData: ServiceData[] = [
  {
    id: "emprendedores",
    title: "Para Emprendedores",
    description:
      "Estructura tus datos desde el inicio para tomar decisiones informadas.",
    icon: "🚀",
    features: [
      "Configuración inicial de sistemas de datos",
      "Métricas clave para startups",
      "Dashboards básicos y funcionales",
      "Análisis de viabilidad",
    ],
    image: "/images/emprendedores.jpg",
  },
  {
    id: "pymes",
    title: "Para PyMEs",
    description: "Organiza y visualiza la información de múltiples proyectos.",
    icon: "📊",
    features: [
      "Integración de sistemas existentes",
      "Automatización de reportes",
      "Análisis de rentabilidad",
      "Optimización de procesos",
    ],
    image: "/images/pymes.jpg",
  },
  {
    id: "directivos",
    title: "Para Directivos",
    description: "Dashboards claros y recomendaciones estratégicas.",
    icon: "📈",
    features: [
      "Dashboards ejecutivos",
      "Análisis predictivo",
      "Reportes estratégicos",
      "KPIs personalizados",
    ],
    image: "/images/directivos.jpg",
  },
];

const ServiceCard = ({
  id,
  title,
  description,
  icon,
  features,
  isHovered,
  onHover,
}: ServiceCardProps) => {
  const service = servicesData.find((s) => s.id === id);

  return (
    <motion.div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      // Corregir el objeto de animación con valores definidos
      animate={
        isHovered
          ? {
              y: -8,
              scale: 1.02,
            }
          : {
              y: 0,
              scale: 1,
            }
      }
      transition={{ duration: 0.3 }}
    >
      {/* Contenido principal */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-umi-blue-dark rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">{icon}</span>
          </div>
          <h3 className="text-xl font-domus font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 mb-4">{description}</p>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-umi-blue-dark mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Imagen de fondo opcional */}
      {service?.image && (
        <div className="absolute inset-0 opacity-0 hover:opacity-5 transition-opacity duration-300">
          <Image
            src={service.image}
            alt={`Servicios ${title}`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Overlay con degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-umi-light-blue-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

const Services = () => {
  // Corregir el tipo del estado
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
          >
            Soluciones Adaptadas a Tu Perfil
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Servicios diseñados específicamente para cada etapa de crecimiento
            empresarial
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
                isHovered={hoveredCard === service.id}
                onHover={setHoveredCard} // Esto ahora es type-safe
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-domus font-semibold text-gray-900 mb-4">
              ¿No estás seguro cuál es el mejor enfoque para tu empresa?
            </h3>
            <p className="text-gray-600 mb-6">
              Realiza nuestro diagnóstico gratuito y recibe recomendaciones
              personalizadas
            </p>
            <Link href="#diagnostico" className="btn-primary">
              Diagnóstico gratuito
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
