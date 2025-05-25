export const {
  PORT = 3000,
  SALT_ROUNDS = 10, // para el tema de hashes sobre la password // Prod = 10, Test = 1
  SECRETE_JWT_KEY = 'ningunValorPorDefecto-traerloPorEnv-debeSerMuchoMasLargoYseguro'
} = process.env
