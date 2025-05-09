"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services"; // Importar el nuevo componente
import DiagnosticQuiz from "@/components/diagnostic/DiagnosticQuiz";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Consulting Map Section - NUEVA SECCIÓN */}
      <Services />

      {/* Diagnóstico Rápido Section */}
      <section id="diagnostico" className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-domus font-semibold text-gray-900 mb-4"
            >
              Diagnóstico Rápido
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Descubre tu nivel de aprovechamiento de datos y recibe
              recomendaciones personalizadas en minutos.
            </motion.p>
          </div>

          <DiagnosticQuiz />
        </div>
      </section>

      {/* Proceso Section */}
      <Process />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
