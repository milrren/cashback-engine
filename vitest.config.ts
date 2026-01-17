import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Garante que apenas arquivos dentro de src sejam testados
    include: ['src/**/*.test.ts'],
    // Ignora explicitamente a pasta de build e dependências
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    // Habilita globais para não precisar importar 'describe', 'it', etc em todo arquivo
    globals: true,
    environment: 'node',
  },
});
