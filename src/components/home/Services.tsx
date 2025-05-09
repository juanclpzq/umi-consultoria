"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Define los tipos de consultoría
const consultingTypes = [
  {
    id: "data-analysis",
    title: "Análisis de Datos",
    subtitle: "Transformando información en acción",
    eyebrow: "Servicio",
    category: "Business Intelligence",
    date: "Abril 29, 2025",
    color: "#223979", // umi-blue-dark
    description:
      "Convertimos tus datos en insights accionables mediante visualizaciones claras y análisis profundo para decisiones estratégicas.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070",
  },
  {
    id: "financial",
    title: "Consultoría Financiera",
    subtitle: "Optimización para el crecimiento",
    eyebrow: "Servicio",
    category: "Gestión Financiera",
    date: "Mayo 2, 2025",
    color: "#7692CB", // umi-light-blue
    description:
      "Optimizamos tu estructura financiera para maximizar rentabilidad, controlar costos e impulsar crecimiento sostenible.",
    image:
      "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070",
  },
  {
    id: "brand",
    title: "Estrategia de Marca",
    subtitle: "Conexión con tu audiencia",
    eyebrow: "Servicio",
    category: "Marketing Estratégico",
    date: "Abril 30, 2025",
    color: "#223979",
    description:
      "Desarrollamos tu identidad para conectar con tu audiencia ideal y construir un posicionamiento sólido en el mercado.",
    image:
      "https://images.unsplash.com/photo-1553484771-371a605b060b?q=80&w=2070",
  },
  {
    id: "operations",
    title: "Eficiencia Operativa",
    subtitle: "Procesos que maximizan resultados",
    eyebrow: "Servicio",
    category: "Optimización de Procesos",
    date: "Mayo 3, 2025",
    color: "#7692CB",
    description:
      "Identificamos cuellos de botella y optimizamos procesos para aumentar productividad y reducir costos operativos.",
    image:
      "https://images.unsplash.com/photo-1664575196412-ed801e8333a1?q=80&w=2071",
  },
  {
    id: "digital",
    title: "Transformación Digital",
    subtitle: "Innovación para la nueva era",
    eyebrow: "Servicio",
    category: "Tecnología",
    date: "Abril 27, 2025",
    color: "#223979",
    description:
      "Guiamos tu transición hacia modelos de negocio digitales para aumentar competitividad y adaptación al mercado.",
    image:
      "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=2070",
  },
  {
    id: "market",
    title: "Investigación de Mercado",
    subtitle: "Datos que revelan oportunidades",
    eyebrow: "Servicio",
    category: "Inteligencia de Mercado",
    date: "Mayo 5, 2025",
    color: "#7692CB",
    description:
      "Analizamos tu mercado para identificar oportunidades y tendencias que impulsen decisiones estratégicas efectivas.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
  },
];

const ConsultingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const carouselRef = useRef(null);
  const transitionInProgress = useRef(false);

  // Navegar al anterior
  const handlePrev = () => {
    if (transitionInProgress.current) return;
    transitionInProgress.current = true;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? consultingTypes.length - 1 : prevIndex - 1
    );
    setTimeout(() => {
      transitionInProgress.current = false;
    }, 500); // Duración de la transición
  };

  // Navegar al siguiente
  const handleNext = () => {
    if (transitionInProgress.current) return;
    transitionInProgress.current = true;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % consultingTypes.length);
    setTimeout(() => {
      transitionInProgress.current = false;
    }, 500); // Duración de la transición
  };

  // Reproducción automática infinita
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isPlaying) {
      timerId = setInterval(() => {
        handleNext();
      }, 5000); // Cambiar cada 5 segundos
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isPlaying, handleNext]);

  // Pausar/reanudar reproducción
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Obtener items del carrusel ordenados según la posición actual
  const getCarouselItems = () => {
    const items = [];
    const totalItems = consultingTypes.length;

    // Reordenamos para que el elemento actual sea el central
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalItems) % totalItems;
      items.push({
        ...consultingTypes[index],
        position: i, // -2, -1, 0, 1, 2
        visualPosition: i, // Para animación visual
        globalIndex: index, // Índice real en el array
      });
    }

    return items;
  };

  const carouselItems = getCarouselItems();

  // Obtener el tamaño y posición basados en la posición relativa al central
  const getItemStyle = (position) => {
    // Variables para posición, tamaño y visibilidad
    let width, height, zIndex, x, opacity;

    // Configuración exacta como BCG
    if (position === 0) {
      // Elemento central (current)
      width = 380;
      height = 500;
      zIndex = 20;
      x = 0;
      opacity = 1;
    } else if (position === -1) {
      // Elemento anterior (previous)
      width = 280;
      height = 400;
      zIndex = 10;
      x = -320; // Posicionado a la izquierda
      opacity = 1;
    } else if (position === 1) {
      // Elemento siguiente (next)
      width = 280;
      height = 400;
      zIndex = 10;
      x = 320; // Posicionado a la derecha
      opacity = 1;
    } else if (position === -2) {
      // Elemento anterior al anterior (previous-previous)
      width = 240;
      height = 370;
      zIndex = 5;
      x = -500; // Más a la izquierda
      opacity = 0.8;
    } else if (position === 2) {
      // Elemento siguiente al siguiente (next-next)
      width = 240;
      height = 370;
      zIndex = 5;
      x = 500; // Más a la derecha
      opacity = 0.8;
    }

    return { width, height, zIndex, x, opacity };
  };

  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
          >
            Nuestras Áreas de Consultoría
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Soluciones integrales para potenciar todos los aspectos de tu
            negocio. Explora nuestras especialidades.
          </motion.p>
        </div>

        {/* Carrusel estilo BCG */}
        <div className="relative mb-8">
          {/* Contenedor principal del carrusel */}
          <div
            ref={carouselRef}
            className="relative h-[550px] flex justify-center items-center overflow-hidden"
          >
            {/* Tarjetas del carrusel */}
            {carouselItems.map((item) => {
              const style = getItemStyle(item.position);

              return (
                <motion.div
                  key={`${item.id}-${item.globalIndex}`}
                  className="absolute rounded-md shadow-md overflow-hidden cursor-pointer"
                  style={{
                    zIndex: style.zIndex,
                    width: style.width,
                    height: style.height,
                    borderColor: item.color,
                    borderWidth: item.position === 0 ? "1px" : "0px",
                  }}
                  initial={false}
                  animate={{
                    x: style.x,
                    opacity: style.opacity,
                    width: style.width,
                    height: style.height,
                  }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                  }}
                  onClick={() => {
                    if (item.position !== 0) {
                      setCurrentIndex(item.globalIndex);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Imagen con gradientes */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes={`(max-width: 768px) 100vw, ${style.width}px`}
                      className="object-cover"
                      style={{
                        filter:
                          hoveredItem === item.id
                            ? "brightness(30%)"
                            : "brightness(100%)",
                      }}
                    />

                    {/* Gradiente superior */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent"></div>

                    {/* Gradiente inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                    {/* Sección superior */}
                    <div>
                      {/* Categoría - Visible en tarjeta central y tarjetas cercanas */}
                      {Math.abs(item.position) <= 1 && (
                        <div className="mb-1">
                          <span className="text-white text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                      )}

                      {/* Contenedor para título/subtítulo - Estilo BCG */}
                      <div className="bg-black/30 backdrop-blur-sm p-3 rounded">
                        {/* Eyebrow */}
                        {item.position === 0 && (
                          <div className="text-white/80 text-xs mb-1">
                            {item.eyebrow}
                          </div>
                        )}

                        {/* Fecha - Solo en tarjeta central */}
                        {item.position === 0 && (
                          <div className="text-white/80 text-xs mb-2">
                            {item.date}
                          </div>
                        )}

                        {/* Título */}
                        <h3
                          className={`font-semibold text-white ${item.position === 0 ? "text-xl" : "text-base"}`}
                        >
                          {item.title}
                        </h3>

                        {/* Subtítulo - solo visible en tarjeta central */}
                        {item.position === 0 && (
                          <p className="text-white/90 text-sm mt-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descripción - Solo aparece en hover */}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="bg-black/30 backdrop-blur-sm p-3 rounded"
                        >
                          <p className="text-white text-sm">
                            {item.description}
                          </p>

                          {/* CTA */}
                          <div className="mt-3">
                            <a
                              href="#contacto"
                              className="text-white text-sm flex items-center hover:text-umi-light-blue"
                            >
                              Conocer más
                              <svg
                                className="w-3 h-3 ml-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controles del carrusel - Estilo BCG */}
          <div className="flex justify-center mt-6 gap-3">
            {/* Botón pausa/play */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white shadow-md rounded flex items-center justify-center text-umi-blue-dark hover:bg-umi-blue-dark hover:text-white transition-colors"
              aria-label={
                isPlaying ? "Pausar reproducción" : "Iniciar reproducción"
              }
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="5 3 19 12 5 21" />
                </svg>
              )}
            </button>

            {/* Botón anterior */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 bg-white shadow-md rounded flex items-center justify-center text-umi-blue-dark hover:bg-umi-blue-dark hover:text-white transition-colors"
              aria-label="Anterior"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Botón siguiente */}
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white shadow-md rounded flex items-center justify-center text-umi-blue-dark hover:bg-umi-blue-dark hover:text-white transition-colors"
              aria-label="Siguiente"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center mt-4">
            {consultingTypes.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 mx-1 rounded-full ${
                  currentIndex === i ? "bg-umi-blue-dark" : "bg-gray-300"
                } transition-all duration-300`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingCarousel;
