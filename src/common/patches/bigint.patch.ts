/**
 * PostgreSQL devuelve columnas BIGINT/SERIAL8 como BigInt de JavaScript.
 * JSON.stringify no soporta BigInt de forma nativa, este patch lo convierte a string.
 *
 * Importar una sola vez al inicio de la aplicación (main.ts).
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
