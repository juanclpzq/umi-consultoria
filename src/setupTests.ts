// src/setupTests.ts
import { jest } from "@jest/globals";
import { existsSync, unlinkSync, readdirSync } from "fs";
import path from "path";

// Configurar variables de entorno para tests
// Usar Object.assign para evitar el error de read-only
Object.assign(process.env, { NODE_ENV: "test" });
process.env.DATABASE_PATH = "./data/test-leads.db";

// Función para limpiar archivos de test de base de datos
const cleanTestDatabases = () => {
  const dataDir = path.join(process.cwd(), "data");

  if (existsSync(dataDir)) {
    const files = readdirSync(dataDir);
    files.forEach((file) => {
      if (file.includes("test") && file.endsWith(".db")) {
        const filePath = path.join(dataDir, file);
        try {
          unlinkSync(filePath);
          console.log(`🧹 Archivo de test eliminado: ${file}`);
        } catch {
          // Ignorar errores de archivos que no se pueden eliminar
          console.warn(`⚠️ No se pudo eliminar: ${file}`);
        }
      }
    });
  }
};

// Setup antes de todos los tests
beforeAll(() => {
  console.log("🚀 Iniciando configuración de tests...");
  cleanTestDatabases();
});

// Cleanup después de todos los tests
afterAll(() => {
  console.log("🧹 Limpiando después de todos los tests...");
  cleanTestDatabases();
});

// Cleanup después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
