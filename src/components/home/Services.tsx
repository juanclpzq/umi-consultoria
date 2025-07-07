// src/components/home/Services.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Definir interfaces
interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  color: string;
  stats: {
    metric: string;
    value: string;
  };
  cta: string;
}

// Datos de los servicios con imágenes y animaciones
const servicesData: ServiceData[] = [
  {
    id: "emprendedores",
    title: "Para Emprendedores",
    subtitle: "Construye desde datos sólidos",
    description:
      "Estructura tus datos desde el inicio para tomar decisiones informadas y escalar de manera inteligente.",
    icon: "🚀",
    features: [
      "Configuración inicial de sistemas de datos",
      "Métricas clave para validación de startup",
      "Dashboards básicos y funcionales",
      "Análisis de viabilidad y mercado",
      "Automatización de reportes básicos",
    ],
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    color: "from-blue-500 to-purple-600",
    stats: {
      metric: "Tiempo de setup",
      value: "2-3 semanas",
    },
    cta: "Empezar mi startup con datos",
  },
  {
    id: "pymes",
    title: "Para PyMEs",
    subtitle: "Optimiza y escala eficientemente",
    description:
      "Organiza y visualiza la información de múltiples proyectos para maximizar rentabilidad y eficiencia operacional.",
    icon: "📊",
    features: [
      "Integración de sistemas existentes",
      "Automatización completa de reportes",
      "Análisis profundo de rentabilidad",
      "Optimización de procesos críticos",
      "Predicciones de cash flow",
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    color: "from-green-500 to-teal-600",
    stats: {
      metric: "ROI promedio",
      value: "240% en 6 meses",
    },
    cta: "Optimizar mi PyME",
  },
  {
    id: "directivos",
    title: "Para Directivos",
    subtitle: "Decisiones estratégicas precisas",
    description:
      "Dashboards ejecutivos claros y recomendaciones estratégicas basadas en análisis predictivo avanzado.",
    icon: "📈",
    features: [
      "Dashboards ejecutivos en tiempo real",
      "Análisis predictivo avanzado",
      "Reportes estratégicos automatizados",
      "KPIs personalizados por área",
      "Alertas inteligentes de negocio",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    color: "from-purple-500 to-pink-600",
    stats: {
      metric: "Mejora en toma de decisiones",
      value: "87% más rápida",
    },
    cta: "Transformar mi gestión",
  },
];

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Auto-play del carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % servicesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % servicesData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + servicesData.length) % servicesData.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentService = servicesData[currentIndex];

  // Guardia para evitar errores si no hay servicio
  if (!currentService) {
    return null;
  }

  return (
    <section
      id="servicios"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Soluciones Adaptadas a Tu{" "}
            <span className="bg-gradient-to-r from-[#223979] to-[#7692CB] bg-clip-text text-transparent">
              Perfil
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Servicios diseñados específicamente para cada etapa de crecimiento
            empresarial, con metodologías probadas y resultados medibles.
          </motion.p>
        </div>

        {/* Carousel Principal */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                {/* Contenido */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${currentService.color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}
                    >
                      <span className="text-3xl">{currentService.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {currentService.title}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1">
                        {currentService.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {currentService.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {currentService.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="w-5 h-5 text-[#7692CB] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#223979] mb-2">
                        {currentService.stats.value}
                      </div>
                      <div className="text-gray-600">
                        {currentService.stats.metric}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-r ${currentService.color} text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center group shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {currentService.cta}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                {/* Imagen */}
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${currentService.color} opacity-20`}
                  />
                  <Image
                    src={currentService.image}
                    alt={`Servicios ${currentService.title}`}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay con patrón de datos */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold mb-1">
                        {currentService.stats.value}
                      </div>
                      <div className="text-sm opacity-90">
                        {currentService.stats.metric}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles del Carousel */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-3">
          {servicesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-12 h-3 bg-[#223979] rounded-full"
                  : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Cards de resumen debajo del carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                currentIndex === index
                  ? "border-[#7692CB] bg-gradient-to-br from-blue-50 to-purple-50"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center mr-4`}
                >
                  <span className="text-xl">{service.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900">{service.title}</h4>
              </div>

              <p className="text-sm text-gray-600 mb-4">{service.subtitle}</p>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#223979] mb-1">
                  {service.stats.value}
                </div>
                <div className="text-xs text-gray-500">
                  {service.stats.metric}
                </div>
              </div>

              {hoveredCard === service.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <button className="text-[#223979] text-sm font-medium hover:text-[#7692CB] transition-colors">
                    Ver detalles →
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-[#223979] to-[#7692CB] p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿No estás seguro cuál es el mejor enfoque para tu empresa?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Realiza nuestro diagnóstico gratuito de 5 minutos y recibe
              recomendaciones personalizadas
            </p>
            <Link
              href="#diagnostico"
              className="inline-flex items-center bg-white text-[#223979] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Diagnóstico gratuito
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
