// src/setupTests.ts
import { jest } from "@jest/globals";
import { existsSync, unlinkSync, readdirSync } from "fs";
import path from "path";

// Configurar variables de entorno para tests
process.env.NODE_ENV = "test";
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
        } catch (error) {
          // Ignorar errores de archivos que no se pueden eliminar
        }
      }
    });
  }
};

// Setup antes de todos los tests
beforeAll(() => {
  cleanTestDatabases();
});

// Cleanup después de todos los tests
afterAll(() => {
  cleanTestDatabases();
});

// Cleanup después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
