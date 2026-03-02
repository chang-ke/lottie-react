import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/types/**", // Pure types, erased at runtime
        "src/test/**", // Test utilities and mocks
        "src/index.ts", // Barrel re-export
        "src/player/index.ts",
        "src/interactivity/index.ts",
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 95,
      },
    },
  },
});
