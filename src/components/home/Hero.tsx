"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const DataVisualizationHero = () => (
  <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-umi-blue-60 to-umi-light-blue-40"></div>

    {/* Elementos de datos */}
    <div className="absolute inset-0">
      {/* Gráficas abstractas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {/* Líneas de conexión */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 500"
          className="absolute inset-0"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M100,100 Q150,50 200,100 T300,100 T400,100"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            d="M100,200 Q200,150 300,200 T400,180"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            d="M150,300 Q200,250 300,300 T450,320"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
        </svg>

        {/* Puntos de datos */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-1/4 left-1/5 w-6 h-6 bg-white rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute top-2/3 left-1/4 w-8 h-8 bg-white rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-white rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="absolute top-1/3 right-1/4 w-5 h-5 bg-white rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="absolute top-1/2 right-1/3 w-7 h-7 bg-white rounded-full"
        />

        {/* Pequeñas barras de datos */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.7 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-1/4 left-1/3 w-3 h-20 bg-white origin-bottom"
        />
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-1/4 left-1/3 ml-8 w-3 h-28 bg-white origin-bottom"
        />
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-1/4 left-1/3 ml-16 w-3 h-16 bg-white origin-bottom"
        />
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-1/4 left-1/3 ml-24 w-3 h-32 bg-white origin-bottom"
        />
      </motion.div>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-umi-blue-dark to-umi-blue-80 text-white pt-28 pb-20 md:pt-32 md:pb-24">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-domus font-semibold leading-tight mb-6"
            >
              Decisiones estratégicas respaldadas por datos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-2xl mb-8 font-sans font-light"
            >
              Convertimos información compleja en visualizaciones claras y
              recomendaciones accionables para potenciar el crecimiento de tu
              negocio.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#diagnostico" className="btn-primary">
                Diagnóstico gratuito
              </Link>
              <Link href="#servicios" className="btn-secondary">
                Conocer servicios
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6 md:gap-8"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Para emprendedores</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Para PyMEs</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Para directivos</span>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <DataVisualizationHero />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
