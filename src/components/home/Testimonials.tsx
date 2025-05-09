"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface TestimonialCardProps {
  quote: string;
  name: string;
  position: string;
  company: string;
  delay?: number;
}

const TestimonialCard = ({
  quote,
  name,
  position,
  company,
  delay = 0,
}: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full"
  >
    <div className="mb-4 text-umi-light-blue">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 11H6C5.44772 11 5 10.5523 5 10V6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11ZM10 11V14C10 15.6569 8.65685 17 7 17H6M18 11H14C13.4477 11 13 10.5523 13 10V6C13 5.44772 13.4477 5 14 5H18C18.5523 5 19 5.44772 19 6V10C19 10.5523 18.5523 11 18 11ZM18 11V14C18 15.6569 16.6569 17 15 17H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <p className="text-gray-600 italic mb-6 flex-grow">{quote}</p>
    <div>
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-sm text-gray-500">
        {position}, {company}
      </p>
    </div>
  </motion.div>
);

const Testimonials = () => {
  return (
    <section id="testimonios" className="py-20 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
          >
            Lo que dicen nuestros clientes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Descubre cómo hemos ayudado a otras empresas a transformar sus datos
            en resultados.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="La claridad de los datos que Umi nos proporcionó nos permitió identificar oportunidades que desconocíamos. Logramos aumentar nuestras ventas en un 22% en solo tres meses."
            name="Laura Mendoza"
            position="Fundadora"
            company="GreenTech Innovations"
            delay={0.1}
          />
          <TestimonialCard
            quote="Como PyME, teníamos muchos datos dispersos. Umi no solo los organizó, sino que nos mostró exactamente qué hacer con ellos. La inversión se recuperó en el primer trimestre."
            name="Miguel Hernández"
            position="Director General"
            company="Constructora MCH"
            delay={0.3}
          />
          <TestimonialCard
            quote="Las visualizaciones que desarrollaron para nuestro equipo directivo transformaron nuestra toma de decisiones. Ahora todos hablamos el mismo idioma basado en datos concretos."
            name="Carolina Flores"
            position="Directora de Operaciones"
            company="Grupo Soluciones Integrales"
            delay={0.5}
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#contacto"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Ver más casos de éxito
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
